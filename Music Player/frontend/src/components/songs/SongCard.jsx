import React from "react";

const SongCard = ({ song, onPlay, onToggleFavourite }) => {
  return (
    <div className="song-card" onClick={onPlay}>
      <img src={song.image} alt={song.name} loading="lazy" />

      <div className="song-card-info">
        <h3>{song.name}</h3>
        <p>{song.artist_name}</p>
      </div>

      <button
        className="song-card-favourite"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavourite();
        }}
      >
        💖
      </button>
    </div>
  );
};

export default SongCard;
