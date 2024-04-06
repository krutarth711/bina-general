// fetch active lists with BL_id coming as param;
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

    let { BL_id } = event.params.querystring;
    BL_id = parseInt(BL_id);

    if (!BL_id) {
      return {
        statusCode: 400,
        error: "Should pass BL_id",
      };
    }

    const connection = await mysql.createConnection(dbConfig);

    let activeListQuery = `SELECT * FROM active_lists WHERE BL_id = ${BL_id} ORDER BY createdAt ASC`;
    let pendingListQuery = `SELECT listname, list_status FROM pending_lists WHERE plist_id = ${BL_id}`;
    // , pending_lists.listname, pending_lists.list_status

    // Query the active list table
    const [rows] = await connection.execute(activeListQuery);
    const [plist] = await connection.execute(pendingListQuery);

    // Close the database connection
    await connection.end();

    // Return the fetched users
    return {
      statusCode: 200,
      alists: rows,
      plist: plist[0],
    };
  } catch (error) {
    console.error("Error in getting pending lists: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
