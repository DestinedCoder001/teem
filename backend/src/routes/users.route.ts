import { Request, Response, Router } from "express";
import User from "../models/user.model";
import { connectDb } from "../lib/connectDb";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
    console.log(req.user)
    await connectDb();
    const users = await User.find().select("-password");
    res.status(200).send(users);
});

export default router;