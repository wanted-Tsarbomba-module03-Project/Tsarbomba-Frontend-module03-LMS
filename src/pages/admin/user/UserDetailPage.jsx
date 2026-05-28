import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./UserDetailPage.css";

import List from "../../../../src/components/common/List";
import OneButtonModal from "../../../../src/components/common/OneButtonModal";

import { useUserDetail } from "../../../../src/hooks/useUserDetail";
import { useUserLists } from "../../../../src/hooks/useUserLists";
import { toggleUserLock } from "../../../../src/services/adminService";

function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const BASE_URL = import.meta.env.VITE_API_URL;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");

  const [tab, setTab] = useState("COURSE");
  const [isLoading, setIsLoading] = useState(false);

  // 임의값
  const courseId = 1;

  // hooks
  const { user, setUser, loading: userLoading } = useUserDetail(id);

  const { listData } = useUserLists({
    tab,
    userId: id,
    courseId,
  });

  // 회원 상태 변경
  const handleLockToggle = async () => {
    if (isLoading || !user) return;

    try {
      setIsLoading(true);

      const nextLocked = !user.isLocked;

      await toggleUserLock(id, nextLocked);

      setUser((prev) => ({
        ...prev,
        isLocked: nextLocked,
      }));

      setModalTitle(
        nextLocked
          ? "계정이 비활성화되었습니다."
          : "계정이 활성화되었습니다."
      );

      setModalContent(
        nextLocked
          ? "해당 회원의 계정이 비활성화되었습니다."
          : "해당 회원의 계정이 활성화되었습니다."
      );

      setIsModalOpen(true);
    } catch (err) {
      console.error(err);

      setModalTitle("오류 발생");
      setModalContent("상태 변경 중 오류가 발생했습니다.");
      setIsModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  // columns
  const courseColumns = [
    { key: "index", label: "No." },
    { key: "title", label: "강의명" },
    {
      key: "progress",
      label: "진행도",
      render: (item) => `${item.progress ?? 0}%`,
    },
    { key: "date", label: "등록일" },
  ];

  const problemColumns = [
    { key: "index", label: "No." },
    { key: "problemTitle", label: "문제명" },
    {
      key: "submissionStatus",
      label: "결과",
    },
    {
      key: "submittedAt",
      label: "제출일",
      render: (item) => item.submittedAt?.split("T")[0],
    },
  ];

  if (userLoading || !user) return <div>로딩중...</div>;

  return (
    <>
      <div className="user-detail-container">
        {/* HEADER */ }
        <div className="page-header">
          <h2 className="page-title">회원 상세조회</h2>

          <div className="header-btn-group">
            <button
              className="gray-btn"
              onClick={ handleLockToggle }
              disabled={ isLoading }
            >
              { isLoading
                ? "처리중..."
                : user.isLocked
                  ? "정지해제"
                  : "계정정지" }
            </button>

            <button
              className="gray-btn"
              onClick={ () => navigate("/admin/users") }
            >
              목록으로
            </button>
          </div>
        </div>

        {/* USER INFO */ }
        <div className="info-section">
          <div className="row">
            <div className="input-group">
              <label>이름</label>
              <div className="readonly-box">{ user.name }</div>
            </div>

            <div className="input-group">
              <label>닉네임</label>
              <div className="readonly-box">{ user.nickname || "-" }</div>
            </div>
          </div>

          <div className="row">
            <div className="input-group">
              <label>이메일</label>
              <div className="readonly-box">{ user.email }</div>
            </div>

            <div className="input-group">
              <label>전화번호</label>
              <div className="readonly-box">{ user.phone }</div>
            </div>
          </div>

          <div className="input-group">
            <label>역할</label>
            <div className="readonly-box">{ user.role }</div>
          </div>

          <div className="input-group">
            <label>계정 상태</label>
            <div className="readonly-box">
              { user.isLocked ? "비활성" : "활성" }
            </div>
          </div>
        </div>

        {/* 리스트 버튼 */ }
        <div style={ { display: "flex", gap: "10px", marginTop: "20px" } }>
          <button
            className={ tab === "COURSE" ? "btn active" : "btn" }
            onClick={ () => setTab("COURSE") }
          >
            강의목록
          </button>

          <button
            className={ tab === "PROBLEM" ? "btn active" : "btn" }
            onClick={ () => setTab("PROBLEM") }
          >
            문제목록
          </button>
        </div>

        {/* 리스트 */ }
        <div className="list-section">
          <List
            data={ listData }
            columns={ tab === "COURSE" ? courseColumns : problemColumns }
          />
        </div>
      </div>

      <OneButtonModal
        isOpen={ isModalOpen }
        onClose={ () => setIsModalOpen(false) }
        modalTitle={ modalTitle }
        modalContent={ modalContent }
      />
    </>
  );
}

export default UserDetailPage;