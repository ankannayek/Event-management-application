import express from "express";
import { getVenues, createVenue, updateVenue, deleteVenue } from "../controller/venues.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

router.get("/", getVenues);
router.post("/", authenticate, authorize(["organizer", "admin"]), createVenue);
router.put("/:id", authenticate, authorize(["organizer", "admin"]), updateVenue);
router.delete("/:id", authenticate, authorize(["admin"]), deleteVenue);

export default router;
