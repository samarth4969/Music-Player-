import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getPlaylistByTag,
  getSongs,
  toggleFavourite,
} from "../controllers/songController.js";

const songRouter = express.Router();

// Public routes
songRouter.get("/", getSongs);
songRouter.get("/playlistByTag/:tag", getPlaylistByTag);

// Protected routes
songRouter.post("/favourite", protect, toggleFavourite);
songRouter.get("/favourites", protect, (req, res) => {
  res.json(req.user.favourites);
});

export default songRouter;
