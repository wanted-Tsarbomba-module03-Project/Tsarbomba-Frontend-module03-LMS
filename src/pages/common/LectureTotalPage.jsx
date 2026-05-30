import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCourseDetail,
  getCourseLectures,
  enrollCourse,
  deleteCourse,
} from "../../services/lectureService";
import OneButtonModal from "../../components/common/OneButtonModal";
import TwoButtonModal from "../../components/common/TwoButtonModal";
import "./LectureTotalPage.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LectureTotalPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [onAlertClose, setOnAlertClose] = useState(null);

  const isLoggedIn = !!localStorage.getItem("userNickname");
  const userRole = localStorage.getItem("userRole") || "GUEST";

  const getFullImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    const cleanPath = url.replace(/\\/g, "/").split("/uploads/").pop();
    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  useEffect(() => {
    if (!id || id === "undefined") {
      console.error("🚨 URL에서 올바른 강좌 ID를 찾을 수 없습니다.");
      setLoading(false);
      return;
    }

    setLoading(true);

    Promise.all([getCourseDetail(id), getCourseLectures(id)])
      .then(([courseData, lectureData]) => {
        if (courseData) {
          setCourse(courseData);

          if (
            courseData.isEnrolled === true ||
            courseData.enrolled === true ||
            courseData.enrollStatus === "ACTIVE" ||
            courseData.enrollmentStatus === "ENROLLED"
          ) {
            setIsEnrolled(true);
          }
        }

        if (lectureData) {
          const finalLectures = Array.isArray(lectureData)
            ? lectureData
            : lectureData?.data || [];
          setLectures(finalLectures);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("🚨 강좌 및 커리큘럼 데이터 로드 실패:", err);
        setLoading(false);
      });
  }, [id]);

  const handleEnrollSubmit = async () => {
    if (!isLoggedIn) {
      setAlertMessage(
        "로그인이 필요한 서비스입니다. 로그인 페이지로 이동합니다.",
      );
      setOnAlertClose(() => () => navigate("/login"));
      setIsAlertOpen(true);
      return;
    }
    if (userRole !== "STUDENT") {
      setAlertMessage("수강 신청은 학생 계정으로만 가능합니다.");
      setOnAlertClose(null);
      setIsAlertOpen(true);
      setIsEnrollModalOpen(false);
      return;
    }
    if (isSubmitting || isEnrolled) return;

    try {
      setIsSubmitting(true);
      await enrollCourse(id);
      setIsEnrolled(true);
      setIsEnrollModalOpen(false);

      setAlertMessage("수강신청이 성공적으로 완료되었습니다!");
      setOnAlertClose(() => () => navigate("/user/my-classroom"));
      setIsAlertOpen(true);
    } catch (err) {
      if (err.message && err.message.includes("Duplicate entry")) {
        setIsEnrolled(true);
        setAlertMessage("이미 수강 신청이 완료된 강좌입니다.");
        setOnAlertClose(() => () => navigate("/user/my-classroom"));
      } else {
        setAlertMessage(err.message || "수강신청 처리 중 에러가 발생했습니다.");
        setOnAlertClose(null);
      }
      setIsAlertOpen(true);
      setIsEnrollModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await deleteCourse(id);
      setIsDeleteModalOpen(false);
      setAlertMessage("강좌가 삭제되었습니다.");
      setOnAlertClose(() => () => navigate("/admin/lectures"));
      setIsAlertOpen(true);
    } catch (err) {
      setAlertMessage("강좌 삭제 권한이 없거나 실패했습니다.");
      setOnAlertClose(null);
      setIsAlertOpen(true);
      setIsDeleteModalOpen(false);
    }
  };

  const handleLectureClick = (lectureId) => {
    if (!lectureId) {
      setAlertMessage("유효하지 않은 강의입니다.");
      setOnAlertClose(null);
      setIsAlertOpen(true);
      return;
    }

    if (!isLoggedIn && userRole === "GUEST") {
      setAlertMessage("강의 시청은 로그인이 필요합니다. 먼저 로그인 해주세요!");
      setOnAlertClose(() => () => navigate("/login"));
      setIsAlertOpen(true);
      return;
    }
    navigate(`/user/lecture/${id}/${lectureId}`);
  };

  if (loading) {
    return <div className="loading-text">강좌 정보를 불러오는 중입니다...</div>;
  }

  if (!course) {
    return <div className="loading-text">존재하지 않는 강좌입니다.</div>;
  }

  const courseBannerImg = getFullImageUrl(
    course.thumbnailUrl || course.courseThumbnailUrl,
  );

  return (
    <div className="lecture-total-container">
      <div
        className={`course-main-banner-card ${courseBannerImg ? "has-img" : "no-img"}`}
        style={
          courseBannerImg
            ? { "--banner-bg-img": `url(${courseBannerImg})` }
            : null
        }
      >
        {!courseBannerImg && (
          <div className="banner-center-icon-box">
            <svg
              className="book-svg-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}

        <div className="banner-bottom-row">
          <div className="banner-info-text-group">
            <h1 className="course-detail-title">
              {course.title || course.courseName}
            </h1>
            <p className="course-detail-desc">{course.description}</p>
          </div>

          <div className="banner-action-btn-group">
            {userRole !== "INSTRUCTOR" &&
              userRole !== "OPERATOR" &&
              userRole !== "ADMIN" && (
                <button
                  className={`enroll-submit-btn ${isEnrolled || isSubmitting ? "enrolled" : ""}`}
                  disabled={isEnrolled || isSubmitting}
                  onClick={() => setIsEnrollModalOpen(true)}
                >
                  {isEnrolled
                    ? "수강 중인 강좌"
                    : isSubmitting
                      ? "신청 중..."
                      : "수강 신청하기"}
                </button>
              )}

            {(userRole === "INSTRUCTOR" ||
              userRole === "OPERATOR" ||
              userRole === "ADMIN") && (
              <div className="instructor-action-group">
                <button
                  className="action-btn navy-bg-btn"
                  onClick={() => navigate(`/admin/lecture/${id}/progress`)}
                >
                  학습률 조회하기
                </button>
                <button
                  className="action-btn navy-bg-btn"
                  onClick={() => navigate(`/admin/lecture/${id}/edit`)}
                >
                  수정하기
                </button>
                <button
                  className="action-btn white-red-btn"
                  onClick={() => setIsDeleteModalOpen(true)}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="curriculum-title">커리큘럼 (총 {lectures.length}개)</h3>
      <div className="curriculum-list">
        {lectures.map((lec, index) => {
          const currentLectureId = lec.lectureId || lec.id;

          return (
            <div
              key={currentLectureId || index}
              className="curriculum-item"
              onClick={() => handleLectureClick(currentLectureId)}
            >
              <span className="lecture-item-text">
                {index + 1}주차: {lec.title || "제목 없는 강의"}
              </span>
              <span className="arrow-icon">&gt;</span>
            </div>
          );
        })}
      </div>

      <TwoButtonModal
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
        onConfirm={handleEnrollSubmit}
        modalTitle="수강신청"
        modalContent="수강신청을 진행하시겠습니까?"
      />

      <TwoButtonModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSubmit}
        modalTitle="강좌 삭제"
        modalContent="정말 이 강좌를 삭제하시겠습니까?"
      />

      <OneButtonModal
        isOpen={isAlertOpen}
        onClose={() => {
          setIsAlertOpen(false);
          if (onAlertClose) onAlertClose();
        }}
        modalTitle="알림"
        modalContent={alertMessage}
      />
    </div>
  );
}

export default LectureTotalPage;
