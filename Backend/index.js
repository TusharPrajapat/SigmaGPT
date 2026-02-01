import express from "express";
import "dotenv/config";
import cors from "cors";
import Groq from "groq-sdk";
import mongoose from "mongoose";
import chatRoutes from "./routes/chart.js";
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

//Health check Route!
app.get("/", (req, res) => {
  res.send("SigmaGPT Backend is running!");
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected with Database!");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect with DB", err);
    process.exit(1);
  }
};

startServer();
