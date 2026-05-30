function SubmissionResult({ submissionResult }) {
  if (!submissionResult) return null;

  return (
    <>
      <p>채점 결과: {submissionResult.isCorrect ? "정답" : "오답"}</p>
      <p>
        통과 테스트: {submissionResult.passedTestCount}/
        {submissionResult.totalTestCount}
      </p>
      <p>실행 상태: {submissionResult.executionStatus}</p>
      {submissionResult.errorMessage && <p>{submissionResult.errorMessage}</p>}
    </>
  );
}

// 힌트 목록 표시
function HintList({ hints }) {
  if (!hints.length) {
    return "힌트가 없습니다.";
  }

  return hints.map((hint) => <p key={hint.hintId}>{hint.hintContent}</p>);
}

// 선택된 탭에 맞는 하단 패널 표시
function ProblemBottomPanel({
  activeTab,
  currentHints,
  currentProblem,
  submissionResult,
}) {
  const solutionText =
    submissionResult?.explanation ?? currentProblem.explanation ?? "풀이가 없습니다.";

  return (
    <div className="bottom-panel">
      {/* 실행 결과 */}
      {activeTab === "result" && (
        <div>
          <SubmissionResult submissionResult={submissionResult} />
        </div>
      )}

      {/* 힌트 */}
      {activeTab === "hint" && (
        <div>
          <HintList hints={currentHints} />
        </div>
      )}

      {/* 풀이 */}
      {activeTab === "solution" && <div>{solutionText}</div>}
    </div>
  );
}

export default ProblemBottomPanel;
