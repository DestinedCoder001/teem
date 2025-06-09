import { Request, Response, Router } from "express";
import { verifyToken } from "../middleware/auth.middleware";
import { addUser, createWs, removeUser } from "../controllers/workspace.controller";
import { workspaceCreateValidation } from "../lib/validations/worskspace.validation";
import { emailValidation } from "../lib/validations/auth.validation";

const router = Router();

router.post("/create", workspaceCreateValidation, (req: Request, res: Response) => {
    createWs(req, res);
});

router.post("/add-user/:workspaceId", emailValidation, (req: Request, res: Response) => {
    addUser(req, res);
});

router.post("/remove-user/:workspaceId", emailValidation, (req: Request, res: Response) => {
    removeUser(req, res);
});

export default router;