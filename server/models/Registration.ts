import mongoose, { Schema, Document } from "mongoose";

export interface IRegistration {
  _id: string;
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  ticketType: "general" | "vip" | "early-bird";
  amountPaid: number;
  status: "active" | "cancelled";
  registeredAt: Date;
}

const RegistrationSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  ticketType: {
    type: String,
    enum: ["general", "vip", "early-bird"],
    default: "general",
  },
  amountPaid: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ["active", "cancelled"],
    default: "active",
  },
  registeredAt: { type: Date, default: Date.now },
});

const Registration = mongoose.models?.registration || mongoose.model<IRegistration>("Registration", RegistrationSchema);
export default Registration;
