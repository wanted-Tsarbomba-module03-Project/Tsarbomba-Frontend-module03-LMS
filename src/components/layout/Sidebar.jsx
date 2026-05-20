import React from "react";
import { NavLink } from "react-router-dom";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";
import "./Sidebar.css";

function Sidebar({ isOpen, userNickname = "게스트" }) {
  const currentPath = window.location.pathname;

  /* 관리자 페이지 사이드바 */
  const AdminMenu = () => (
    <div className="sidebar-content">
      <h3 className="sidebar-title">관리페이지</h3>

      <ul className="sidebar-list">

        <li>
          <NavLink
            to="/admin/users"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            회원 관리
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/lectures"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            강의 관리
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/problems"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            문제 관리
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/badges"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            뱃지 관리
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/rules"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            규칙 관리
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/alrams"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            알람 관리
          </NavLink>
        </li>

      </ul>
    </div>
  );

  /* 마이페이지 사이드바 */
  const MypageMenu = () => (
    <div className="sidebar-content">
      <div className="profile-section">
        <div className="profile-img-box">
          <img src={ BluebombLogo } alt="프로필" className="profile-img" />
        </div>
        <span className="profile-nickname">{ userNickname }</span>
      </div>
      <ul className="sidebar-list">
        <li
          className={ `sidebar-item ${currentPath.includes("/profile") ? "active" : ""}` }
        >
          내 소개
        </li>
        <li className="sidebar-item">프로필 정보</li>
        <li className="sidebar-item">로그아웃</li>
      </ul>
    </div>
  );

  /* 문제풀이 페이지 사이드바 */
  const problemCategoryMenu = () => (
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

  /* 사이드바 경로 지정 */
  const isAdmin = currentPath.includes("/admin");
  const isCategory = currentPath.includes("/problem");
  const isMypage =
    currentPath.includes("/profile") || currentPath.includes("/my-classroom");

  if (!isAdmin && !isCategory && !isMypage) {
    return null;
  }

  return (
    <aside className={ `sidebar ${isOpen ? "open" : ""}` }>
      { isAdmin && AdminMenu() }
      { isMypage && MypageMenu() }
      { isCategory && problemCategoryMenu() }
    </aside>
  );
}

export default Sidebar;
