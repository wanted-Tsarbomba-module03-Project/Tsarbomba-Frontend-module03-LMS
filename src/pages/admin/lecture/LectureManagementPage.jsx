import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getStudentCourses,
  updateCourseStatus,
} from "../../../services/lectureService";
import LectureItem from "../../../components/lecture/MyLectureItem";
import OneButtonModal from "../../../components/common/OneButtonModal";
import TwoButtonModal from "../../../components/common/TwoButtonModal";
import "./lecturemanagementpage.css";

function LectureManagementPage() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState(null);

  useEffect(() => {
    setLoading(true);
    getStudentCourses()
      .then((data) => {
        const parsedData = data?.data || data;
        if (parsedData && Array.isArray(parsedData)) {
          const mappedData = parsedData.map((item, idx) => ({
            ...item,
            no: idx + 1,
            status: item.status,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          }));
          setCourses(mappedData);
        } else {
          setCourses([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("강의 관리 목록 로드 실패:", err);
        setCourses([]);
        setLoading(false);
      });
  }, []);

  const handleStatusChangeClick = (courseId, currentStatus) => {
    setPendingTarget({ courseId, currentStatus });
    setIsConfirmOpen(true);
  };

  const handleStatusConfirm = async () => {
    setIsConfirmOpen(false);
    if (!pendingTarget) return;

    const { courseId, currentStatus } = pendingTarget;
    const nextStatus = currentStatus === "ACTIVE" ? "DRAFT" : "ACTIVE";

    try {
      await updateCourseStatus(courseId, { status: nextStatus });

      setCourses((prev) =>
        prev.map((c) =>
          (c.id || c.courseId) === courseId
            ? { ...c, status: nextStatus, updatedAt: new Date().toISOString() }
            : c,
        ),
      );

      const statusText = nextStatus === "ACTIVE" ? "활성" : "비활성";
      setModalMessage(
        `강의 상태가 성공적으로 ${statusText} 상태로 변경되었습니다.`,
      );
      setIsModalOpen(true);
    } catch (err) {
      console.error("DB 상태 업데이트 실패:", err);

      if (err.message) {
        setModalMessage(err.message);
      } else {
        setModalMessage("상태 변경 권한이 없거나 서버 오류가 발생했습니다.");
      }
      setIsModalOpen(true);
    } finally {
      setPendingTarget(null);
    }
  };

  const handleRowClick = (courseId) => {
    if (!courseId) return;
    navigate(`/admin/lecture/${courseId}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage("");
  };

  if (loading) {
    return (
      <div className="lecture-manage-loading-view">
        강의 관리 목록을 로드 중입니다...
      </div>
    );
  }

  return (
    <div className="admin-management-contents">
      <div className="admin-table-control-header">
        <h2 className="admin-section-title">강의 관리</h2>
        <div className="admin-actions-group">
          <button
            className="admin-create-btn"
            onClick={() => navigate("/admin/lecture/new")}
          >
            등록하기
          </button>
          <select className="admin-sort-select">
            <option value="all">전체 정렬</option>
            <option value="active">활성</option>
            <option value="draft">비활성</option>
          </select>
        </div>
      </div>

      <table className="admin-data-table">
        <thead>
          <tr>
            <th>No.</th>
            <th>강의명</th>
            <th>등록일 / 수정일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td colSpan="4" className="no-data-td">
                등록된 강의가 존재하지 않습니다.
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <LectureItem
                key={course.id || course.courseId}
                lecture={course}
                type="list"
                onStatusChange={handleStatusChangeClick}
                onClick={() => handleRowClick(course.id || course.courseId)}
              />
            ))
          )}
        </tbody>
      </table>

      <TwoButtonModal
        isOpen={isConfirmOpen}
        onClose={() => {
          setIsConfirmOpen(false);
          setPendingTarget(null);
        }}
        onConfirm={handleStatusConfirm}
        modalTitle="상태 변경"
        modalContent="강의 상태를 변경하시겠습니까?"
      />

      <OneButtonModal
        isOpen={isModalOpen}
        onClose={closeModal}
        modalTitle="알림"
        modalContent={modalMessage}
      />
    </div>
  );
}

export default LectureManagementPage;
