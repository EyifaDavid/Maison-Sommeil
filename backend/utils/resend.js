import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    const response = await resend.emails.send({
      from: "Maison Sommeil <onboarding@resend.dev>",
      to,
      subject,
      html: html || `<p>${text}</p>`,
    });

    console.log("✅ Email sent:", response);
    return response;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};
