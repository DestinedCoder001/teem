import { Request, Response, Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { acceptInvite, createWs, removeUser, sendInvite } from "../controllers/workspace.controller";
import { workspaceCreateValidation } from "../lib/validations/worskspace.validation";
import { emailValidation } from "../lib/validations/auth.validation";

const router = Router();

router.post("/create", workspaceCreateValidation, (req: Request, res: Response) => {
    createWs(req, res);
});

router.post("/send-invite/:workspaceId", emailValidation, (req: Request, res: Response) => {
    sendInvite(req, res);
});

router.post("/accept-invite/:workspaceId", (req: Request, res: Response) => {
    acceptInvite(req, res);
});

router.post("/remove-user/:workspaceId", emailValidation, (req: Request, res: Response) => {
    removeUser(req, res);
});

export default router;