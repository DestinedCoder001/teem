import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload } from "../lib/types";

const verifyToken = (req: Request, res: Response, next: Function) => {
  const headers = req.headers["authorization"];
  if (!headers) {
    return res.status(400).send({ message: "No headers provided" });
  }
  const token = headers.split(" ")[1];
  if (!token) {
    return res.status(400).send({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET!, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Invalid token" });
    }
    const payload = decoded as JwtPayload;
    req.user = payload;
    next();
  });
};

export { verifyToken };
