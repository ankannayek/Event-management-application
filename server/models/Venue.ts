import mongoose, { Schema, Document } from "mongoose";

export interface IVenue {
  _id: string;
  name: string;
  address: string;
  city: string;
  capacity: number;
  amenities: string[];
  createdAt: Date;
}

const VenueSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  capacity: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

const Venue = mongoose.models?.venue || mongoose.model<IVenue>("Venue", VenueSchema);
export default Venue;
