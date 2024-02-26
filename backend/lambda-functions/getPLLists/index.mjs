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
  console.log("EVENNTT:: ", event);
  try {
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    event.user = tokenResponse.user;
    console.log("tokenResponse: ", tokenResponse);

    const connection = await mysql.createConnection(dbConfig);
    const { status } = event.params.querystring;

    let query = "SELECT * FROM pending_lists";

    if (status) {
      if (event.user.role === "Super Admin" || event.user.role === "Admin") {
        query = `${query} WHERE list_status='In-Review'`;
      } else {
        query = `${query} WHERE list_status="In-Progress"`;
      }
    }

    query = `${query} ORDER BY created_date ASC`;

    console.log("entire query: ", query);

    // Query the users table
    const [rows] = await connection.execute(query);

    // Close the database connection
    await connection.end();

    // Return the fetched users
    return {
      statusCode: 200,
      plists: rows,
    };
  } catch (error) {
    console.error("Error in getting pending lists: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
