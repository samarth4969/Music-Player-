import React from "react";
import { IoVolumeHighOutline } from "react-icons/io5";
import { TbArrowsShuffle } from "react-icons/tb";
import { RiLoopRightLine } from "react-icons/ri";
import { IoVolumeMuteOutline } from "react-icons/io5";


import "../../css/footer/Feature.css";

const Features = ({ playerState = {}, playerFeatures = {} }) => {
  if (!playerState) return null;

  const {
    isMuted,
    shuffleEnabled,
    loopEnabled,
    playbackSpeed,
    volume,
  } = playerState;

  const {
    onToggleMute,
    onToggleLoop,
    onToggleShuffle,
    onChangeSpeed,
    onChangeVolume,
  } = playerFeatures;

  const handleSpeedChange = (e) => {
    const speed = parseFloat(e.target.value);
    onChangeSpeed?.(speed);
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value, 10);
    onChangeVolume?.(vol);
  };

  return (
    <div className="features-root">
      <div className="features-row">
        {/* Mute */}
       <button
  className="features-btn"
  aria-label={isMuted ? "unmute" : "mute"}
  onClick={onToggleMute}
>
  {isMuted ? (
    <IoVolumeMuteOutline color="#6b7280" size={26} />
  ) : (
    <IoVolumeHighOutline color="#a855f7" size={26} />
  )}
</button>


        {/* Shuffle */}
        <button
          className={
            shuffleEnabled
              ? "features-btn features-btn-active"
              : "features-btn"
          }
          aria-label={shuffleEnabled ? "disable shuffle" : "enable shuffle"}
          onClick={onToggleShuffle}
        >
          <TbArrowsShuffle
            color={shuffleEnabled ? "#a855f7" : "#9ca3af"}
            size={26}
          />
        </button>

        {/* Loop */}
        <button
          className={
            loopEnabled
              ? "features-btn features-btn-active"
              : "features-btn"
          }
          aria-label="loop"
          onClick={onToggleLoop}
        >
          <RiLoopRightLine
            color={loopEnabled ? "#a855f7" : "#9ca3af"}
            size={26}
          />
        </button>

        {/* Playback Speed */}
        <select
          className="features-speed-select"
          value={playbackSpeed}
          onChange={handleSpeedChange}
        >
          <option value={0.75}>0.75x</option>
          <option value={1}>1x</option>
          <option value={1.25}>1.25x</option>
          <option value={1.5}>1.5x</option>
          <option value={2}>2x</option>
        </select>
      </div>

      {/* Volume */}
      <div className="features-volume-wrapper">
        <input
          type="range"
          min={0}
          max={100}
          value={volume ?? 0}
          onChange={handleVolumeChange}
          className="features-volume-range"
        />
      </div>
    </div>
  );
};

export default Features;
