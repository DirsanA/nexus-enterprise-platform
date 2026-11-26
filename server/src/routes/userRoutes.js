import express from "express";
import {
  getUsers,
  getUserStats,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();

// Routes mapped to controllers
router.get("/", getUsers);
router.get("/stats", getUserStats);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
