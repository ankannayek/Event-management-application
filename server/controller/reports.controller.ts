import { Request, Response } from "express";
import Event from "../models/Event";
import Registration from "../models/Registration";

export const getEventStats = async (req: Request, res: Response) => {
  try {
    const totalEvents = await Event.countDocuments();
    const publishedEvents = await Event.countDocuments({ status: "published" });
    const draftEvents = await Event.countDocuments({ status: "draft" });

    res.json({
      totalEvents,
      publishedEvents,
      draftEvents,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRegistrationStats = async (req: Request, res: Response) => {
  try {
    const stats = await Registration.aggregate([
      {
        $group: {
          _id: "$eventId",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "event",
        },
      },
      {
        $unwind: "$event",
      },
      {
        $project: {
          eventTitle: "$event.title",
          registrationCount: "$count",
        },
      },
    ]);

    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getRevenueStats = async (req: Request, res: Response) => {
  try {
    const stats = await Registration.aggregate([
      {
        $match: { status: "active" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amountPaid" },
        },
      },
    ]);

    res.json(stats[0] || { totalRevenue: 0 });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
