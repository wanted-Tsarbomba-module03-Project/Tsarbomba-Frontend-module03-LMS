import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";
import "./Sidebar.css";

function Sidebar({ isOpen, userNickname = "게스트" }) {
  const location = useLocation();
  const currentPath = location.pathname;

  /* 관리자 페이지 사이드바 */
  const AdminMenu = () => (
    <div className="sidebar-content">
      <h3 className="sidebar-title">관리페이지</h3>
      <ul className="sidebar-list">
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
      </ul>
    </div>
  );

  /* 마이페이지 사이드바 컴포넌트 */
  const MypageMenu = () => (
    <div className="sidebar-content">
      <div className="profile-section">
        <div className="profile-img-box">
          <img src={BluebombLogo} alt="프로필" className="profile-img" />
        </div>
        <span className="profile-nickname">{userNickname}</span>
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

  const isAdmin = currentPath.startsWith("/admin");

  const isCategory =
    currentPath.startsWith("/problems") ||
    currentPath.includes("/problem/") ||
    currentPath === "/user/problems";

  const isMypage =
    (currentPath.startsWith("/user/introduce") ||
      currentPath.startsWith("/user/profile")) &&
    !isCategory;

  if (!isAdmin && !isCategory && !isMypage) {
    return null;
  }

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {isAdmin && AdminMenu()}
      {isMypage && MypageMenu()}
      {isCategory && ProblemCategoryMenu()}
    </aside>
  );
}

export default Sidebar;
