import React from "react";
import { useNavigate } from "react-router-dom";
import "./MyLectureItem.css";

function MyLectureItem({ lecture, onStatusChange, onClick, type = "list" }) {
  const navigate = useNavigate();
  const currentId = lecture.id || lecture.courseId;
  const currentStatus = lecture.status || "DRAFT";

  const rawDate =
    lecture.createdAt || lecture.created_at || lecture.createAt || lecture.date;
  const displayImage = lecture.thumbnailUrl || "video-default.png";
  const categoryName =
    lecture.categoryName || lecture.courseCategoryName || "데이터 분석";

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const toggleStatusBtn = (e) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(currentId, currentStatus);
    }
  };

  if (type === "list") {
    return (
      <tr className="lecture-item-row" onClick={onClick}>
        <td className="lecture-td-no">{lecture.no}</td>
        <td className="lecture-td-title">
          <div className="lecture-title-cell-wrap">
            <span className="lecture-main-title-text">
              {lecture.title || "제목 없는 강좌 코스"}
            </span>
          </div>
        </td>
        <td className="lecture-td-date">{formatDate(rawDate)}</td>
        <td className="lecture-td-status">
          <button
            type="button"
            className={`lecture-status-toggle-badge-btn ${currentStatus.toLowerCase()}`}
            onClick={toggleStatusBtn}
          >
            {currentStatus === "ACTIVE" ? "활성" : "비활성"}
          </button>
        </td>
      </tr>
    );
  }

  return (
    <div className="main-lecture-card" onClick={onClick}>
      <div className="main-lecture-thumb-wrapper">
        <img src={displayImage} alt="" className="main-lecture-img" />
      </div>

      <div className="main-lecture-content-box">
        <div className="main-lecture-tag-badge">{categoryName}</div>
        <h3 className="main-lecture-title-text">
          {lecture.title || "제목 없는 강좌 코스"}
        </h3>
        <p className="main-lecture-desc-text">
          {lecture.description ||
            "등록된 상세 설명이 존재하지 않는 코스입니다."}
        </p>
      </div>
    </div>
  );
}

export default MyLectureItem;
