import express from "express";
import { getEvents, getEventById, createEvent, updateEvent, deleteEvent, getSessionsByEvent, addSession, updateSession, deleteSession } from "../controller/events.controller";
import { authenticate, authorize } from "../middleware/auth";
import { getAttendeesByEvent, registerForEvent } from "../controller/registrations.controller";
import { getSponsorsByEvent, addSponsorshipPackage, updateSponsor, removeSponsor, uploadSponsorAssets } from "../controller/sponsors.controller";
import { getExhibitorsByEvent, addExhibitor, updateExhibitor, removeExhibitor } from "../controller/exhibitors.controller";

const router = express.Router();

// --- Event Routes ---
router.get("/", getEvents);
router.get("/:id", getEventById);
router.post("/", authenticate, authorize(["organizer", "admin"]), createEvent);
router.put("/:id", authenticate, authorize(["organizer", "admin"]), updateEvent);
router.delete("/:id", authenticate, authorize(["organizer", "admin"]), deleteEvent);

// --- Session Routes ---
router.get("/:id/sessions", getSessionsByEvent);
router.post("/:id/sessions", authenticate, authorize(["organizer", "admin"]), addSession);
router.put("/:id/sessions/:sid", authenticate, authorize(["organizer", "admin"]), updateSession);
router.delete("/:id/sessions/:sid", authenticate, authorize(["organizer", "admin"]), deleteSession);

// --- Registration Routes (Nested) ---
router.post("/:id/register", authenticate, authorize(["attendee"]), registerForEvent);
router.get("/:id/attendees", authenticate, authorize(["organizer", "admin"]), getAttendeesByEvent);

// --- Sponsor Routes (Nested) ---
router.get("/:id/sponsors", getSponsorsByEvent);
router.post("/:id/sponsors", authenticate, authorize(["organizer", "admin"]), addSponsorshipPackage);
router.put("/:id/sponsors/:sid", authenticate, authorize(["organizer", "admin"]), updateSponsor);
router.delete("/:id/sponsors/:sid", authenticate, authorize(["organizer", "admin"]), removeSponsor);
router.post("/:id/sponsors/:sid/assets", authenticate, authorize(["sponsor", "admin"]), uploadSponsorAssets);

// --- Exhibitor Routes (Nested) ---
router.get("/:id/exhibitors", getExhibitorsByEvent);
router.post("/:id/exhibitors", authenticate, authorize(["organizer", "admin"]), addExhibitor);
router.put("/:id/exhibitors/:eid", authenticate, authorize(["organizer", "exhibitor", "admin"]), updateExhibitor);
router.delete("/:id/exhibitors/:eid", authenticate, authorize(["organizer", "admin"]), removeExhibitor);

export default router;
