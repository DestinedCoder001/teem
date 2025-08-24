import { Router } from "express";
import { createMeeting, deleteMeeting, getMeetings, joinMeeting } from "../controllers/meeting.controller";

const router = Router({ mergeParams: true });

router.post("/create-meeting", (req, res) => {
  createMeeting(req, res);
});

router.delete("/delete-meeting/:meetingId", (req, res) => {
  deleteMeeting(req, res);
});

router.get("/get-meetings", (req, res) => {
  getMeetings(req, res);
});

router.post("/join-meeting/:meetingId", (req, res) => {
  joinMeeting(req, res);
});

export default router;
