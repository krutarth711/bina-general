import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

import mysql from "mysql2/promise";
import { tokenVerify } from "./util.mjs";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { Readable } from "stream";

const dbConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.DATABASE_NAME,
};

export const handler = async (event) => {
  const srcBucket = "bulandinvoicestest";
  const inputKey = "input/Buland-word-input.docx";
  const outputKey = `output/buland-output-${Date.now()}.docx`;

  try {
    console.log(
      'event.params.header["Authorization"]',
      event.params.header["Authorization"]
    );
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    event.user = tokenResponse.user;
    const connection = await mysql.createConnection(dbConfig);

    const { BL_id } = event.body;

    const query = `SELECT active_lists.*, pending_lists.listname FROM active_lists JOIN pending_lists on active_lists.BL_id = pending_lists.plist_id WHERE BL_id = ${BL_id}`;

    const [rows] = await connection.execute(query);
    let listItems = [];
    let grand_total = 0;
    let grand_net_weight = 0;
    let grand_package_total = 0;

    if (rows.length < 1) {
      return {
        statusCode: 200,
        body: "No active list items to generate invoice",
      };
    }

    let listName = rows[0].listname.replace(".pdf", "");
    for (let i = 0; i < rows.length; i++) {
      listItems.push({
        index: i + 1,
        hs_code: rows[i].hs_code || null,
        item_name: rows[i].item_name || "",
        brand: rows[i].brand || "",
        pdate: "01/10/2023",
        edate: "01/09/2025",
        origin: "INDIA",
        UOM: rows[i].UOM,
        final_quantity: rows[i].final_quantity || 0,
        unit_weight: rows[i].unit_weight || 0,
        unit: rows[i].unit || "",
        unit_pieces: rows[i].unit_pieces || 0,
        unit_price: rows[i].unit_price || 0,
        total_price: rows[i].total_price || 0,
      });
      grand_total += rows[i].total_price;
      grand_package_total += rows[i].final_quantity;
      grand_net_weight += rows[i].total_weight;
    }

    // Fetch the input file from S3
    const s3Client = new S3Client({ region: "us-east-1" });
    const data = await s3Client.send(
      new GetObjectCommand({ Bucket: srcBucket, Key: inputKey })
    );
    const stream = Readable.from(data.Body);

    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const content = Buffer.concat(chunks);

    // Unzip the content of the file
    const zip = new PizZip(content);

    // Initialize the docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Render the document with your data
    doc.render({
      company_name: listName || "",
      po_box: "2048",
      company_telephone: "+97142200944",
      company_fax1: "+97142200944",
      company_fax2: "+971502707255",
      company_address1: "Jhamury and Aggrey Street",
      company_address2: "Dar-ES-Salaam",
      company_address3: "Tanzania, East Africa",
      company_email: "binaentltd@gmail.com",
      company_mobile: "+255 715 432 480",
      list_date: "21-12-2023",
      grand_package_total: grand_package_total,
      grand_weight: grand_net_weight,
      grand_net_weight: grand_net_weight,
      grand_total: grand_total,
      users: listItems,
    });

    // Generate the output file as a nodebuffer
    const buf = doc
      .getZip()
      .generate({ type: "nodebuffer", compression: "DEFLATE" });
    // Upload the output file to S3

    const uploadResult = await s3Client.send(
      new PutObjectCommand({ Bucket: srcBucket, Key: outputKey, Body: buf })
    );

    if (!uploadResult.$metadata.httpStatusCode === 200) {
      throw new Error("Failed to upload document to S3");
    }

    const documentUrl = `https://${srcBucket}.s3.amazonaws.com/${outputKey}`;

    let plistQuery = `UPDATE pending_lists SET list_status='Submitted', submit_url='${documentUrl}' WHERE plist_id=${BL_id}`;
    const [plistRows] = await connection.execute(plistQuery);

    return {
      statusCode: 200,
      body: "Document generated and saved successfully",
    };
  } catch (error) {
    console.error("Error:", error);
    return { statusCode: 500, body: "Error generating or saving the document" };
  }
};
