import express from "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
      };
    }
  }
}

interface SignUpBody {
  email: string;
  password: string;
}

interface JwtPayload {
  UserInfo: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

interface User {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export { SignUpBody, JwtPayload, User };
