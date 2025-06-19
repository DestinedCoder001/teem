import { Resend } from "resend";

const resendKey = process.env.RESEND_API_KEY as string;
const resend = new Resend(`${resendKey}`);

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
 
  const { data, error } = await resend.emails.send({
    from: "Teem OTP <onboarding@resend.dev>",
    to: email,
    subject,
    html: htmlContent,
  });

  if (error) {
    console.error("Resend sendOtpEmail error:", error);
    throw new Error("Failed to send OTP");
  }
};
