import express from "express";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email: string;
        firstName: string;
        lastName: string;
        profilePicture: string;
      };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user?: JwtPayload;
  }
}

interface SignUpBody {
  email: string;
  password: string;
}

interface JwtPayload {
  UserInfo: {
    _id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
}

interface User {
  _id: Types.ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
}

export { SignUpBody, JwtPayload, User };
