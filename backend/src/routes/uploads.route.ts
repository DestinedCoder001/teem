import { Router } from "express";
import { uploadProfilePic, uploadWsProfilePic } from "../controllers/uploads.controller";
const router = Router();

router.post("/update-dp", (req, res) => {
  uploadProfilePic(req, res);
});
router.post("/update-ws-dp", (req, res) => {
  uploadWsProfilePic(req, res);
});

export default router;
