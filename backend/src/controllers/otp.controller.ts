import { Request, Response } from "express";
import { Otp } from "../models/otp.model";
import User from "../models/user.model";
import { connectDb } from "../lib/connectDb";
import { saveUserAuthDetails } from "../lib/saveUserAuthDetails";
import bcrypt from "bcrypt";

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
