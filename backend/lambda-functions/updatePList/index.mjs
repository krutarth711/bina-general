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

    const connection = await mysql.createConnection(dbConfig);
    const { plist_id, status } = event.body;

    let query = `UPDATE pending_lists SET list_status='${status}' WHERE plist_id=${plist_id}`;

    // Query the users table
    console.log("FINAL QUERY INSERT/UPDATE:", query);
    const [alists] = await connection.execute(query);

    // Close the database connection
    await connection.end();

    // Return the fetched users
    return {
      statusCode: 200,
      alists: alists,
    };
  } catch (error) {
    console.error("Error in updating active list: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
