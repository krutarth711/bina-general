import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const dbConfig = {
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  port: process.env.RDS_PORT,
  database: process.env.DATABASE_NAME,
};
const secretKey = process.env.JWT_SECRET; // Replace with your actual secret key

export const handler = async (event, context) => {
  const { username, password } = event.body;

  try {
    const connection = await mysql.createConnection(dbConfig);

    // Query the database to validate the user's credentials
    const [rows] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    await connection.end();

    if (rows.length === 1) {
      const user = rows[0];
      var passwordIsValid = bcrypt.compareSync(password, user.password);
      if (passwordIsValid) {
        // User authentication successful, generate JWT token
        const tokenPayload = {
          user: {
            id: user.user_id,
            username: user.username,
            role: user.role,
          },
        };
        const token = jwt.sign(tokenPayload, secretKey, { expiresIn: "24h" });
        const data = {
          token,
          username: user.username,
          role: user.role,
        };
        return {
          statusCode: 200,
          ...data,
        };
      } else {
        return {
          statusCode: 401,
          error: "Invalid credentials",
        };
      }
    } else {
      return {
        statusCode: 401,
        error: "No such user found",
      };
    }
  } catch (error) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      error: "Internal Server Error",
    };
  }
};
