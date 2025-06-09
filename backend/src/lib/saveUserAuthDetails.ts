import { Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
export const saveUserAuthDetails = (res: Response, user: { _id: string }) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "5m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET!,
    {
      expiresIn: "24h",
    }
  );
  res.cookie("tjwt", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
  });
  return accessToken;
};
