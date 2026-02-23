import { Request, Response } from "express";
import Sponsor from "../models/Sponsor";
import Event from "../models/Event";
import { AuthRequest } from "../middleware/auth";

export const getSponsorsByEvent = async (req: Request, res: Response) => {
  try {
    const sponsors = await Sponsor.find({ eventId: req.params.id, status: "active" });
    res.json(sponsors);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addSponsorshipPackage = async (req: AuthRequest, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const sponsor = new Sponsor({ ...req.body, eventId: req.params.id });
    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateSponsor = async (req: AuthRequest, res: Response) => {
  try {
    const sponsor = await Sponsor.findById(req.params.sid);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

    const event = await Event.findById(sponsor.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    Object.assign(sponsor, req.body);
    await sponsor.save();
    res.json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeSponsor = async (req: AuthRequest, res: Response) => {
  try {
    const sponsor = await Sponsor.findById(req.params.sid);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

    const event = await Event.findById(sponsor.eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    if (event.organizerId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    await Sponsor.findByIdAndDelete(req.params.sid);
    res.json({ message: "Sponsor removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadSponsorAssets = async (req: AuthRequest, res: Response) => {
  try {
    const sponsor = await Sponsor.findById(req.params.sid);
    if (!sponsor) return res.status(404).json({ message: "Sponsor not found" });

    if (sponsor.userId.toString() !== req.user?._id.toString() && req.user?.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { logoUrl, promotionalMaterials } = req.body;
    sponsor.logoUrl = logoUrl || sponsor.logoUrl;
    // Assuming benefits or a new field for promo materials
    await sponsor.save();
    res.json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
