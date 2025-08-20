import { Request, Response } from "express";
import { RtcTokenBuilder, RtcRole } from "agora-token";
import { connectDb } from "../lib/connectDb";
import { Meeting } from "../models/meeting.model";
import { Types } from "mongoose";

const createMeeting = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, allowedUsers } = req.body;

  if (!title || !allowedUsers) {
    return res.status(400).json({ message: "All fields are required" });
  }

  allowedUsers.map((id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id", data: id });
    }
  });

  try {
    await connectDb();
    await Meeting.create({
      title,
      allowedUsers,
      host: req.user._id,
      ongoing: true,
    });
    return res.status(200).json({ message: "Meeting created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const joinMeeting = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { meetingId } = req.params;

  if (!Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({ message: "Invalid meeting id" });
  }

  try {
    await connectDb();
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    if (!meeting.ongoing) {
      return res.status(401).json({ message: "Meeting has ended" });
    }

    if (!meeting.allowedUsers.includes(req.user._id) || meeting.host !== req.user._id) {
      return res
        .status(403)
        .json({ message: "You are not allowed to join this meeting" });
    }

    const appId = process.env.AGORA_APP_ID!;
    const appCertificate = process.env.AGORA_APP_CERT!;
    const role = RtcRole.PUBLISHER;
    const tokenExpire = 3600;
    const privilegeExpire = 3600;

    const token = RtcTokenBuilder.buildTokenWithUserAccount(
      appId,
      appCertificate,
      meeting.title,
      req.user._id.toString(),
      role,
      tokenExpire,
      privilegeExpire
    );

    return res.status(200).json({ token });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export { createMeeting, joinMeeting };
