import { createTransport } from "nodemailer";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();

const oAuth2Client = new OAuth2Client(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI,
);

oAuth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN,
});

async function getTransporter() {
  const { token } = await oAuth2Client.getAccessToken();

  return createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USER,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
      accessToken: token || "",
    },
  });
}

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
  } else {
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
    subject,
    html: htmlContent,
  };

  try {
    const transporter = await getTransporter();
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Nodemailer sendOtpEmail error:", error);
    throw new Error("Failed to send OTP");
  }
};