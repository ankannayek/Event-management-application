import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "admin" | "organizer" | "attendee" | "exhibitor" | "sponsor";
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: ["admin", "organizer", "attendee", "exhibitor", "sponsor"],
    default: "attendee",
  },
}, { timestamps: true });

const User = mongoose.models?.user || mongoose.model<IUser>("User", UserSchema);
export default User;
