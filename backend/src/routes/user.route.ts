import { Request, Response, Router } from "express";
import {
  deleteAccount,
  editUserDetails,
  findByEmail,
  getUser,
  getUserTasks,
  getWorkspaceInvites,
  me,
} from "../controllers/user.controller";
import { emailValidation } from "../lib/validations/auth.validation";

const router = Router();

router.get("/me", async (req, res) => {
  me(req, res);
});

router.get("/get-invites", async (req, res) => {
  getWorkspaceInvites(req, res);
});

router.get("/:userId", async (req, res) => {
  getUser(req, res);
});

router.post(
  "/email-check",
  emailValidation,
  async (req: Request, res: Response) => {
    findByEmail(req, res);
  }
);


router.get("/:userId/tasks", async (req, res) => {
  getUserTasks(req, res);
});

router.patch("/edit", async (req, res) => {
  editUserDetails(req, res);
});

router.delete("/:userId/delete", async (req, res) => {
  deleteAccount(req, res);
});

export default router;
