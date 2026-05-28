import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";
import "./Sidebar.css";

function Sidebar({ isOpen, userNickname: propsNickname }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // 닉네임
  const [nickname, setNickname] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userNickname") || propsNickname || "";
    }
    return propsNickname || "";
  });

  // role
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userRole") || "";
    }
    return "";
  });

  // 실시간 유저 정보 업데이트
  useEffect(() => {
    const updateUserInfo = () => {
      const savedNickname = localStorage.getItem("userNickname");
      const savedRole = localStorage.getItem("userRole");
      if (savedNickname) setNickname(savedNickname);
      if (savedRole) setUserRole(savedRole);
    };

    updateUserInfo();

    window.addEventListener("loginSuccess", updateUserInfo);
    window.addEventListener("storage", updateUserInfo);

    return () => {
      window.removeEventListener("loginSuccess", updateUserInfo);
      window.removeEventListener("storage", updateUserInfo);
    };
  }, []);

  useEffect(() => {
    if (propsNickname) setNickname(propsNickname);
  }, [propsNickname]);

  /* 관리자 사이드바 */
  const AdminMenu = () => {
    const isOperator = userRole === "OPERATOR";
    const isAdminUser = userRole === "ADMIN";

    return (
      <div className="sidebar-content">
        <h3 className="sidebar-title">관리페이지</h3>
        <ul className="sidebar-list">
          {/* OPERATOR */}
          {isOperator && (
            <>
              <li>
                <NavLink
                  to="/admin/lectures"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  강의 관리
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/problems"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  문제 관리
                </NavLink>
              </li>
            </>
          )}

          {/* Admin */}
          {isAdminUser && (
            <>
              <li>
                <NavLink
                  to="/admin/users"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  회원 관리
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/badges"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  뱃지 관리
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/rules"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  규칙 관리
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/alrams"
                  className={({ isActive }) =>
                    `sidebar-item ${isActive ? "active" : ""}`
                  }
                >
                  알람 관리
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    );
  };

  /* 마이페이지 사이드바 */
  const MypageMenu = () => (
    <div className="sidebar-content">
      <div className="profile-section">
        <div className="profile-img-box">
          <img src={BluebombLogo} alt="프로필" className="profile-img" />
        </div>
        <span className="profile-nickname">{nickname}</span>
      </div>
      <ul className="sidebar-list">
        <li>
          <NavLink
            to="/user/introduce"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            내 소개
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/user/profile"
            className={({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            프로필 정보
          </NavLink>
        </li>
      </ul>
    </div>
  );

  /* 문제풀이 페이지 사이드바 */
  const ProblemCategoryMenu = () => (
    <div className="sidebar-content">
      <h3 className="sidebar-title">카테고리</h3>
      <ul className="sidebar-list">
        <li className="sidebar-item active">데이터 분석</li>
        <li className="sidebar-item">머신러닝</li>
        <li className="sidebar-item">Python</li>
        <li className="sidebar-item">SQL</li>
        <li className="sidebar-item">통계</li>
        <li className="sidebar-item">시각화</li>
        <li className="sidebar-item">빅데이터</li>
      </ul>
    </div>
  );

  const isAdminPath = currentPath.startsWith("/admin");

  const isCategory =
    !isAdminPath &&
    userRole === "STUDENT" &&
    (currentPath.startsWith("/problems") ||
      currentPath.includes("/problem/") ||
      currentPath === "/user/problems");

  const isMypage =
    (currentPath.startsWith("/user/introduce") ||
      currentPath.startsWith("/user/profile")) &&
    !isCategory;

  if (!isAdminPath && !isCategory && !isMypage) {
    return null;
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {isAdminPath && AdminMenu()}
      {isMypage && MypageMenu()}
      {isCategory && ProblemCategoryMenu()}
    </aside>
  );
}

export default Sidebar;
