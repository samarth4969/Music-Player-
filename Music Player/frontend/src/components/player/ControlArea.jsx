import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GiPauseButton } from "react-icons/gi";
import { FaCirclePlay } from "react-icons/fa6";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";

import "../../css/footer/ControlArea.css";
import axios from "axios";
import { formatTime } from "../utils/helper";
import { updateFavourites } from "../../redux/slices/authSlice";

const ControlArea = ({ playerState = {}, playerControls = {} }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.auth);

  // 🛡️ Safe destructuring (prevents crash)
  const {
    isPlaying = false,
    currentTime = 0,
    duration = 0,
    isLoading = false,
    currentSong = null,
  } = playerState;

  const {
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
  } = playerControls;

  // If controls are not ready yet, don't render
  if (!handleTogglePlay) return null;

  const currentSongId = currentSong?.id;

  const isLiked = Boolean(
    currentSongId &&
      user?.favourites?.find((song) => song.id === currentSongId)
  );

  const handleLike = async () => {
    if (!isAuthenticated || !currentSongId || !currentSong) return;

    try {
      const songData = {
        id: currentSongId,
        name: currentSong.name,
        artist_name: currentSong.artist_name,
        image: currentSong.image,
        duration: currentSong.duration,
        audio: currentSong.audio,
      };

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
        { song: songData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(updateFavourites(res.data));
    } catch (error) {
      console.error("Error updating favourites:", error);
    }
  };

  const progressPercent =
    duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="control-root">
      <div className="control-buttons">
        <button
          type="button"
          aria-label="previous"
          className="control-icon-btn"
          onClick={handlePrev}
        >
          <TbPlayerTrackPrevFilled color="#a855f7" size={24} />
        </button>

        <button
          type="button"
          aria-label="play"
          className="control-play-btn"
          onClick={handleTogglePlay}
        >
          {isLoading ? (
            <ImSpinner2 className="animate-spin" color="#a855f7" size={42} />
          ) : isPlaying ? (
            <GiPauseButton color="#a855f7" size={42} />
          ) : (
            <FaCirclePlay color="#a855f7" size={42} />
          )}
        </button>

        <button
          type="button"
          aria-label="next"
          className="control-icon-btn"
          onClick={handleNext}
        >
          <TbPlayerTrackNextFilled color="#a855f7" size={24} />
        </button>

        {isAuthenticated && (
          <button
            type="button"
            aria-label="like"
            className="control-icon-btn"
            onClick={handleLike}
          >
            {isLiked ? (
              <FaHeart color="#ff3c3c" size={22} />
            ) : (
              <FaRegHeart color="#a855f7" size={22} />
            )}
          </button>
        )}
      </div>

      <div className="control-progress-wrapper">
        <input
  type="range"
  min={0}
  max={duration || 0}
  value={Math.min(currentTime || 0, duration || 0)}
  step="0.01"
  className="control-progress"
  onChange={(e) => handleSeek(Number(e.target.value))}
  style={{
    background: `linear-gradient(
      to right,
      #a855f7 0%,
      #a855f7 ${progressPercent}%,
      #d1d5db ${progressPercent}%,
      #d1d5db 100%
    )`,
  }}
/>


        <div className="control-times">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default ControlArea;
