import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import User from "../models/user.model";
import { connectDb } from "../lib/connectDb";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadProfilePic = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const { file } = req.body;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const uploadResult = await cloudinary.uploader
      .upload(file, {
        folder: "profile-pics",
      })
      .catch((error) => {
        console.log(error);
      });

    if (!uploadResult) {
      return res.status(500).json({ message: "Error uploading file" });
    }

    await connectDb();
    await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        profilePicture: uploadResult.secure_url,
      }
    );

    return res
      .status(200)
      .json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" + error });
  }
};

export { uploadProfilePic };
