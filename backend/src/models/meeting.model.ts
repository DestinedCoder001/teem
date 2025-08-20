import { Schema, models, model } from "mongoose";

const meetingSchema = new Schema(
  {
    title: { type: String, required: true },
    ongoing: { type: Boolean, default: false },
    allowedUsers: { type: [Schema.Types.ObjectId], ref: "User", default: [] },
    host: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  },
  { timestamps: true }
);

export const Meeting = models.Meeting || model("Meeting", meetingSchema);
