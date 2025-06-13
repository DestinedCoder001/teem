import { Request, Response } from "express";
import { Types } from "mongoose";
import { connectDb } from "../lib/connectDb";
import Channel from "../models/channel.model";

const createChannel = async (req: Request, res: Response) => {
  const { workspaceId } = req.params;
  const { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ message: "Channel name and description is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    await connectDb();
    const newChannel = await Channel.create({
      name,
      description,
      workspace: workspaceId,
      createdBy: req.user.id,
    });
    res.status(201).json({
      message: "Channel created successfully",
      data: { channel: newChannel },
    });
  } catch (error: any) {
    console.log("Error in creating channel: ", error);
    res.status(500).json(error.message);
  }
};

const addMembers = async (req: Request, res: Response) => {
  const { payload } = req.body;
  const { channelId, workspaceId } = req.params;

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!payload || !payload.newUsers) {
    return res.status(400).json({ message: "Payload is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  payload.newUsers.map((id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id", data: id });
    }
  });

  const userIds = payload.newUsers.map((id: string) => {
    return new Types.ObjectId(id);
  });

  try {
    await connectDb();
    const updatedChannel = await Channel.findOneAndUpdate(
      { _id: channelId },
      { $addToSet: { users: { $each: userIds } } },
      { new: true }
    );

    if (!updatedChannel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    res.status(200).json({
      message: "Channel member added successfully",
      data: updatedChannel,
    });
  } catch (error: any) {
    console.log("Error in adding channel member: ", error);
    res.status(500).json(error.message);
  }
};

const removeMembers = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  const {payload} = req.body;

  
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!payload || !payload.members) {
    return res.status(400).json({ message: "Payload is required" });
  }

  if (!Types.ObjectId.isValid(workspaceId)) {
    return res.status(400).json({ message: "Invalid workspace id" });
  }

  if (!Types.ObjectId.isValid(channelId)) {
    return res.status(400).json({ message: "Invalid channel id" });
  }

  payload.members.map((id: string) => {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id", data: id });
    }
  });

  const userIds = payload.members.map((id: string) => {
    return new Types.ObjectId(id);
  });

  try {
    await connectDb();
    const channel = await Channel.findOne({_id: channelId, workspace: workspaceId});
    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({message: "Action not permitted"})
    }

    if(!channel) {
      return res.status(404).json({message: "Channel not found"})
    }

    await Channel.findOneAndUpdate(
      { _id: channelId, workspace: workspaceId },
      { $pull: { users: {$each: userIds} } }
    );


    res.status(200).json({ message: "Member(s) removed successfully" });

  } catch (error: any) {
    console.log(error);
    res.status(500).json("Error in removing member(s) from channel: " + error);
  }
};

const deleteChannel = async (req: Request, res: Response) => {
  const { channelId, workspaceId } = req.params;
  
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
    const channel = await Channel.findOne({ _id: channelId, workspace: workspaceId });
    if (!channel) {
      return res.status(404).json({ message: "Channel not found" });
    }

    if (channel.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Action not permitted." });
    }

    await Channel.findOneAndDelete({ _id: channelId, workspace: workspaceId });

    res.status(200).json({ message: "Channel deleted successfully" });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
}

export { createChannel, addMembers, removeMembers, deleteChannel };
