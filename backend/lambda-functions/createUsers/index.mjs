import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { tokenVerify } from "./util.mjs";

const dbConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.DATABASE_NAME,
};
export const handler = async (event) => {
  try {
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    event.user = tokenResponse.user;
    if (event.user.role === "Super Admin") {
      const connection = await mysql.createConnection(dbConfig);

      const { username, password, email, role } = event.body;

      if (!username) {
        return {
          statusCode: 403,
          error: "Username is required",
        };
      }

      if (!password) {
        return {
          statusCode: 403,
          error: "Password is required",
        };
      }

      if (!email) {
        return {
          statusCode: 403,
          error: "Email is required",
        };
      }

      if (!role) {
        return {
          statusCode: 403,
          error: "Role is required",
        };
      }

      const hashedPassword = bcrypt.hashSync(password, 10);

      const query =
        "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)";
      const values = [username, hashedPassword, email, role];

      try {
        // Query the users table
        const [result] = await connection.execute(query, values);
        // Close the database connection
        await connection.end();
        return {
          statusCode: 200,
          message: "User added successfully",
        };
      } catch (error) {
        // Close the database connection anyways
        await connection.end();
        return {
          statusCode: 500,
          error: "Error while adding user",
          message: error.message,
        };
      }
    } else {
      return {
        statusCode: 401,
        message: "You are not authorized to access this",
      };
    }
  } catch (error) {
    console.error("Error in getting users: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
