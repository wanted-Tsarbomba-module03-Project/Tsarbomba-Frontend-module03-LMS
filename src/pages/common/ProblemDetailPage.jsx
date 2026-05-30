import CategoryNav from "../../components/layout/CategoryNav";
import Sidebar from "../../components/layout/Sidebar";
import ProblemContentBox from "../../components/problem/ProblemContentBox";
import ProblemDetailModals from "../../components/problem/ProblemDetailModals";
import ProblemSolveBox from "../../components/problem/ProblemSolveBox";
import useProblemDetail from "../../hooks/useProblemDetail";
import "./ProblemDetailPage.css";

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
    currentHints,
    submissionResult,
    isSubmitting,
    successModalOpen,
    setSuccessModalOpen,
    emptySubmitModalOpen,
    setEmptySubmitModalOpen,
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

  // 현재 문제의 작성 코드 저장
  const handleCodeChange = (nextCode) => {
    setCode(nextCode);

    const updatedCodes = [...userCodes];
    updatedCodes[currentIndex] = nextCode;

    setUserCodes(updatedCodes);
  };

  return (
    <>
      <div className="problem-detail-container">
        {/* 문제 상세 상단 네비게이션 */}
        <CategoryNav variant="problem-detail" onBack={handleBackButton} />

        <div className="problem-detail-main">
          {/* 문제 이동 사이드바 */}
          <Sidebar
            variant="problem-detail"
            problemSet={problemSet}
            currentIndex={currentIndex}
            problemStates={problemStates}
            canMoveProblem={canMoveProblem}
            moveProblem={moveProblem}
            getProblemButtonClass={getProblemButtonClass}
          />

          <div className="problem-detail-content">
            {/* 문제 내용 */}
            <ProblemContentBox content={currentProblem.content} />

            {/* 문제 풀이 영역 */}
            <ProblemSolveBox
              activeTab={activeTab}
              code={code}
              currentHints={currentHints}
              currentProblem={currentProblem}
              hintEnabled={hintEnabled[currentIndex]}
              isSubmitting={isSubmitting}
              showHintToast={showHintToast}
              solutionEnabled={solutionEnabled[currentIndex]}
              submissionResult={submissionResult}
              onChangeCode={handleCodeChange}
              onChangeTab={setActiveTab}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>

      {/* 문제 상세 모달 */}
      <ProblemDetailModals
        successModalOpen={successModalOpen}
        emptySubmitModalOpen={emptySubmitModalOpen}
        warningModalOpen={warningModalOpen}
        onCloseSuccess={() => setSuccessModalOpen(false)}
        onCloseEmptySubmit={() => setEmptySubmitModalOpen(false)}
        onCloseWarning={() => setWarningModalOpen(false)}
        onConfirmBack={handleConfirmBack}
      />
    </>
  );
}

export default ProblemDetailPage;
