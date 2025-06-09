import bcrypt from "bcrypt";
import User from "../models/user.model";
import { sendOtpEmail } from "./sendOtpEmail";
import { Otp } from "../models/otp.model";
import { canRequestOtp, generateOtp } from "./otpHelpers";

export const handleSignup = async (email: string, password: string) => {
  const existingUser = await User.findOne({ email });
  if (existingUser && existingUser.isVerified) {
    throw new Error("User already exists");
  }

  if (existingUser && !existingUser.isVerified) {
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp && !canRequestOtp(existingOtp.updatedAt)) {
      const retryIn = Math.ceil(
        60 -
        (Date.now() - existingOtp.updatedAt.getTime()) / 1000
      );
      throw new Error(`Please wait ${retryIn}s before requesting another OTP`);
    }

    // update password if different from a previos create account attempt
    const hashedPassword = await bcrypt.hash(password, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email,
      password: hashedPassword,
      isVerified: false,
    });
  }

  const otpCode = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  const encryptedOtp = bcrypt.hashSync(otpCode, 10);

  await Otp.findOneAndUpdate(
    { email },
    { code: encryptedOtp, expiresAt: otpExpiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await sendOtpEmail(email, otpCode, "signup");
};