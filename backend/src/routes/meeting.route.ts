import { Router } from "express";
import { createMeeting, getMeetings } from "../controllers/meeting.controller";

const router = Router({ mergeParams: true });

router.post("/create-meeting", (req, res) => {
  createMeeting(req, res);
});

router.get("/get-meetings", (req, res) => {
  getMeetings(req, res);
});

export default router;
