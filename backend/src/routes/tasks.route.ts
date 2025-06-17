import { Request, Response, Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  updateTaskStatus,
} from "../controllers/task.controller";
import { createTaskValidation } from "../lib/validations/task.validation";
const router = Router({ mergeParams: true });

router.post("/create", createTaskValidation, (req: Request, res: Response) => {
  createTask(req, res);
});

router.patch("/edit", (req, res) => {
  editTask(req, res);
});

router.patch("/update-status", (req, res) => {
  updateTaskStatus(req, res);
});

router.delete("/delete", (req, res) => {
  deleteTask(req, res);
});

export default router;
