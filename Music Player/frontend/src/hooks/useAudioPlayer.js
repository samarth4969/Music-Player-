import { useReducer, useRef, useState, useEffect } from "react";

const initialAudioState = {
  isPlaying: false,
  isLoading: false,
  isMuted: false,
  volume: 100,
  loopEnabled: false,
  shuffleEnabled: false,
  playbackSpeed: 1,
  currentIndex: null,
  currentSong: null,
  currentTime: 0,
};

function audioReducer(state, action) {
  switch (action.type) {
    case "LOADING":
      return { ...state, isLoading: true };

    case "PLAY":
      return { ...state, isPlaying: true, isLoading: false };

    case "PAUSE":
      return { ...state, isPlaying: false };

    case "MUTE":
      return { ...state, isMuted: action.payload };

    case "SET_VOLUME":
      return { ...state, volume: action.payload };

    case "TOGGLE_LOOP":
      return { ...state, loopEnabled: !state.loopEnabled, shuffleEnabled: false };

    case "TOGGLE_SHUFFLE":
      return { ...state, shuffleEnabled: !state.shuffleEnabled, loopEnabled: false };

    case "SET_PLAYBACK_SPEED":
      return { ...state, playbackSpeed: action.payload };

    case "SET_CURRENT_TRACK":
      return {
        ...state,
        currentIndex: action.payload.index,
        currentSong: action.payload.song,
        isLoading: true,
      };

    case "SET_CURRENT_TIME":
      return { ...state, currentTime: action.payload };

    default:
      return state;
  }
}

const useAudioPlayer = (songs) => {
  // ✅ ALL HOOKS AT TOP (RULE OF HOOKS SAFE)
  const [audioState, dispatch] = useReducer(audioReducer, initialAudioState);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);
  const previousVolumeRef = useRef(1);

  // ✅ AUTOPLAY WHEN SONG CHANGES
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioState.currentSong) return;

    audio.load();
    audio.play()
      .then(() => dispatch({ type: "PLAY" }))
      .catch(err => console.error("Autoplay failed:", err));
  }, [audioState.currentSong]);

  // ================= CORE CONTROLS =================

  const playSongAtIndex = (index) => {
    if (!songs || songs.length === 0) return;
    if (index < 0 || index >= songs.length) return;

    dispatch({
      type: "SET_CURRENT_TRACK",
      payload: { index, song: songs[index] },
    });

    dispatch({ type: "SET_CURRENT_TIME", payload: 0 });
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play()
        .then(() => dispatch({ type: "PLAY" }))
        .catch(err => console.error(err));
    } else {
      audio.pause();
      dispatch({ type: "PAUSE" });
    }
  };

  const handleNext = () => {
    if (!songs || songs.length === 0) return;

    if (audioState.shuffleEnabled && songs.length > 1) {
      let random;
      do {
        random = Math.floor(Math.random() * songs.length);
      } while (random === audioState.currentIndex);
      playSongAtIndex(random);
      return;
    }

    const next = (audioState.currentIndex + 1) % songs.length;
    playSongAtIndex(next);
  };

  const handlePrev = () => {
    if (!songs || songs.length === 0) return;

    const prev =
      (audioState.currentIndex - 1 + songs.length) % songs.length;
    playSongAtIndex(prev);
  };

  // ================= AUDIO EVENTS =================

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    dispatch({ type: "SET_CURRENT_TIME", payload: audio.currentTime });
  };

  const handleLoadedMetadata = () => {
  const audio = audioRef.current;
  if (!audio) return;

  audio.currentTime = 0;          // ✅ FORCE START AT 0
  setDuration(audio.duration);

  dispatch({ type: "SET_CURRENT_TIME", payload: 0 });

  audio.playbackRate = audioState.playbackSpeed;
  audio.volume = audioState.volume/100;
  audio.muted = audioState.isMuted;
};


  const handleEnded = () => {
    if (audioState.loopEnabled) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.play();
    } else {
      handleNext();
    }
  };

  // ================= FEATURES =================
const handleToggleMute = () => {
  const audio = audioRef.current;
  if (!audio) return;

  if (audioState.isMuted) {
    const restored = previousVolumeRef.current || 1;
    audio.muted = false;
    audio.volume = restored;
    dispatch({ type: "SET_VOLUME", payload: restored * 100 });
    dispatch({ type: "MUTE", payload: false });
  } else {
    previousVolumeRef.current = audio.volume;
    audio.muted = true;
    audio.volume = 0;
    dispatch({ type: "SET_VOLUME", payload: 0 });
    dispatch({ type: "MUTE", payload: true });
  }
};


 const handleChangeVolume = (vol) => {
  const audio = audioRef.current;
  if (!audio) return;

  const normalizedVolume = vol / 100; // ✅ convert

  audio.volume = normalizedVolume;
  dispatch({ type: "SET_VOLUME", payload: vol });

  if (normalizedVolume === 0) {
    audio.muted = true;
    dispatch({ type: "MUTE", payload: true });
  } else {
    previousVolumeRef.current = normalizedVolume;
    audio.muted = false;
    dispatch({ type: "MUTE", payload: false });
  }
};


  const handleChangeSpeed = (speed) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = speed;
    dispatch({ type: "SET_PLAYBACK_SPEED", payload: speed });
  };

  const handleSeek = (time) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = time;
    dispatch({ type: "SET_CURRENT_TIME", payload: time });
  };

  const handleToggleLoop = () => dispatch({ type: "TOGGLE_LOOP" });
  const handleToggleShuffle = () => dispatch({ type: "TOGGLE_SHUFFLE" });

  // ================= RETURN =================

  return {
    audioRef,
    currentIndex: audioState.currentIndex,
    currentSong: audioState.currentSong,
    isPlaying: audioState.isPlaying,
    currentTime: audioState.currentTime,
    duration,
    isLoading: audioState.isLoading,

    isMuted: audioState.isMuted,
    loopEnabled: audioState.loopEnabled,
    shuffleEnabled: audioState.shuffleEnabled,
    playbackSpeed: audioState.playbackSpeed,
    volume: audioState.volume,

    playSongAtIndex,
    handleTogglePlay,
    handleNext,
    handlePrev,
    handleToggleMute,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    handleToggleLoop,
    handleToggleShuffle,
    handleChangeSpeed,
    handleChangeVolume,
    handleSeek,


    
  };
};

export default useAudioPlayer;
