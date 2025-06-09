import { Request, Response } from "express";
import { JwtPayload, SignUpBody } from "../lib/types";
import { matchedData, validationResult } from "express-validator";
import { connectDb } from "../lib/connectDb";
import { handleSignup } from "../lib/handleSignUp";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { saveUserAuthDetails } from "../lib/saveUserAuthDetails";
import { sendOtpEmail } from "../lib/sendOtpEmail";
import { canRequestOtp, generateOtp } from "../lib/otpHelpers";
import { Otp } from "../models/otp.model";

const signUp = async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      results: result.array(),
    });
  }
  try {
    const data = matchedData(req);
    const { email, password } = data;
    await connectDb();
    await handleSignup(email, password);
    res.status(200).json({
      message: "Verify your account using the OTP sent to your email",
    });
  } catch (err: any) {
    console.log(err);
    if (err.message.includes("User already exists")) {
      return res.status(409).json({ message: err.message });
    }
    if (err.message.includes("Please wait")) {
      return res.status(429).json({ message: err.message });
    }
    if (err.message.includes("Failed to send OTP")) {
      return res
        .status(500)
        .json({ message: "Account created but OTP couldn't be sent." });
    }
    res.status(500).send("Signup error:" + err.message);
  }
};

const login = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({
      results: result.array(),
    });
  }

  try {
    const data = matchedData(req);
    const { email, password } = data;

    await connectDb();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!user.isVerified) {
      return res.status(403).json({ message: "User not verified." });
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = saveUserAuthDetails(res, user);
    return res
      .status(200)
      .json({ message: "Logged in successfully.", data: accessToken });
  } catch (error: any) {
    console.log("Error in login controller: " + error.message);
    res.status(500).send("Login error: " + error.message);
  }
};

const signOut = async (res: Response) => {
  res.clearCookie("tjwt");
  return res.status(200).json({ message: "Signed out successfully." });
};

const handleRefresh = async (req: Request, res: Response) => {
  const cookies = req.cookies as { tjwt: string };
  if (!cookies || !cookies.tjwt)
    return res.status(401).send({ message: "Invalid or missing cookies." });
  try {
    await connectDb();
    jwt.verify(
      cookies.tjwt,
      process.env.JWT_REFRESH_SECRET!,
      async (err, decoded) => {
        const payload = decoded as JwtPayload;
        const user = await User.findById(payload.id);
        if (!user) return res.status(403).json({ message: "No user found" });
        if (err) {
          res.sendStatus(403);
          throw new Error("Invalid cookies.");
        }
        const accessToken = jwt.sign(
          { id: payload.id },
          process.env.JWT_ACCESS_SECRET!,
          { expiresIn: "5m" }
        );
        return res.send({ accessToken });
      }
    );
  } catch (error: any) {
    res.send(error.message);
  }
};

const handlePasswordReset = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    return res.status(400).send({
      results: result.array(),
    });
  }
  try {
    await connectDb();
    const { email } = matchedData(req);
    const user = await User.findOne({ email });

    if (!user) throw new Error("User not found");

    if (!user.isVerified) {
      // if user hasn't verified their account on account creation, using OTP sent to email.
      throw new Error(
        "Verify your account first before requesting a password reset."
      );
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp && !canRequestOtp(existingOtp.updatedAt)) {
      const retryIn = Math.ceil(
        60 - (Date.now() - existingOtp.updatedAt.getTime()) / 1000
      );
      throw new Error(`Please wait ${retryIn}s before requesting another OTP`);
    }

    const code = generateOtp();
    if (!existingOtp) {
      const newOtp = await Otp.create({
        code: bcrypt.hashSync(code, 10),
        email,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      });

      await sendOtpEmail(newOtp.email, code, "forgotPassword");
      return res.status(200).json({ message: "OTP sent successfully" });
    } else {
      Otp.findOneAndUpdate(
        { email },
        {
          code: bcrypt.hashSync(code, 10),
          email,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        { upsert: true, new: true }
      );
      await sendOtpEmail(existingOtp.email, code, "forgotPassword");
      return res.status(200).json({ message: "OTP sent successfully" });
    }
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      message: "Error in password reset controller: " + error.message,
    });
  }
};

export { signUp, handleRefresh, login, signOut, handlePasswordReset };
