import { Request, Response } from "express";
import { SameSite, SignUpBody } from "../utils/types";
import { matchedData, validationResult } from "express-validator";
import { connectDb } from "../lib/connectDb";
import { handleSignup } from "../lib/handleSignUp";
import User from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { saveUserAuthDetails } from "../utils/saveUserAuthDetails";
import { sendOtpEmail } from "../utils/sendOtpEmail";
import { canRequestOtp, generateOtp } from "../utils/otpHelpers";
import { Otp } from "../models/otp.model";
import generatePassword from "password-generator";
import { verifyGoogleToken } from "../lib/googleAuthHelper";

const signUp = async (req: Request<{}, {}, SignUpBody>, res: Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).send({
      results: result.array(),
    });
  }
  try {
    const data = matchedData(req);
    const { email, password, firstName, lastName, profilePicture } = data;
    await connectDb();
    await handleSignup(email, password, firstName, lastName, profilePicture);
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
      message: result.array()[0].msg,
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

    if (user.authProvider === "google") {
      return res.status(401).json({ message: "Please log in using Google." });
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
      .json({ message: "Logged in successfully.", accessToken });
  } catch (error: any) {
    console.log("Error in login controller: " + error.message);
    res.status(500).send("Login error: " + error.message);
  }
};

const googleSignup = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Missing Google code" });
    }
    const payload = await verifyGoogleToken(code);

    if (!payload?.email || !payload?.sub || !payload?.email_verified) {
      return res.status(400).json({ message: "Couldn't verify user" });
    }
    await connectDb();
    const existingUser = await User.findOne({ email: payload.email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = await User.create({
      email: payload.email,
      firstName: payload.given_name || "<firstname>",
      lastName: payload.family_name || "<lastname>",
      password: generatePassword(8, false),
      isVerified: true,
      authProvider: "google",
      profilePicture: payload.picture || "",
    });

    const accessToken = saveUserAuthDetails(res, newUser);

    return res.status(201).json({
      message: "Account created successfully",
      data: { newUser, accessToken },
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

const googleLogin = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;

    const payload = await verifyGoogleToken(code);

    if (!payload?.email) {
      return res.status(400).json({ message: "Invalid Google token" });
    }

    await connectDb();

    const user = await User.findOne({ email: payload.email }).select(
      "-password"
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found. Please register." });
    }

    const accessToken = saveUserAuthDetails(res, user);

    return res.status(200).json({
      message: "Google login successful",
      data: { user, accessToken },
    });
  } catch (err) {
    console.error("google login Error:", err);
    res.status(500).json({ message: "Server error during login (google)" });
  }
};

const signOut = async (res: Response) => {
  const isProd = process.env.NODE_ENV === "production";
  const cookie = {
    httpOnly: true,
    secure: isProd,
    sameSite: (isProd ? "none" : "lax") as SameSite,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  }
  res.clearCookie("tjwt", cookie);
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
        const payload = decoded as { id: string };
        const user = await User.findById(payload.id);
        if (!user) return res.status(403).json({ message: "No user found" });
        const userDetails = {
          _id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          authProvider: user.authProvider,
        };
        if (err) {
          res.sendStatus(403);
          throw new Error("Invalid cookies.");
        }
        const accessToken = jwt.sign(
          { UserInfo: userDetails },
          process.env.JWT_ACCESS_SECRET!,
          { expiresIn: "20m" }
        );
        return res.json({ accessToken });
      }
    );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    if (user.authProvider === "google") {
      throw new Error("Password reset not supported for Google users.");
    }

    const existingOtp = await Otp.findOne({ email });

    if (existingOtp && !canRequestOtp(existingOtp.updatedAt)) {
      const retryIn = Math.ceil(
        90 - (Date.now() - existingOtp.updatedAt.getTime()) / 1000
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
      return res
        .status(200)
        .json({ message: "OTP sent successfully", email: newOtp.email });
    } else {
      await Otp.findOneAndUpdate(
        { email },
        {
          code: bcrypt.hashSync(code, 10),
          email,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        },
        { upsert: true, new: true }
      );
      await sendOtpEmail(existingOtp.email, code, "forgotPassword");
      return res
        .status(200)
        .json({ message: "OTP sent successfully", email: existingOtp.email });
    }
  } catch (error: any) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const changePassword = async (req: Request, res: Response) => {
  const results = validationResult(req);

  if (!results.isEmpty()) {
    return res.status(400).send({
      results: results.array(),
    });
  }

  const { email, newPassword } = matchedData(req);

  try {
    await connectDb();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.authProvider === "local") {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await User.findOneAndUpdate(
        { email },
        {
          password: hashedPassword,
        }
      );
      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(400).json({ message: "Cannot change password" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: error?.message });
  }
};

export {
  signUp,
  handleRefresh,
  login,
  signOut,
  googleSignup,
  googleLogin,
  handlePasswordReset,
  changePassword,
};
