import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") }); // adjust path if needed
console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);


async function testEmail() {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // set to true if you're using port 465 (SSL)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Test Mailer" <no-reply@example.com>',
      to: "your-email@example.com", // <-- put your own email here
      subject: "Nodemailer Test",
      text: "Hello! This is a test email.",
      html: "<p><b>Hello!</b> This is a test email.</p>",
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Test email sent:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending email:", err);
  }
}

testEmail();
