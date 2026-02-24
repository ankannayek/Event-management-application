import { Request, Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/auth";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if admin or self
    if (req.user?.role !== "admin" && req.user?._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, role, companyName, websiteUrl, logoUrl, bio } = req.body;

    // Check if admin or self
    if (req.user?.role !== "admin" && req.user?._id.toString() !== req.params.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;
    user.companyName = companyName !== undefined ? companyName : user.companyName;
    user.websiteUrl = websiteUrl !== undefined ? websiteUrl : user.websiteUrl;
    user.logoUrl = logoUrl !== undefined ? logoUrl : user.logoUrl;
    user.bio = bio !== undefined ? bio : user.bio;

    if (req.user?.role === "admin" && role) {
      user.role = role;
    }

    await user.save();
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
