export interface IEvent {
  _id: string;
  organizerId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: "conference" | "wedding" | "concert" | "corporate" | "other";
  startDate: Date ;
  endDate: Date;
  venue: mongoose.Types.ObjectId;
  maxCapacity: number;
  ticketPrice: number;
  status: "draft" | "published" | "cancelled";
  createdAt: Date;
  bannerImage?:string
}