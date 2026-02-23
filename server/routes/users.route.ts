import express from "express";
import { getUsers, getUserById, updateUser, deleteUser } from "../controller/users..controller";
import { authenticate, authorize } from "../middleware/auth";
import { getUserTickets } from "../controller/registrations.controller";

const router = express.Router();

router.get("/", authenticate, authorize(["admin"]), getUsers);
router.get("/:id", authenticate, getUserById);
router.put("/:id", authenticate, updateUser);
router.delete("/:id", authenticate, authorize(["admin"]), deleteUser);
router.get("/:id/tickets", authenticate, getUserTickets);

export default router;
