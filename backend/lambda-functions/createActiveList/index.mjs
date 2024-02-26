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
    console.log("In the create active item handler");
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    event.user = tokenResponse.user;

    const connection = await mysql.createConnection(dbConfig);
    const {
      list_status,
      BL_id,
      brand,
      radiation,
      chemical,
      hs_code,
      actual_quantity,
      unit_weight,
      total_weight,
      unit,
      total_price,
      unit_price,
      item_name,
      unit_pieces,
      total_pieces,
      final_quantity,
      UOM,
    } = event.body;

    let query = `INSERT INTO active_lists
        (
          BL_id,
          actual_quantity,
          unit_weight,
          total_weight,
          unit,
          total_price,
          unit_price,
          item_name,
          brand,
          radiation,
          chemical,
          hs_code,
          unit_pieces,
          total_pieces,
          final_quantity
        ) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    let values = [
      BL_id,
      actual_quantity,
      unit_weight,
      total_weight,
      unit,
      total_price,
      unit_price,
      item_name,
      brand,
      radiation,
      chemical,
      hs_code,
      unit_pieces,
      total_pieces,
      final_quantity,
    ];

    // Query the users table
    console.log("FINAL QUERY INSERT:", query);
    console.log("FINAL VALUES INSERT:", values);
    const [alists] = await connection.execute(query, values);

    if (list_status === "Not-Started") {
      query = `UPDATE pending_lists SET list_status='In-Progress' WHERE plist_id=${BL_id}`;
      console.log("QUERY at not-started: ", query);
      const [pl_update] = await connection.execute(query, values);
      console.log("pl updated:", pl_update);
    }

    // Close the database connection
    await connection.end();

    // Return the fetched users
    return {
      statusCode: 200,
      alists: alists,
    };
  } catch (error) {
    console.error("Error in getting pending lists: ", error.message);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
