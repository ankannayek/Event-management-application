import express from "express";
import { getEventStats, getRegistrationStats, getRevenueStats } from "../controller/reports.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.get("/events", authenticate, authorize(["admin"]), getEventStats);
router.get("/registrations", authenticate, authorize(["admin"]), getRegistrationStats);
router.get("/revenue", authenticate, authorize(["admin"]), getRevenueStats);

export default router;
