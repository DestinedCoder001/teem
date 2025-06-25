import { Router } from "express";
import { deleteAccount, editUserDetails, getUser, getUserTasks, me } from "../controllers/user.controller";

const router = Router();

router.get("/me", async (req, res) => {
    me(req, res);
});

router.get("/:userId", async (req, res) => {
    getUser(req, res);
});

router.get("/:userId/tasks", async (req, res) => {
    getUserTasks(req, res);
});

router.patch("/:userId/edit", async (req, res) => {
    editUserDetails(req, res);
});

router.delete("/:userId/delete", async (req, res) => {
    deleteAccount(req, res);
});

export default router;