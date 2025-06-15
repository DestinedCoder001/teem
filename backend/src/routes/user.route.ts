import { Router } from "express";
import { deleteAccount, editUserDetails, getUser } from "../controllers/user.controller";

const router = Router();

router.get("/:userId", async (req, res) => {
    getUser(req, res);
});

router.patch("/:userId/edit", async (req, res) => {
    editUserDetails(req, res);
});

router.delete("/:userId/delete", async (req, res) => {
    deleteAccount(req, res);
});

export default router;