import React, { useState } from "react";
import "./introducepage.css";
import EditIcon from "../../../assets/img/edit-Icon.svg";
import TwoButtonModal from "../../../components/common/TwoButtonModal.jsx";
import OneButtonModal from "../../../components/common/OneButtonModal.jsx";

function IntroducePage() {
  // 소개, 약력
  const [introduceText, setIntroduceText] = useState("");
  const [introduceHistory, setIntroduceHistory] = useState("");

  // 수정
  const [isIntroduceEditIntro, setIsIntroduceEditIntro] = useState(false);
  const [isIntroduceEditHistory, setIsIntroduceEditHistory] = useState(false);

  const [introduceTempIntro, setIntroduceTempIntro] = useState(introduceText);
  const [introduceTempHistory, setIntroduceTempHistory] =
    useState(introduceHistory);

  // 모달창
  const [isIntroduceTwoModalOpen, setIsIntroduceTwoModalOpen] = useState(false);
  const [introduceModalTarget, setIntroduceModalTarget] = useState("");

  const [isIntroduceOneModalOpen, setIsIntroduceOneModalOpen] = useState(false);
  const [introduceOneModalTitle, setIntroduceOneModalTitle] = useState("");
  const [introduceOneModalContent, setIntroduceOneModalContent] = useState("");

  // 모달
  const openIntroduceConfirmModal = (target) => {
    setIntroduceModalTarget(target);
    setIsIntroduceTwoModalOpen(true);
  };

  const handleIntroduceConfirmSave = () => {
    if (introduceModalTarget === "intro") {
      setIntroduceText(introduceTempIntro);
      setIsIntroduceEditIntro(false);
      setIntroduceOneModalTitle("수정 완료");
      setIntroduceOneModalContent("소개글이 수정되었습니다.");
    } else if (introduceModalTarget === "history") {
      setIntroduceHistory(introduceTempHistory);
      setIsIntroduceEditHistory(false);
      setIntroduceOneModalTitle("수정 완료");
      setIntroduceOneModalContent("약력이 수정되었습니다.");
    }

    setIsIntroduceTwoModalOpen(false);
    setIsIntroduceOneModalOpen(true);
  };

  return (
    <div className="introduce-container">
      {/* 소개 */}
      <section className="introduce-intro-card">
        <div className="introduce-card-header">
          <h2 className="introduce-card-title">소개</h2>
          {!isIntroduceEditIntro && (
            <button
              className="introduce-edit-btn"
              onClick={() => {
                setIntroduceTempIntro(introduceText);
                setIsIntroduceEditIntro(true);
              }}
            >
              <img
                src={EditIcon || null}
                alt="수정"
                className="introduce-edit-icon-img"
              />
            </button>
          )}
        </div>
        <div className="introduce-card-content">
          {isIntroduceEditIntro ? (
            <div className="introduce-edit-box">
              <input
                type="text"
                className="introduce-edit-input"
                placeholder="자기소개를 입력해주세요."
                value={introduceTempIntro}
                onChange={(e) => setIntroduceTempIntro(e.target.value)}
              />
              <button
                className="introduce-save-btn"
                onClick={() => openIntroduceConfirmModal("intro")}
              >
                완료
              </button>
            </div>
          ) : (
            <p
              className={`introduce-text-display ${!introduceText ? "introduce-empty-text" : ""}`}
            >
              {introduceText ||
                "등록된 소개글이 없습니다. 수정 버튼을 눌러 소개글을 작성해보세요!"}
            </p>
          )}
        </div>
      </section>

      {/* 약력 */}
      <section className="introduce-intro-card">
        <div className="introduce-card-header">
          <h2 className="introduce-card-title">약력</h2>
          {!isIntroduceEditHistory && (
            <button
              className="introduce-edit-btn"
              onClick={() => {
                setIntroduceTempHistory(introduceHistory);
                setIsIntroduceEditHistory(true);
              }}
            >
              <img
                src={EditIcon || null}
                alt="수정"
                className="introduce-edit-icon-img"
              />
            </button>
          )}
        </div>
        <div className="introduce-card-content">
          {isIntroduceEditHistory ? (
            <div className="introduce-edit-box">
              <textarea
                className="introduce-edit-textarea"
                rows="6"
                placeholder="학력, 전공, 수상 경력 등 핵심 약력을 적어주세요."
                value={introduceTempHistory}
                onChange={(e) => setIntroduceTempHistory(e.target.value)}
              />
              <button
                className="introduce-save-btn"
                onClick={() => openIntroduceConfirmModal("history")}
              >
                완료
              </button>
            </div>
          ) : (
            <p
              className={`introduce-text-display introduce-pre-wrap ${!introduceHistory ? "introduce-empty-text" : ""}`}
            >
              {introduceHistory ||
                "등록된 약력이 없습니다. 수정 버튼을 눌러 약력을 작성해보세요!"}
            </p>
          )}
        </div>
      </section>

      {/* 모달 */}
      <TwoButtonModal
        isOpen={isIntroduceTwoModalOpen}
        onClose={() => setIsIntroduceTwoModalOpen(false)}
        onConfirm={handleIntroduceConfirmSave}
        modalTitle="수정 확인"
        modalContent={
          introduceModalTarget === "intro"
            ? "소개글을 수정하시겠습니까?"
            : "약력을 수정하시겠습니까?"
        }
      />

      <OneButtonModal
        isOpen={isIntroduceOneModalOpen}
        onClose={() => setIsIntroduceOneModalOpen(false)}
        modalTitle={introduceOneModalTitle}
        modalContent={introduceOneModalContent}
      />
    </div>
  );
}

export default IntroducePage;
