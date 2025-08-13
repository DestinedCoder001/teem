import { Router } from "express";
import { deleteChatMessage, editChatMessage, getChats, sendChatMessage } from "../controllers/chat.controller";

const router = Router({ mergeParams: true });

router.get("/get-chats/:chatId", (req, res) => {
    getChats(req, res);
});

router.post("/send-chat", (req, res) => {
    sendChatMessage(req, res);
});

router.patch("/edit-chat-message", (req, res) => {
  editChatMessage(req, res);
});

router.post("/delete-chat-message", (req, res) => {
  deleteChatMessage(req, res);
});

export default router;