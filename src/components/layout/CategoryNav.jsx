import React from "react";
import "./CategoryNav.css";
import "../common/reset.css";

function CategoryNav() {
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

  return (
    <nav className="category-nav">
      <div className="nav-content">
        {/* 좌측: 카테고리 */}
        <div className="nav-left">
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
        <div className="nav-right">
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
