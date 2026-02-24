import { Request, Response } from "express";
import Sponsor from "../models/Sponsor";
import Event from "../models/Event";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const getSponsorsByEvent = async (req: Request, res: Response) => {
  try {
    const event = await Event.findById(req.params.id);
    const authReq = req as AuthRequest;

    // If organizer or admin, show all (including pending)
    const isOrganizer = authReq.user && event?.organizerId.toString() === authReq.user?._id.toString();
    const isAdmin = authReq.user?.role === "admin";

    const filter: any = { eventId: req.params.id };
    if (!isOrganizer && !isAdmin) {
      filter.status = "active";
    }

    const sponsors = await Sponsor.find(filter);
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

    const { logoUrl } = req.body;
    sponsor.logoUrl = logoUrl || sponsor.logoUrl;
    await sponsor.save();
    res.json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToSponsor = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, logoUrl, benefits, companyName, websiteUrl, tierName } = req.body;
    const userId = req.user?._id;

    const fullUser = await User.findById(userId);
    if (!fullUser) return res.status(404).json({ message: "User not found" });

    // Check if already applied
    const existing = await Sponsor.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ message: "You are already a sponsor for this event" });
    }

    const sponsor = new Sponsor({
      eventId,
      userId,
      companyName: companyName,
      websiteUrl: websiteUrl ,
      logoUrl: logoUrl,
      benefits: benefits,
      tierName: tierName || "Partner",
      status: "active", 
    });

    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createSponcerProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, companyName, websiteUrl, tierName } = req.body;
    const userId = req.user?._id;

    const fullUser = await User.findById(userId);
    if (!fullUser) return res.status(404).json({ message: "User not found" });

    // Check if profile is complete
    if (!fullUser.companyName || !fullUser.logoUrl) {
      return res.status(400).json({ message: "Please complete your sponsor profile before applying" });
    }

    // Check if already applied
    const existing = await Sponsor.findOne({ eventId, userId });
    if (existing) {
      return res.status(400).json({ message: "You are already a sponsor for this event" });
    }

    const sponsor = new Sponsor({
      eventId,
      userId,
      companyName: companyName || fullUser.companyName,
      websiteUrl: websiteUrl || fullUser.websiteUrl,
      logoUrl: fullUser.logoUrl,
      tierName: tierName || "Partner",
      status: "active", // Approval bypassed as requested
    });

    await sponsor.save();
    res.status(201).json(sponsor);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getSponsorshipByUserId = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id || req.user?._id;
    const sponsorships = await Sponsor.find({ userId }).populate("eventId");
    res.json(sponsorships);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


