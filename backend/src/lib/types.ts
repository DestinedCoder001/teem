import express from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

interface SignUpBody {
  email: string;
  password: string;
}

interface JwtPayload {
  id: string;
}


export { SignUpBody, JwtPayload };