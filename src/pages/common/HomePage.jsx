import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentCourses } from "../../services/lectureService";
import LectureItem from "../../components/lecture/MyLectureItem";
import "./Homepage.css";

function Homepage() {
  const navigate = useNavigate();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getStudentCourses()
      .then((data) => {
        const parsedData = data?.data || data;
        if (parsedData && Array.isArray(parsedData)) {
          const activeCourses = parsedData.filter(
            (course) => course.status === "ACTIVE",
          );
          setLectures(activeCourses);
        } else {
          setLectures([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("메인페이지 강좌 리스트 로드 실패:", err);
        setLectures([]);
        setLoading(false);
      });
  }, []);

  const handleCardClick = (courseId) => {
    if (!courseId) return;
    navigate(`/user/lecture/${courseId}`);
  };

  if (loading) {
    return (
      <div className="homepage-status-placeholder">
        개설된 강좌를 불러오는 중...
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="homepage-status-placeholder">
        현재 개설되어 운영 중인 공개 강좌가 존재하지 않습니다.
      </div>
    );
  }

  return (
    <div className="homepage-main-container">
      <div className="homepage-lecture-grid-layout">
        {lectures.map((course) => {
          const currentId = course.id || course.courseId;

          return (
            <LectureItem
              key={currentId}
              lecture={course}
              type="card"
              onClick={() => handleCardClick(currentId)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Homepage;
