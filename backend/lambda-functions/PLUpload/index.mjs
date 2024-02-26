import mysql from "mysql2/promise";
import { tokenVerify } from "./util.mjs";

const dbConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.DATABASE_NAME,
};

const connection = await mysql.createConnection(dbConfig);
export const handler = async (event) => {
  const tokenResponse = tokenVerify(event.params.header["Authorization"]);
  if (tokenResponse.statusCode !== 200) {
    return tokenResponse;
  }
  // TODO implement
  try {
    // Assuming the file is sent in the request body
    const { uploadTime, fileName } = event.body; // You may need to adjust this based on your actual use case
    const bucketName = "bllists";

    // Generate a unique filename or use the original filename
    const objectName = `${uploadTime}_${fileName}`;

    // Save the S3 URL to MySQL/RDS
    const s3Url = `https://${bucketName}.s3.amazonaws.com/${objectName}`;
    const query =
      "INSERT INTO pending_lists (listname, s3_url, created_date) VALUES (?, ?, ?)";
    const values = [fileName, s3Url, new Date(uploadTime).toISOString()];
    const [rows] = await connection.execute(query, values);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Pending list saved" }),
    };
  } catch (error) {
    console.log("ERROORRR:: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error uploading file." }),
    };
  }
};
