import { Router } from "express";
import { uploadProfilePic } from "../controllers/uploads.controller";
const router = Router();

router.post("/update-dp", (req, res) => {
  uploadProfilePic(req, res);
});

export default router;
