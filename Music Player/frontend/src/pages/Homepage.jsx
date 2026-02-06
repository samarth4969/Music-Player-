import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { setUser, logout } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";


import Footer from "../components/layout/Footer";
import SideMenu from "../components/layout/SideMenu";
import MainArea from "../components/layout/MainArea";

import useAudioPlayer from "../hooks/useAudioPlayer";
import Modal from "../components/common/Modal";
import EditProfile from "../components/auth/EditProfile";

import "../css/pages/HomePage.css";

const Homepage = () => {
  const [view, setView] = useState("home");
  const [songs, setSongs] = useState([]);
  const [searchSetSongs, setSearchSetSongs] = useState([]);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const auth = useSelector((state) => state.auth);

  const songsToDisplay = view === "search" ? searchSetSongs : songs;
  const dispatch = useDispatch();

  useEffect(() => {
  const token = localStorage.getItem("token");
  

  if (!token) return;

  const loadUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        setUser({
          user: res.data.user,
          token: token,
        })
      );
    } catch (err) {
      dispatch(logout());
    }
  };

  if (!auth.user) {
    loadUser();
  }
}, []);


  // ================= FETCH ALL SONGS (HOME LOAD) =================
  useEffect(() => {
    const fetchInitialSongs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/songs`
        );

        console.log("All songs:", res.data);

        setSongs(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching songs:", error);
        setSongs([]);
      }
    };

    fetchInitialSongs();
  }, []);

  const handleToggleFavourite = async (song) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/songs/favourite`,
      { song },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
  } catch (err) {
    console.error("Toggle favourite failed", err);
  }
};


  // ================= FETCH SONGS BY TAG =================
  const handleSelectTag = async (tag) => {
    try {
      console.log("Playlist clicked:", tag);
      setView("home");

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/songs/playlistByTag/${tag}`
      );

      console.log("Songs by tag:", res.data);

      setSongs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setSongs([]);
    }
  };

  // ================= AUDIO PLAYER =================
  const {
    audioRef,
    currentIndex,
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleMute,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
    handleSeek,
  } = useAudioPlayer(songsToDisplay || []);

  const playerState = {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    isMuted,
    loopEnabled,
    shuffleEnabled,
    playbackSpeed,
    volume,
  };

  const playerControls = {
    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleSeek,
    handleEnded,
  };

  const playerFeatures = {
    onToggleMute: handleToggleMute,
    onToggleLoop: handleToggleLoop,
    onToggleShuffle: handleToggleShuffle,
    onChangeSpeed: handleChangeSpeed,
    onChangeVolume: handleChangeVolume,
    onSeek: handleSeek,
  };

  return (
    <div className="homepage-root">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      >
        {currentSong && (
          <source src={currentSong.audio} type="audio/mpeg" />
        )}
      </audio>

      <div className="homepage-main-wrapper">
        <div className="homepage-sidebar">
          <SideMenu
  setView={setView}
  view={view}
  onOpenEditProfile={() => setOpenEditProfile(true)}
/>

        </div>

        <div className="homepage-content">
          <MainArea
            view={view}
            songs={songs}
            currentIndex={currentIndex}
            onSelectSong={playSongAtIndex}
            
  onSelectFavourite={handleToggleFavourite} 
            songsToDisplay={songsToDisplay}
            setSearchSetSongs={setSearchSetSongs}
              onSelectTag={handleSelectTag}  
          />
        </div>
      </div>

      <Footer
        playerState={playerState}
        playerFeatures={playerFeatures}
        playerControls={playerControls}
      />

      {openEditProfile && (
        <Modal onClose={() => setOpenEditProfile(false)}>
          <EditProfile onClose={() => setOpenEditProfile(false)} />
        </Modal>
      )}
    </div>
  );
};

export default Homepage;
