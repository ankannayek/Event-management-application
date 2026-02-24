import { Request, Response } from "express";
import Event from "../models/Event";
import Session from "../models/Session";
import Sponsor from "../models/Sponsor";
import Exhibitor from "../models/Exhibitor";
import { AuthRequest } from "../middleware/auth";

// --- Event Controllers ---

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate("venue");
    res.json(events);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id).populate("venue").populate("organizerId", "name email mobileNumber").lean();
    if (!event) return res.status(404).json({ message: "Event not found" });
    const sponsors = await Sponsor.find({
      eventId: req.params.id,
      status: "active",
    })
      .populate("userId", "name email companyName logoUrl")
      .lean();

    const exhibitors = await Exhibitor.find({
      eventId: req.params.id,
      status: "confirmed",
    })
      .populate("userId", "name email companyName logoUrl")
      .lean();

    return res.json({
      event,
      sponsors,
      exhibitors,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createEvent = async (req: AuthRequest, res: Response) => {
  try {
    const eventData = {
      ...req.body,
      organizerId: req.user?._id,
    };
    const event = new Event(eventData);
    await event.save();
    res.status(201).json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(event, req.body);
    await event.save();
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// --- Session Controllers ---
// Not completedddddddddddddddddddddd

export const getSessionsByEvent = async (req: Request, res: Response) => {
  try {
    const sessions = await Session.find({ eventId: req.params.id });
    res.json(sessions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addSession = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const session = new Session({ ...req.body, eventId: req.params.id });
    await session.save();
    res.status(201).json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findById(req.params.sid);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const event = await Event.findById(session.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(session, req.body);
    await session.save();
    res.json(session);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteSession = async (req: AuthRequest, res: Response) => {
  try {
    const session = await Session.findById(req.params.sid);
    if (!session) return res.status(404).json({ message: "Session not found" });

    const event = await Event.findById(session.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Session.findByIdAndDelete(req.params.sid);
    res.json({ message: "Session deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
