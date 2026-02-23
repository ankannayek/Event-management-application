import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { connectDB } from "./config/db";


// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true })); 
app.use(morgan("dev"));

// Connect to MongoDB
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.send("Event Management System API");
});

// Import routes
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/users.route";
import eventRoutes from "./routes/events.route";
import venueRoutes from "./routes/venues.route";
import reportRoutes from "./routes/reports.route";
import registrationRoutes from "./routes/registrations.route";

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/registrations", registrationRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
