import { Router } from "express";
import { addMsgAttachment, uploadProfilePic, uploadWsProfilePic } from "../controllers/uploads.controller";
const router = Router();

router.post("/update-dp", (req, res) => {
  uploadProfilePic(req, res);
});

router.post("/update-ws-dp", (req, res) => {
  uploadWsProfilePic(req, res);
});

router.post("/attach-file", (req, res) => {
  addMsgAttachment(req, res);
});

export default router;
