import { Router } from "express";
import {
  createTask,
  deleteTask,
  editTask,
  updateTaskStatus,
} from "../controllers/task.controller";
const router = Router({ mergeParams: true });

router.post("/create", (req, res) => {
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
