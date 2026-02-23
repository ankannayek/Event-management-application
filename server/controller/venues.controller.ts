import { Request, Response } from "express";
import Venue from "../models/Venue";

export const getVenues = async (req: Request, res: Response) => {
  try {
    const venues = await Venue.find();
    res.json(venues);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createVenue = async (req: Request, res: Response) => {
  try {
    const venue = new Venue(req.body);
    await venue.save();
    res.status(201).json(venue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateVenue = async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json(venue);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVenue = async (req: Request, res: Response) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);
    if (!venue) return res.status(404).json({ message: "Venue not found" });
    res.json({ message: "Venue deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
