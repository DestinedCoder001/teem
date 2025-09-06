import { Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "./types";

export const saveUserAuthDetails = (res: Response, user: User) => {
  const userDetails = {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    profilePicture: user.profilePicture,
    authProvider: user.authProvider,
  };

  const accessToken = jwt.sign(
    {
      UserInfo: userDetails,
    },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "20m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "7d",
    }
  );
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("tjwt", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });
  return accessToken;
};
