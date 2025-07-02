import { Request, Response, Router } from "express";
import { acceptInvite, createWs, deleteWs, getUserWorkspaces, getWsDetails, removeUser, sendInvite } from "../controllers/workspace.controller";
import { workspaceCreateValidation } from "../lib/validations/worskspace.validation";
import { emailValidation } from "../lib/validations/auth.validation";

const router = Router();

router.post("/create", workspaceCreateValidation, (req: Request, res: Response) => {
    createWs(req, res);
});

router.get("/", (req: Request, res: Response) => {
    getUserWorkspaces(req, res);
})

router.get("/:workspaceId", (req: Request, res: Response) => {
    getWsDetails(req, res);
});

router.delete("/:workspaceId/delete", (req: Request, res: Response) => {
    deleteWs(req, res);
});
router.post("/:workspaceId/send-invite", emailValidation, (req: Request, res: Response) => {
    sendInvite(req, res);
});

router.post("/:workspaceId/accept-invite", (req: Request, res: Response) => {
    acceptInvite(req, res);
});

router.post("/:workspaceId/remove-user", emailValidation, (req: Request, res: Response) => {
    removeUser(req, res);
});

export default router;