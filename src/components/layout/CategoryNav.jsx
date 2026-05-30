import React from "react";
import { useLocation } from "react-router-dom";
import "./CategoryNav.css";
import "../common/reset.css";

function CategoryNav({
  variant = "category",
  onBack,
  onRun,
}) {
  const location = useLocation();
  const categories = [
    "전체",
    "데이터 분석",
    "머신러닝",
    "Python",
    "SQL",
    "통계",
    "시각화",
    "빅데이터",
  ];

  if (variant === "category" && location.pathname.startsWith("/user/problem/")) {
    return null;
  }

  if (variant === "problem-detail") {
    return (
      <nav className="category-nav problem-detail-nav">
        <div className="category-nav-content problem-detail-nav-content">
          <button
            className="category-box problem-detail-nav-button"
            onClick={onBack}
          >
            뒤로가기
          </button>

          <button
            className="category-box active problem-detail-nav-button"
            onClick={onRun}
          >
            실행하기
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="category-nav">
      <div className="category-nav-content">
        {/* 좌측: 카테고리 */}
        <div className="category-nav-left">
          {categories.map((item, index) => (
            <button
              key={index}
              className={`category-box ${item === "전체" ? "active" : ""}`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* 우측: 정렬 드롭다운 */}
        <div className="category-nav-right">
          <select className="dropdown">
            <option>전체 정렬</option>
            <option>최신순</option>
            <option>인기순</option>
          </select>
        </div>
      </div>
    </nav>
  );
}

export default CategoryNav;
