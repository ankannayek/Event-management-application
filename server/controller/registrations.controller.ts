import { Request, Response } from "express";
import Registration from "../models/Registration";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth";

export const registerForEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Check capacity
    const currentAttendees = await Registration.countDocuments({ eventId: req.params.id, status: "active" });
    if (currentAttendees >= event.maxCapacity) {
      return res.status(400).json({ message: "Event is at full capacity" });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      eventId: req.params.id,
      userId: req.user?._id,
    });
    if (existingRegistration) {
      return res.status(400).json({ message: "You are already registered for this event" });
    }

    const { ticketType } = req.body;
    const registration = new Registration({
      userId: req.user?._id,
      eventId: req.params.id,
      ticketType: ticketType || "general",
      amountPaid: event.ticketPrice, // Simplification for now
    });

    await registration.save();
    res.status(201).json(registration);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAttendeesByEvent = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const attendees = await Registration.find({ eventId: req.params.id }).populate("userId", "name email");
    res.json(attendees);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserTickets = async (req: AuthRequest, res: Response) => {
  try {
    if (req.params.id !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const tickets = await Registration.find({ userId: req.params.id }).populate("eventId");
    res.json(tickets);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelRegistration = async (req: AuthRequest, res: Response) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    registration.status = "cancelled";
    await registration.save();
    res.json({ message: "Registration cancelled successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationById = async (req: AuthRequest, res: Response) => {
  try {
    const registration = await Registration.findById(req.params.id).populate("eventId").populate("userId", "name email");
    if (!registration) return res.status(404).json({ message: "Registration not found" });

    if (registration.userId._id.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(registration);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};