import { Request, Response } from "express";
import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import User from "../models/user.model";

const editUserDetails = async (req: Request, res: Response) => {
  const { firstName, lastName } = req.body;
  const { userId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user id." });
  }

  if (userId !== req.user.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();

    const updatedUser = await User.findOneAndUpdate({_id: userId}, {
        firstName,
        lastName
    }, {new: true}).select("-password");

    if (!updatedUser) {
        return res.status(404).json({message: "User not found"})
    }
    return res.status(200).json({message: "User details updated successfully", data: updatedUser})
  } catch (error: any) {
    
  }
};