import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import BluebombLogo from "../../assets/img/bluebomb-Icon.svg";
import { PROBLEM_CATEGORY } from "../../services/problemService";
import "./Sidebar.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function Sidebar({
  isOpen,
  userNickname: propsNickname,
  variant,
  problemSet,
  currentIndex = 0,
  problemStates = [],
  canMoveProblem,
  moveProblem,
  getProblemButtonClass,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const selectedCategoryId = new URLSearchParams(location.search).get(
    "categoryId",
  );

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

  // 채팅방 목록
  const [chatRooms, setChatRooms] = useState([]);

  // 현재 페이지 체크
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

  const isChatPage =
    currentPath.startsWith("/chat") ||
    currentPath.startsWith("/user/chat");

  // 채팅방 목록 조회
  useEffect(() => {
    if (!isChatPage) return;

    const fetchChatRooms = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await fetch(`${BASE_URL}/api/v1/chat/list`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("채팅방 목록 조회 실패");
        }

        const result = await response.json();

        // 최신순 정렬
        const sortedRooms = [...result.data].sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );

        setChatRooms(sortedRooms);
      } catch (error) {
        console.error(error);
      }
    };

    fetchChatRooms();

    // 새 채팅 생성 시 자동 갱신
    window.addEventListener("chatRoomUpdated", fetchChatRooms);

    return () => {
      window.removeEventListener("chatRoomUpdated", fetchChatRooms);
    };
  }, [isChatPage]);

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
          {/* OPERATOR */ }
          { isOperator && (
            <>
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
            </>
          ) }

          {/* ADMIN */ }
          { isAdminUser && (
            <>
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
            </>
          ) }
        </ul>
      </div>
    );
  };

  /* 마이페이지 사이드바 */
  const MypageMenu = () => (
    <div className="sidebar-content">
      <div className="profile-section">
        <div className="profile-img-box">
          <img src={ BluebombLogo } alt="프로필" className="profile-img" />
        </div>

        <span className="profile-nickname">{ nickname }</span>
      </div>

      <ul className="sidebar-list">
        <li>
          <NavLink
            to="/user/introduce"
            className={ ({ isActive }) =>
              `sidebar-item ${isActive ? "active" : ""}`
            }
          >
            내 소개
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/user/profile"
            className={ ({ isActive }) =>
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
        <li>
          <button
            type="button"
            className={ `sidebar-item sidebar-button ${
              selectedCategoryId ? "" : "active"
            }` }
            onClick={ () => navigate("/user/problems") }
          >
            전체
          </button>
        </li>

        { Object.entries(PROBLEM_CATEGORY).map(([categoryId, categoryName]) => (
          <li key={ categoryId }>
            <button
              type="button"
              className={ `sidebar-item sidebar-button ${
                selectedCategoryId === categoryId ? "active" : ""
              }` }
              onClick={ () =>
                navigate(`/user/problems?categoryId=${categoryId}`)
              }
            >
              { categoryName }
            </button>
          </li>
        )) }
      </ul>
    </div>
  );

  const ProblemDetailMenu = () => (
    <div className="sidebar-content problem-detail-sidebar-content">
      <h3 className="sidebar-title">
        전체 문제 { currentIndex + 1 }/{ problemSet?.problems?.length ?? 0 }
      </h3>

      <ul className="sidebar-list">
        { problemSet?.problems?.map((problem, index) => {
          const locked = canMoveProblem ? !canMoveProblem(index) : false;
          const buttonClass = getProblemButtonClass
            ? getProblemButtonClass(problemStates[index], currentIndex === index)
            : "";

          return (
            <li key={ problem.problemId ?? index }>
              <button
                type="button"
                disabled={ locked }
                className={
                  `sidebar-item problem-detail-sidebar-item ${buttonClass} ${
                    locked ? "locked-problem" : ""
                  }`
                }
                onClick={ () => moveProblem?.(index) }
              >
                { problem.title }
              </button>
            </li>
          );
        }) }
      </ul>
    </div>
  );

  /* 채팅 사이드바 */
  const ChatMenu = () => (
    <div className="sidebar-content">
      {/* 새 대화 */ }
      <div
        className="sidebar-title chat-new-button"
        onClick={ () => navigate("/user/chat") }
      >
        + 새대화 시작
      </div>

      {/* 기존 대화 */ }
      <h3 className="sidebar-title">기존대화</h3>

      <ul className="sidebar-list">
        { chatRooms.map((room) => (
          <li key={ room.roomId }>
            <NavLink
              to={ `/user/chat/${room.roomId}` }
              className={ ({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
            >
              { room.title }
            </NavLink>
          </li>
        )) }
      </ul>
    </div>
  );

  if (variant === "problem-detail") {
    return (
      <aside className={ `sidebar ${isOpen ? "open" : ""}` }>
        { ProblemDetailMenu() }
      </aside>
    );
  }

  if (!isAdminPath && !isCategory && !isMypage && !isChatPage) {
    return null;
  }

  return (
    <aside className={ `sidebar ${isOpen ? "open" : ""}` }>
      { isAdminPath && AdminMenu() }
      { isMypage && MypageMenu() }
      { isCategory && ProblemCategoryMenu() }
      { isChatPage && ChatMenu() }
    </aside>
  );
}

export default Sidebar;
