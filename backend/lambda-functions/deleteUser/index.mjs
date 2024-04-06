import mysql from "mysql2/promise";

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

      const { user_id } = event.body;

      const query = `DELETE FROM users WHERE user_id = ${user_id}`;

      try {
        // Query the users table
        const [result] = await connection.execute(query);
        // Close the database connection
        await connection.end();
        return {
          statusCode: 200,
          message: "User deleted successfully",
        };
      } catch (error) {
        // Close the database connection anyways
        await connection.end();
        return {
          statusCode: 500,
          error: "Error while deleting user",
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
