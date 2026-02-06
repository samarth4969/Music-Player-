import React from "react";

import Auth from "../auth/Auth";
import Playlist from "../player/Playlist";
import SearchBar from "../search/SearchBar";
import SongList from "../player/SongList";
import SongGrid from "../songs/SongGrid";
import { useSelector } from "react-redux";

import "../../css/mainArea/MainArea.css";

const MainArea = ({
  view,
  songs,
  currentIndex,
  onSelectSong,
  onSelectFavourite,
  onSelectTag,
  songsToDisplay,
  setSearchSetSongs,
}) => {
  const auth = useSelector((state) => state.auth);

  const fetchSongsByTag = async (tag) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`,
      );
      setSongs(res.data);
      setView("home");
    } catch (e) {
      setSongs([]);
    }
  };

  return (
    <div className="mainarea-root">
      <div className="mainarea-top">
        <Auth />
        {view === "home" && <Playlist onSelectTag={onSelectTag} />}
        {view === "search" && (
          <SearchBar songs={songs} setSearchSongs={setSearchSetSongs} />
        )}
      </div>

      <div className="mainarea-scroll">
        {(view === "home" || view === "search") && (
          <SongList
            songs={songsToDisplay}
            onSelectSong={onSelectSong}
            currentIndex={currentIndex}
          />
        )}

        {view === "favourite" && (
  <SongGrid
    songs={auth.user?.favourites || []}
    onPlaySong={onSelectSong}
    onToggleFavourite={onSelectFavourite}
  />
)}
      </div>
    </div>
  );
};

export default MainArea;
