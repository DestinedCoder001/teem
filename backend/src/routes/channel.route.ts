import { Router } from "express";
import { addMembers, createChannel, deleteChannel, editChannelDetails, getChannelDetails, joinChannel, leaveChannel, removeMembers } from "../controllers/channel.controller";

const router = Router({mergeParams: true});


router.post("/create", (req, res) => {
    createChannel(req, res);
});

router.patch("/:channelId/edit", (req, res) => {
    editChannelDetails(req, res);
});

router.post("/:channelId/add-members", (req, res) => {
    addMembers(req, res);
});

router.post("/:channelId/remove-member", (req, res) => {
    removeMembers(req, res);
});

router.get("/:channelId", (req, res) => {
    getChannelDetails(req, res);
});

router.post("/:channelId/join", (req, res) => {
    joinChannel(req, res);
});

router.post("/:channelId/leave", (req, res) => {
    leaveChannel(req, res);
});

router.delete("/:channelId/delete", (req, res) => {
    deleteChannel(req, res);
});

export default router;
