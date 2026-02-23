import mongoose, { Schema, Document } from "mongoose";

export interface ISponsor {
  _id: string;
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  tierName: string;
  benefits: string[];
  logoUrl: string;
  websiteUrl: string;
  status: "pending" | "active" | "cancelled";
  createdAt: Date;
}

const SponsorSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  tierName: { type: String, required: true },
  benefits: { type: [String], default: [] },
  logoUrl: { type: String },
  websiteUrl: { type: String },
  status: {
    type: String,
    enum: ["pending", "active", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

const Sponsor = mongoose.models?.sponsor || mongoose.model<ISponsor>("Sponsor", SponsorSchema);
export default Sponsor;
