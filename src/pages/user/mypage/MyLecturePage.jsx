import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentCourses } from "../../../services/lectureService";
import LectureItem from "../../../components/lecture/MyLectureItem";
import "./MyLecturePage.css";

function MyLecturePage() {
  const navigate = useNavigate();
  const [ongoingLectures, setOngoingLectures] = useState([]);
  const [pastLectures, setPastLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyLectures = async () => {
      try {
        setLoading(true);
        const data = await getStudentCourses();
        const allCourses = Array.isArray(data) ? data : data?.courses || [];

        const myEnrolledCourses = allCourses.filter(
          (course) =>
            course.isEnrolled === true ||
            course.enrolled === true ||
            course.enrollStatus === "ACTIVE" ||
            course.enrollmentStatus === "ENROLLED",
        );

        const ongoing = myEnrolledCourses.filter(
          (course) => course.status === "ACTIVE",
        );
        const past = myEnrolledCourses.filter(
          (course) => course.status === "DRAFT" || course.status === "DELETED",
        );

        setOngoingLectures(ongoing);
        setPastLectures(past);
      } catch (error) {
        console.error("내 강의실 데이터 로드 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyLectures();
  }, []);

  const handleCardClick = (courseId) => {
    if (!courseId) return;
    navigate(`/user/lecture/${courseId}`);
  };

  if (loading) {
    return (
      <div className="classroom-loading-placeholder">
        강의실 데이터를 로드 중입니다...
      </div>
    );
  }

  return (
    <div className="my-classroom-container">
      <div className="classroom-section-box">
        <div className="classroom-section-header">
          <h2 className="classroom-title-text">진행 중인 강의</h2>
          <span className="classroom-count-badge">
            {ongoingLectures.length}개
          </span>
        </div>

        {ongoingLectures.length === 0 ? (
          <div className="classroom-empty-text">진행 중인 강의가 없습니다.</div>
        ) : (
          <div className="classroom-lecture-grid-layout ongoing-grid">
            {ongoingLectures.map((course) => (
              <LectureItem
                key={course.id || course.courseId}
                lecture={course}
                type="card"
                onClick={() => handleCardClick(course.id || course.courseId)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="classroom-section-box">
        <div className="classroom-section-header">
          <h2 className="classroom-title-text">지난 강의</h2>
          <span className="classroom-count-badge grey-badge">
            {pastLectures.length}개
          </span>
        </div>

        {pastLectures.length === 0 ? (
          <div className="classroom-empty-text">지난 강의가 없습니다.</div>
        ) : (
          <div className="classroom-lecture-grid-layout">
            {pastLectures.map((course) => (
              <LectureItem
                key={course.id || course.courseId}
                lecture={course}
                type="card"
                onClick={() => handleCardClick(course.id || course.courseId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyLecturePage;
