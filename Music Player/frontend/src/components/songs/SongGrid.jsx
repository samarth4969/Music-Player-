import React from "react";
import "../../css/songs/SongGrid.css";
import SongCard from "./SongCard";

const SongGrid = ({ songs = [], onPlaySong, onToggleFavourite }) => {
  if (!songs.length) {
    return (
      <div className="song-grid-empty">
        <p className="empty-text">No favourite songs added yet.</p>
      </div>
    );
  }

  return (
    <div className="song-grid-wrapper">
      <h2 className="song-grid-heading">Your favourites</h2>

      <div className="song-grid">
        {songs.map((song, index) => (
          <SongCard
            key={song.id}
            song={song}
            onPlay={() => onPlaySong(index)}
            onToggleFavourite={() => onToggleFavourite(song)}
          />
        ))}
      </div>
    </div>
  );
};

export default SongGrid;
