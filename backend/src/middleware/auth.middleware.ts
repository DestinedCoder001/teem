import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../utils/types";

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const cookie = req.cookies["tjwt"];
  if (!cookie) {
    res.status(401).send({ message: "Invalid or missing cookies" });
    return;
  }

  const headers = req.headers["authorization"];
  if (!headers) {
    res.status(400).send({ message: "No headers provided" });
    return;
  }

  const token = headers.split(" ")[1];
  if (!token) {
    res.status(400).send({ message: "No token provided" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as JwtPayload;
    req.user = decoded.UserInfo;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ message: "Invalid token" });
  }
};
