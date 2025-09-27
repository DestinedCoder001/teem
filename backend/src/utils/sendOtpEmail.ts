import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const sendOtpEmail = async (
  email: string,
  otpCode: string,
  type: "forgotPassword" | "signup"
) => {
  let subject = "";
  let message = "";

  if (type === "forgotPassword") {
    subject = "Teem Password Reset";
    message = "Use this code to reset your password:";
  } else {
    subject = "Teem Email Verification";
    message = "Use this code to verify your account:";
  }

  try {
    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          email,
          subject,
          message,
          passcode: otpCode,
        },
      }
    );

    return response.data;
  } catch (err: any) {
    console.error("EmailJS error:", err.response?.data || err.message);
    throw new Error("Failed to send OTP email");
  }
};
