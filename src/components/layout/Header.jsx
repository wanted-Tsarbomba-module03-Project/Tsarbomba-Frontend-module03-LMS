import React, { useState, useEffect } from "react";
import SearchBar from "../common/Searchbar";
import { useNavigate, useLocation } from "react-router-dom";
import TwoButtonModal from "../../components/common/TwoButtonModal";
import { logoutService } from "../../services/authService";
import "./Header.css";
import "../common/reset.css";
import Logo from "../../assets/img/logo-Icon.png";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";

function Header({ isSimple }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userNickname"),
  );
  const [nickname, setNickname] = useState(
    localStorage.getItem("userNickname") || "닉네임",
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // 임시 - 닉네임 가져오기
  useEffect(() => {
    const savedNickname = localStorage.getItem("userNickname");
    if (savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
    } else {
      setIsLoggedIn(false);
      setNickname("닉네임");
    }
  }, [location]);

  // 드롭다운, 모달
  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutClose = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogoutConfirm = async () => {
    setIsLogoutModalOpen(false);

    // 쿠키 삭제
    localStorage.clear();
    sessionStorage.clear();

    const deleteCookie = (name) => {
      document.cookie =
        name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
      document.cookie =
        name +
        "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" +
        window.location.hostname +
        ";";
    };

    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    deleteCookie("token");
    deleteCookie("JSESSIONID");

    setIsLoggedIn(false);

    setTimeout(() => {
      window.location.href = "/";
    }, 500);
  };

  /* 로고만 */
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

  /* 헤더 */
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

        {/* 글씨 */}
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

          {!isLoggedIn ? (
            <button
              className="header-login-btn"
              onClick={() => navigate("/login")}
            >
              <img
                src={BluebombLogo}
                className="header-bomb-img"
                alt="아이콘"
              />
              로그인
            </button>
          ) : (
            <div className="header-user-menu-container">
              <button
                className={`header-login-btn header-user-btn ${isDropdownOpen ? "active" : ""}`}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <img
                  src={BluebombLogo}
                  className="header-bomb-img"
                  alt="아이콘"
                />
                {nickname}
              </button>
              {/* 드롭다운 */}
              {isDropdownOpen && (
                <div className="header-dropdown-box">
                  <div
                    className="header-dropdown-item"
                    onClick={() => {
                      navigate("/user/profile");
                      setIsDropdownOpen(false);
                    }}
                  >
                    마이페이지
                  </div>
                  <div
                    className="header-dropdown-item"
                    onClick={handleLogoutClick}
                  >
                    로그아웃
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TwoButtonModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutClose}
        onConfirm={handleLogoutConfirm}
        modalTitle="로그아웃"
        modalContent="로그아웃 하시겠습니까?"
      />
    </header>
  );
}

export default Header;
