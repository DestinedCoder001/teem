import { Request, Response, Router } from "express";
import { addMembers, createChannel, deleteChannel, removeMembers } from "../controllers/channel.controller";

const router = Router();

router.post("/create", (req, res) => {
    createChannel(req, res);
});

router.post("/:channelId/add-members", (req, res) => {
    addMembers(req, res);
});

router.post("/:channelId/remove-members", (req, res) => {
    removeMembers(req, res);
});

router.post("/:channelId/delete", (req, res) => {
    deleteChannel(req, res);
});

export default router;
