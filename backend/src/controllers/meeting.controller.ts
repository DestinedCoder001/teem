import { Request, Response } from "express";
import { RtcTokenBuilder, RtcRole } from "agora-token";
import { connectDb } from "../lib/connectDb";
import { Meeting } from "../models/meeting.model";
import { Types } from "mongoose";
import Workspace from "../models/workspace.model";

const createMeeting = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, allowedUsers } = req.body;
  const { workspaceId } = req.params;

  if (!title || !allowedUsers) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
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
      workspace: workspaceId,
    });
    return res.status(200).json({ message: "Meeting created successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteMeeting = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { meetingId, workspaceId } = req.params;

  if (!Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({ message: "Invalid meeting id" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  try {
    await connectDb();
    const meeting = await Meeting.findOne({ _id: meetingId });
    const workspace = await Workspace.findOne({ _id: workspaceId });
    const isAllowed =
      meeting.host.toString() === req.user._id ||
      workspace.createdBy.toString() === req.user._id;

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    if (!isAllowed) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    await Meeting.findOneAndDelete({
      _id: meeting.id,
    });

    return res.status(200).json({ message: "Meeting deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const getMeetings = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { workspaceId } = req.params;

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  try {
    await connectDb();
    const meetings = await Meeting.find({ workspace: workspaceId }).populate({
      path: "allowedUsers host",
      select: "firstName lastName email profilePicture",
    });
    return res.status(200).json({ meetings });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

const joinMeeting = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { meetingId } = req.params;
  const userId = req.user._id;

  if (!Types.ObjectId.isValid(meetingId)) {
    return res.status(400).json({ message: "Invalid meeting id" });
  }

  try {
    await connectDb();
    const meeting = await Meeting.findById(meetingId).populate({
      path: "allowedUsers host",
      select: "firstName lastName email profilePicture",
    });

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const isAllowed = meeting.allowedUsers.find(
      (user: { _id: string }) => user._id.toString() === userId
    );
    if (!isAllowed && meeting.host._id.toString() !== userId) {
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
      userId,
      role,
      tokenExpire,
      privilegeExpire
    );

    return res.status(200).json({ token, channel: meeting.title });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export { createMeeting, deleteMeeting, getMeetings, joinMeeting };
