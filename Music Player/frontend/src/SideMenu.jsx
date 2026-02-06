import React from "react";
import { AiOutlineHeart, AiOutlineHome, AiOutlineSearch } from "react-icons/ai";

const SideMenu = () => {
  return (
    <aside className="sidemenu-root">
      {/* Header */}
      <div className="sidemenu-header">
        <img src="" alt="Project Logo" className="sidemenu-logo-img" />
        <h2 className="sidemenu-logo-title">Synthesia</h2>
      </div>

      {/* Navigation */}
      <nav className="sidemenu-nav" aria-label="Main Navigation">
        <ul className="sidemenu-nav-list">
          <li>
            <button className="sidemenu-nav-btn active">
              <AiOutlineHome className="sidemenu-nav-icon" size={18} />
              <span>Home</span>
            </button>
          </li>

          <li>
            <button className="sidemenu-nav-btn">
              <AiOutlineSearch className="sidemenu-nav-icon" size={18} />
              <span>Search</span>
            </button>
          </li>

          <li>
            <button className="sidemenu-nav-btn">
              <AiOutlineHeart className="sidemenu-nav-icon" size={18} />
              <span>My Favourite</span>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default SideMenu;
