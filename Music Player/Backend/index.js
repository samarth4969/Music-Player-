import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import router from "./routes/authRoutes.js"; // ✅ IMPORT ROUTER
import songRouter from "./routes/songRoutes.js";

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));


// Connect DB
connectDB();


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://music-player-gamma-teal.vercel.app"
  ],
  credentials: true
}));


app.use("/api/songs", songRouter);
app.use("/api/auth", router); // ✅ NOW WORKS

app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));
