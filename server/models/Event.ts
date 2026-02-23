import mongoose, { Schema, Document } from "mongoose";

export interface IEvent {
  _id: string;
  organizerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "conference" | "wedding" | "concert" | "corporate" | "other";
  startDate: Date;
  endDate: Date;
  venue: mongoose.Types.ObjectId;
  maxCapacity: number;
  ticketPrice: number;
  status: "draft" | "published" | "cancelled";
  createdAt: Date;
}

const EventSchema: Schema = new Schema({
  organizerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: {
    type: String,
    enum: ["conference", "wedding", "concert", "corporate", "other"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
  maxCapacity: { type: Number, required: true },
  ticketPrice: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["draft", "published", "cancelled"],
    default: "draft",
  },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.models?.event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
