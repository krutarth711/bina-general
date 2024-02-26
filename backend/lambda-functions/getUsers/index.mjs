import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
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
    if (event.user.role === "Admin" || event.user.role === "Super Admin") {
      const connection = await mysql.createConnection(dbConfig);

      // Query the users table
      const [rows] = await connection.execute(
        "SELECT user_id, username, email, role FROM users"
      );

      // Close the database connection
      await connection.end();

      // Return the fetched users
      return {
        statusCode: 200,
        users: rows,
      };
    } else {
      return {
        statusCode: 401,
        error: "You are not authorized to access this",
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
