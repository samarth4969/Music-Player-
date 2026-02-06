import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const JAMENDO_BASE_URL = "https://api.jamendo.com/v3.0";
const clientId = process.env.JAMENDO_CLIENT_ID;

/* ================= GET ALL SONGS ================= */
const getSongs = async (req, res) => {
  try {
    const response = await axios.get(`${JAMENDO_BASE_URL}/tracks`, {
      params: {
        client_id: clientId,
        format: "json",
        limit: 20,
      },
    });

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("getSongs error:", error.message);
    res.status(500).json({ message: "Failed to fetch songs" });
  }
};

/* ================= GET PLAYLIST BY TAG ================= */
const getPlaylistByTag = async (req, res) => {
  try {
    const tag = req.params.tag?.trim();
    if (!tag) {
      return res.status(400).json({ message: "Tag is required" });
    }

    const limit = parseInt(req.query.limit || "10", 10);

    const response = await axios.get(`${JAMENDO_BASE_URL}/tracks`, {
      params: {
        client_id: clientId,
        format: "json",
        tags: tag ||"pop",
        limit,
      },
    });

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("getPlaylistByTag error:", error.message);
    res.status(500).json({ message: "Failed to fetch playlist" });
  }
};

/* ================= TOGGLE FAVOURITE ================= */
const toggleFavourite = async (req, res) => {
  try {
    const user = req.user;
    const song = req.body.song;

    if (!song || !song.id) {
      return res.status(400).json({ message: "Song data missing" });
    }

    const exists = user.favourites.find((fav) => fav.id === song.id);

    if (exists) {
      // Remove favourite
      user.favourites = user.favourites.filter((fav) => fav.id !== song.id);
    } else {
      // Add favourite
      user.favourites.push(song);
    }

    await user.save();
    res.status(200).json(user.favourites);
  } catch (error) {
    console.error("toggleFavourite error:", error.message);
    res.status(500).json({ message: "Unable to update favourites" });
  }
};

export { getSongs, getPlaylistByTag, toggleFavourite };
