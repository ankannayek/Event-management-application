import { Request, Response } from "express";
import Exhibitor from "../models/Exhibitor";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth";

export const getExhibitorsByEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    const authReq = req as AuthRequest;

    // If organizer or admin, show all (including pending registered)
    const isOrganizer = authReq.user && event?.organizerId.toString() === authReq.user?._id.toString();
    const isAdmin = authReq.user?.role === "admin";

    const filter: any = { eventId: req.params.id };
    if (!isOrganizer && !isAdmin) {
      filter.status = "confirmed";
    }

    const exhibitors = await Exhibitor.find(filter);
    res.json(exhibitors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addExhibitor = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const exhibitor = new Exhibitor({ ...req.body, eventId: req.params.id });
    await exhibitor.save();
    res.status(201).json(exhibitor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateExhibitor = async (req: AuthRequest, res: Response) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.eid);
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });

    const event = await Event.findById(exhibitor.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Allowed for Organizer, Admin, or the Exhibitor themselves
    const isOwner = exhibitor.userId.toString() === req.user?._id.toString();
    const isOrganizer = event.organizerId.toString() === req.user?._id.toString();
    const isAdmin = req.user?.role === "admin";

    if (!isOwner && !isOrganizer && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(exhibitor, req.body);
    await exhibitor.save();
    res.json(exhibitor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeExhibitor = async (req: AuthRequest, res: Response) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.eid);
    if (!exhibitor) return res.status(404).json({ message: "Exhibitor not found" });

    const event = await Event.findById(exhibitor.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Exhibitor.findByIdAndDelete(req.params.eid);
    res.json({ message: "Exhibitor removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToExhibitor = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, companyName, boothSize, description } = req.body;
    const userId = req.user?._id;

    // Check if already applied
    const existing = await Exhibitor.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ message: "You have already applied as an exhibitor for this event" });
    }

    const exhibitor = new Exhibitor({
      eventId,
      userId,
      companyName,
      boothSize,
      description,
      boothNumber: "Pending", // Will be assigned by organizer
      status: "registered",
    });

    await exhibitor.save();
    res.status(201).json(exhibitor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getExhibitorByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id || req.user?._id;
    const exhibitors = await Exhibitor.find({ userId }).populate("eventId");
    res.json(exhibitors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
