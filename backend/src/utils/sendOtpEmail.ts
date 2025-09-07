import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendOtpEmail = async (
  email: string,
  otpCode: string,
  type: "forgotPassword" | "signup"
) => {
  let htmlContent = "";
  let subject = "";

  if (type === "forgotPassword") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>🔐 Password Reset</h2>
        <p>Use the code below to reset your password. It expires in 5 minutes.</p>
        <h1 style="color: #2d89ef;">${otpCode}</h1>
        <p>If you didn't request this, you can ignore it.</p>
      </div>
    `;
    subject = "Teem Password Reset";
  } else if (type === "signup") {
    htmlContent = `
      <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
        <h2>🔐 Email Verification</h2>
        <p>Use the code below to verify your account. It expires in 5 minutes.</p>
        <h1 style="color: #2d89ef;">${otpCode}</h1>
        <p>If you didn't request this, you can ignore it.</p>
      </div>
    `;
    subject = "Teem Email Verification";
  }

  const mailOptions = {
    from: `"Teem OTP" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: subject,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Nodemailer sendOtpEmail error:", error);
    throw new Error("Failed to send OTP");
  }
};
