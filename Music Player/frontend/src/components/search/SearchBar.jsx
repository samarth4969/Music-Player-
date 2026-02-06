import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import "../../css/search/SearchBar.css";

const SearchBar = ({ songs, setSearchSongs }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setSearchSongs([]);
      return;
    }

    const filtered = songs.filter(
      (song) =>
        song.name?.toLowerCase().includes(value.toLowerCase()) ||
        song.artist_name?.toLowerCase().includes(value.toLowerCase())
    );

    setSearchSongs(filtered);
  };

  return (
    <div className="searchbar-root">
      <div className="searchbar-root-wrapper">
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search by song or artist..."
          value={query}
          onChange={handleSearch}
          autoFocus
        />
        <CiSearch className="searchbar-icon" size={20} />
      </div>

      {!query && (
        <p className="searchbar-empty">Type to search songs</p>
      )}
    </div>
  );
};

export default SearchBar;
