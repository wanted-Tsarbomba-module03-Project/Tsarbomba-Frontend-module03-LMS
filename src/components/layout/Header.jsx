import React from "react";
import SearchBar from "../common/Searchbar";
import { useNavigate } from "react-router-dom";

import "./Header.css";
import "../common/reset.css";
import MainLogo from "../../assets/img/codebomba-logo-Icon.svg";
import BombLogo from "../../assets/img/bluebomb-Icon.svg";

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        {/* 좌측: 메인 로고 */}
        <div className="header-left">
          <img src={MainLogo} className="header-logo-img" />
        </div>

        {/* 중앙: 검색바 */}
        <SearchBar />

        {/* 우측: 내강의실, 문제풀이, 로그인(프로필) */}
        <div className="header-right">
          <div className="header-text-btn">
            <p className="header-text">내 강의실</p>
          </div>
          <div className="header-text-btn">
            <p className="header-text">문제풀이</p>
          </div>
          <div className="header-btn">
            <img src={BombLogo} alt="로그인" className="header-bomb-img" />
            <p className="header-text">로그인</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
