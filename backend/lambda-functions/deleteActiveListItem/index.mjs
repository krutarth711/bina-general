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
    console.log("In the delete active item handler");
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    event.user = tokenResponse.user;

    const connection = await mysql.createConnection(dbConfig);
    const { alist_id } = event.body;

    let query = `DELETE FROM active_lists
        where alist_id = ?`;
    let values = [alist_id];

    // Query the users table
    console.log("FINAL QUERY INSERT:", query);
    console.log("FINAL VALUES INSERT:", values);
    const [alists] = await connection.execute(query, values);

    // Close the database connection
    await connection.end();

    // Return the fetched users
    return {
      statusCode: 200,
      alists: alists,
    };
  } catch (error) {
    console.error("Error in deleting pending lists: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
