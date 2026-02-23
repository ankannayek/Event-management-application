import mongoose, { Schema, Document } from "mongoose";

export interface IExhibitor {
  _id: string;
  eventId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  companyName: string;
  boothNumber: string;
  boothSize: string;
  description: string;
  logoUrl: string;
  status: "registered" | "confirmed" | "cancelled";
  createdAt: Date;
}

const ExhibitorSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  boothNumber: { type: String, required: true },
  boothSize: { type: String, required: true },
  description: { type: String },
  logoUrl: { type: String },
  status: {
    type: String,
    enum: ["registered", "confirmed", "cancelled"],
    default: "registered",
  },
  createdAt: { type: Date, default: Date.now },
});

const Exhibitor = mongoose.models?.exhibitor || mongoose.model<IExhibitor>("Exhibitor", ExhibitorSchema);
export default Exhibitor;
