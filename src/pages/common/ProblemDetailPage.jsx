import React from "react";
import "./ProblemDetailPage.css";

import OneButtonModal from "../../components/common/OneButtonModal";
import WarningButtonModal from "../../components/common/WarningModal";

import useProblemDetail from "../../hooks/useProblemDetail";

function ProblemDetailPage() {
  const {
    problemSet,
    currentProblem,

    currentIndex,

    code,
    setCode,

    userCodes,
    setUserCodes,

    showHintToast,

    problemStates,

    hintEnabled,

    solutionEnabled,

    activeTab,
    setActiveTab,

    successModalOpen,
    setSuccessModalOpen,

    warningModalOpen,
    setWarningModalOpen,

    canMoveProblem,
    moveProblem,

    handleSubmit,

    getProblemButtonClass,

    handleBackButton,
    handleConfirmBack,
  } = useProblemDetail();

  if (!problemSet) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="problem-detail-container">
        {/* 상단 */ }
        <div className="top-header">
          <button
            className="back-button"
            onClick={ handleBackButton }
          >
            뒤로가기
          </button>

          <button className="run-button">
            실행하기
          </button>
        </div>

        {/* 메인 */ }
        <div className="main-layout">
          {/* 사이드바 */ }
          <div className="sidebar">
            <h2>
              전체 문제 { currentIndex + 1 }/
              { problemSet.problems.length }
            </h2>

            { problemSet.problems.map(
              (problem, index) => {
                const locked =
                  !canMoveProblem(index);

                return (
                  <button
                    key={ index }
                    disabled={ locked }
                    className={ `${getProblemButtonClass(
                      problemStates[index],
                      currentIndex ===
                      index
                    )} ${locked
                      ? "locked-problem"
                      : ""
                      }` }
                    onClick={ () =>
                      moveProblem(index)
                    }
                  >
                    { problem.title }
                  </button>
                );
              }
            ) }
          </div>

          {/* 콘텐츠 */ }
          <div className="content">
            {/* 문제 내용 */ }
            <div className="problem-box">
              <h2>문제 내용</h2>

              <div className="problem-content">
                { currentProblem.content }
              </div>
            </div>

            {/* 풀이 */ }
            <div className="solve-box">
              <div className="editor-section">
                <h2>문제풀이영역</h2>

                <textarea
                  value={ code }
                  onChange={ (e) => {
                    setCode(
                      e.target.value
                    );

                    const updatedCodes =
                      [...userCodes];

                    updatedCodes[
                      currentIndex
                    ] = e.target.value;

                    setUserCodes(
                      updatedCodes
                    );
                  } }
                />
              </div>

              {/* 힌트 토스트 */ }
              <div className="hint-area">
                { showHintToast && (
                  <div className="hint-toast">
                    힌트를 확인할 수
                    있습니다.
                  </div>
                ) }
              </div>

              {/* 탭 */ }
              <div className="tabs">
                {/* 실행결과 */ }
                <button
                  className={
                    activeTab === "result"
                      ? "active-tab"
                      : ""
                  }
                  onClick={ () =>
                    setActiveTab("result")
                  }
                >
                  실행결과
                </button>

                {/* 힌트 */ }
                <button
                  disabled={
                    !hintEnabled[
                    currentIndex
                    ]
                  }
                  className={
                    !hintEnabled[
                      currentIndex
                    ]
                      ? "disabled-button"
                      : ""
                  }
                  onClick={ () =>
                    setActiveTab("hint")
                  }
                >
                  힌트
                </button>

                {/* 강의보기 */ }
                <button
                  disabled={
                    !hintEnabled[
                    currentIndex
                    ]
                  }
                  className={
                    !hintEnabled[
                      currentIndex
                    ]
                      ? "disabled-button"
                      : ""
                  }
                >
                  강의보기
                </button>

                {/* 풀이보기 */ }
                <button
                  disabled={
                    !solutionEnabled[
                    currentIndex
                    ]
                  }
                  className={
                    !solutionEnabled[
                      currentIndex
                    ]
                      ? "disabled-button"
                      : ""
                  }
                  onClick={ () =>
                    setActiveTab(
                      "solution"
                    )
                  }
                >
                  풀이보기
                </button>
              </div>

              {/* 하단 패널 */ }
              <div className="bottom-panel">
                {/* 실행결과 */ }
                { activeTab ===
                  "result" && (
                    <div>결과 영역</div>
                  ) }

                {/* 힌트 */ }
                { activeTab === "hint" && (
                  <div>
                    { currentProblem.hint }
                  </div>
                ) }

                {/* 풀이 */ }
                { activeTab ===
                  "solution" && (
                    <div>
                      {
                        currentProblem.explanation
                      }
                    </div>
                  ) }
              </div>

              {/* 제출 */ }
              <div className="submit-wrapper">
                <button
                  className="submit-button"
                  onClick={ handleSubmit }
                >
                  제출하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 정답 모달 */ }
      <OneButtonModal
        isOpen={ successModalOpen }
        onClose={ () =>
          setSuccessModalOpen(false)
        }
        modalTitle="정답입니다."
        modalContent="해당 문제의 풀이를 확인할 수 있습니다."
      />

      {/* 뒤로가기 모달 */ }
      <WarningButtonModal
        isOpen={ warningModalOpen }
        onClose={ () =>
          setWarningModalOpen(false)
        }
        onConfirm={ handleConfirmBack }
        modalTitle="정말 나가시겠습니까?"
        modalContent="작성한 내용이 모두 삭제됩니다."
      />
    </>
  );
}

export default ProblemDetailPage;