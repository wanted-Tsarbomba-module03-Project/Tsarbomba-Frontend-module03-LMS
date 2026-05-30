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
  // 현재 유저의 role 상태
  const [userRole, setUserRole] = useState(
    localStorage.getItem("userRole") || "",
  );

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const syncHeaderStatus = () => {
    const savedNickname = localStorage.getItem("userNickname");
    const savedRole = localStorage.getItem("userRole");

    if (savedNickname) {
      setIsLoggedIn(true);
      setNickname(savedNickname);
      setUserRole(savedRole || "");
    } else {
      setIsLoggedIn(false);
      setNickname("닉네임");
      setUserRole("");
    }
  };

  useEffect(() => {
    syncHeaderStatus();

    window.addEventListener("loginSuccess", syncHeaderStatus);
    return () => {
      window.removeEventListener("loginSuccess", syncHeaderStatus);
    };
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

    // 로그아웃
    try {
      await logoutService();
    } catch (e) {
      console.error(e);
    }

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
            <span className="header-logo-text" onClick={() => navigate("/")}>
              codebomba
            </span>
          </div>
        </div>
      </header>
    );
  }

  // 관리자(ADMIN, OPERATOR) 여부 확인
  const isManagementRole = userRole === "ADMIN" || userRole === "OPERATOR";

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
          <span className="header-logo-text" onClick={() => navigate("/")}>
            codebomba
          </span>
        </div>

        <div className="header-middle">
          <SearchBar />
        </div>

        <div className="header-right">
          {isLoggedIn && !isManagementRole && (
            <>
              <span
                className="header-text-btn"
                onClick={() => navigate("/user/chat")}
              >
                챗봇
              </span>
              <span
                className="header-text-btn"
                onClick={() => navigate("/user/my-classroom")}
              >
                내 강의실
              </span>
              <span
                className="header-text-btn"
                onClick={() => navigate("/user/problems")}
              >
                문제풀이
              </span>
            </>
          )}

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
              {isDropdownOpen && (
                <div className="header-dropdown-box">
                  {!isManagementRole && (
                    <div
                      className="header-dropdown-item"
                      onClick={() => {
                        navigate("/user/introduce");
                        setIsDropdownOpen(false);
                      }}
                    >
                      마이페이지
                    </div>
                  )}
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
