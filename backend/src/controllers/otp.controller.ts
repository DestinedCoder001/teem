import { Request, Response } from "express";
import { Otp } from "../models/otp.model";
import User from "../models/user.model";
import { connectDb } from "../lib/connectDb";
import { saveUserAuthDetails } from "../lib/saveUserAuthDetails";
import bcrypt from "bcrypt";

// export const sendOtp = async (req: Request, res: Response) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email is required" });

//   const existingOtp = await Otp.findOne({ email });

//   if (existingOtp && !canRequestOtp(existingOtp.updatedAt)) {
//     const retryIn = Math.ceil(
//       60 - (Date.now() - existingOtp.updatedAt.getTime()) / 1000
//     );
//     return res.status(429).json({
//       message: `Please wait ${retryIn} seconds before requesting another OTP.`,
//     });
//   }

//   const otpCode = generateOtp();
//   const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

//   await Otp.findOneAndUpdate(
//     { email },
//     { code: otpCode, expiresAt: otpExpiresAt },
//     { upsert: true, new: true, setDefaultsOnInsert: true }
//   );

//   try {
//     await sendOtpEmail(email, otpCode, "signup");
//     res.status(200).json({ message: "OTP sent successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to send OTP" });
//   }
// };

export const verifyOtp = async (
  req: Request,
  res: Response,
  type: "reset" | "signup"
) => {
  const { email, code } = req.body;
  const password = req.body?.password;

  if (!email || !code) {
    return res.status(400).json({ message: "Email and OTP code are required" });
  }

  try {
    await connectDb();
    const record = await Otp.findOne({ email });

    if (!record) {
      return res.status(400).json({ message: "OTP unavailable" });
    }

    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ message: "OTP expired" });
    }

    const isOtpCorrect = bcrypt.compareSync(code, record.code);

    if (!isOtpCorrect) {
      return res.status(403).send("Invalid OTP");
    }

    let user;

    if (type === "signup" && !password) {
      user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );
      const accessToken = saveUserAuthDetails(res, user);
      return res
        .status(200)
        .json({ message: "OTP verified", data: accessToken });
    } else if (type === "reset" && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.findOneAndUpdate(
        {
          email,
        },
        { password: hashedPassword }
      );
      return res
        .status(200)
        .json({ message: "OTP verified. Log in with your new password." });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Error in verifying OTP",
      error: error.message || "Failed to verify OTP",
    });
  }
};
