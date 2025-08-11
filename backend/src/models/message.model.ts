import { model, Schema, models } from "mongoose";

const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String },
    workspace: { type: Schema.Types.ObjectId, ref: "Workspace" },
    channel: { type: Schema.Types.ObjectId, ref: "Channel" },
    receiver: { type: Schema.Types.ObjectId, ref: "User" },
    chatId: { type: String },
    edited: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    attachment: {
      fileName: { type: String, default: "" },
      type: { type: String, default: "" },
      url: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const Message = models.Message || model("Message", messageSchema);

export default Message;
