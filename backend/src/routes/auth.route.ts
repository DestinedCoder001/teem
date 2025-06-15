import { Request, Response, Router } from "express";
import { googleLogin, googleSignup, handlePasswordReset, handleRefresh, login, signOut, signUp } from "../controllers/auth.controller";
import { authValidation, emailValidation, loginValidation } from "../lib/validations/auth.validation";
import { verifyOtp } from "../controllers/otp.controller";

const router = Router();

router.post("/sign-up", authValidation, (req: Request, res: Response) => {
  signUp(req, res);
});

router.post("/google-sign-up", (req: Request, res: Response) => {
  googleSignup(req, res);
});

router.post("/login", loginValidation, (req: Request, res: Response) => {
  login(req, res);
});
router.post("/google-login", loginValidation, (req: Request, res: Response) => {
  googleLogin(req, res);
});

router.get("/logout", (_, res: Response) => {
  signOut(res);
});

router.post("/verify-otp", (req: Request, res: Response) => {
  verifyOtp(req, res, "signup");
});
router.post("/verify-reset", (req: Request, res: Response) => {
  verifyOtp(req, res, "reset");
});

router.get("/refresh-token", (req: Request, res: Response) => {
  handleRefresh(req, res);
});

router.post("/forgot-password", emailValidation, (req: Request, res: Response) => {
  handlePasswordReset(req, res);
})

export default router;
