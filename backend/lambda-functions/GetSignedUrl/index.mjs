import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { tokenVerify } from "./util.mjs";

// Replace 'your_bucket_name' with the actual name of your S3 bucket
const bucketName = "bllists";

// Handler function for AWS Lambda
export const handler = async (event) => {
  try {
    const tokenResponse = tokenVerify(event.params.header["Authorization"]);
    if (tokenResponse.statusCode !== 200) {
      return tokenResponse;
    }
    // Extract file type from the event (assuming it is passed as a parameter)
    const fileType = event.body.fileType;

    // Replace 'your_s3_region' with the AWS region of your S3 bucket
    const s3Client = new S3Client({ region: "us-east-1" });
    const currentTime = Date.now();

    // Generate a unique key for the S3 object (you may customize this logic)
    const objectKey = `${currentTime}_${event.body.fileName}`;

    // Set the S3 object parameters
    const s3Params = {
      Bucket: bucketName,
      Key: objectKey,
      ContentType: fileType,
    };

    // Generate a presigned URL for uploading the file
    const signedUrl = await getSignedUrl(
      s3Client,
      new PutObjectCommand(s3Params),
      { expiresIn: 300 }
    ); // Expires in 60 seconds

    return {
      statusCode: 200,
      signedUrl,
      uploadTime: currentTime,
    };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
