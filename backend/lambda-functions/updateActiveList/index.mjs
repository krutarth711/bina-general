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
    const {
      alist_id,
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

    const setClause = [];
    if (actual_quantity !== undefined)
      setClause.push(`actual_quantity = ${actual_quantity}`);
    if (unit_weight !== undefined)
      setClause.push(`unit_weight = ${unit_weight}`);
    if (total_weight !== undefined)
      setClause.push(`total_weight = ${total_weight}`);
    if (unit !== undefined) setClause.push(`unit = '${unit}'`);
    if (radiation !== undefined) setClause.push(`radiation = '${radiation}'`);
    if (chemical !== undefined) setClause.push(`chemical = '${chemical}'`);
    if (hs_code !== undefined) setClause.push(`hs_code = '${hs_code}'`);
    if (total_price !== undefined)
      setClause.push(`total_price = ${total_price}`);
    if (unit_price !== undefined) setClause.push(`unit_price = ${unit_price}`);
    if (item_name !== undefined) setClause.push(`item_name = '${item_name}'`);
    if (brand !== undefined) setClause.push(`brand = '${brand}'`);
    if (unit_pieces !== undefined)
      setClause.push(`unit_pieces = '${unit_pieces}'`);
    if (total_pieces !== undefined)
      setClause.push(`total_pieces = '${total_pieces}'`);
    if (final_quantity !== undefined)
      setClause.push(`final_quantity = '${final_quantity}'`);

    let query = `UPDATE active_lists SET ${setClause.join(
      ", "
    )} WHERE alist_id=${alist_id}`;

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
