import mongoose, { Schema, Document } from "mongoose";

export interface ISession {
  _id: string;
  eventId: mongoose.Types.ObjectId;
  title: string;
  speakerName: string;
  startTime: Date;
  endTime: Date;
  room: string;
}

const SessionSchema: Schema = new Schema({
  eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  title: { type: String, required: true },
  speakerName: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  room: { type: String, required: true },
});

const Session = mongoose.models?.session || mongoose.model<ISession>("Session", SessionSchema);
export default Session;
