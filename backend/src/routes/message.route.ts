import { Router } from "express";
import { deleteMessage, editMessage, sendMessage } from "../controllers/message.controller";
const router = Router({mergeParams: true});

router.post("/send-message", (req, res) => {
    sendMessage(req,res)
});

router.patch("/edit-message", (req, res) => {
    editMessage(req,res)
});

router.put("/delete-message", (req, res) => {
    deleteMessage(req,res)
});

export default router;