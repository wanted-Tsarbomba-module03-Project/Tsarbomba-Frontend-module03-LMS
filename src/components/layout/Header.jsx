import React from "react";
import SearchBar from "../common/Searchbar";
import { useNavigate } from "react-router-dom";
import "./Header.css";
import "../common/reset.css";
// import MainLogo from "../../assets/img/codebomba-logo-Icon.svg";
import Logo from "../../assets/img/logo-Icon.png";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";
import WhitebombLogo from "../../assets/img/WhiteBomb-Icon.svg";

function Header({ isSimple }) {
  const navigate = useNavigate();

  if (isSimple) {
    return (
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <img
              src={Logo}
              className="header-logo-img"
              alt="로고"
              onClick={() => navigate("/")}
            />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <img
            src={Logo}
            className="header-logo-img"
            alt="로고"
            onClick={() => navigate("/")}
          />
          codebomba
        </div>

        <div className="header-middle">
          <SearchBar />
        </div>

        <div className="header-right">
          <span
            className="header-text-btn"
            onClick={() => navigate("/user/lectures")}
          >
            내 강의실
          </span>
          <span
            className="header-text-btn"
            onClick={() => navigate("/user/problems")}
          >
            문제풀이
          </span>
          <button
            className="header-login-btn"
            onClick={() => navigate("/login")}
          >
            <img src={BluebombLogo} className="header-bomb-img" alt="아이콘" />
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
