import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import Channel from "../models/channel.model";
import Message from "../models/message.model";
import { Request, Response } from "express";

const sendMessage = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  const { message } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  try {
    await connectDb();
    const channel = await Channel.findOne({
      _id: channelId,
      workspace: workspaceId,
    });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (!channel.members.includes(req.user._id)) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      channel: channelId,
      content: message,
      workspace: workspaceId,
    });

    await newMessage.populate({
      path: "sender",
      select: "firstName lastName profilePicture",
    });

    res.status(200).json({
      message: newMessage,
    });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const editMessage = async (req: Request, res: Response) => {
  const { messageId, message } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!message || !messageId) {
    return res
      .status(400)
      .json({ message: "Message id and content are required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const updatedMessage = await Message.findOneAndUpdate(
      { _id: messageId, sender: req.user._id },
      { content: message, edited: true }
    );
    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.status(200).json({ message: "Message updated successfully" });
  } catch (error: any) {
    res.status(500).json("Error updating message: " + error.message);
  }
};

const deleteMessage = async (req: Request, res: Response) => {
  const { messageId } = req.body;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!messageId) {
    return res.status(400).json({ message: "Message id is required" });
  }

  if (!Types.ObjectId.isValid(messageId)) {
    return res.status(400).json({ message: "Invalid message id" });
  }

  try {
    await connectDb();
    const deletedMessage = await Message.replaceOne(
      {
        _id: messageId,
        sender: req.user._id,
      },
      { deleted: true }
    );

    if (!deletedMessage || deletedMessage.matchedCount === 0) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error: any) {
    res.status(500).json("Error deleting message: " + error.message);
  }
};

export { sendMessage, editMessage, deleteMessage };
