import ProblemBottomPanel from "./ProblemBottomPanel";
import ProblemEditor from "./ProblemEditor";
import ProblemResultTabs from "./ProblemResultTabs";
import ProblemSubmitButton from "./ProblemSubmitButton";

function ProblemSolveBox({
  activeTab,
  code,
  currentHints,
  currentProblem,
  hintEnabled,
  isSubmitting,
  showHintToast,
  solutionEnabled,
  submissionResult,
  onChangeCode,
  onChangeTab,
  onSubmit,
}) {
  return (
    <div className="solve-box">
      {/* 풀이 입력 영역 */}
      <ProblemEditor
        code={code}
        showHintToast={showHintToast}
        onCodeChange={onChangeCode}
      />

      {/* 결과 탭 영역 */}
      <ProblemResultTabs
        activeTab={activeTab}
        hintEnabled={hintEnabled}
        solutionEnabled={solutionEnabled}
        onChangeTab={onChangeTab}
      />

      {/* 탭별 결과 영역 */}
      <ProblemBottomPanel
        activeTab={activeTab}
        currentHints={currentHints}
        currentProblem={currentProblem}
        submissionResult={submissionResult}
      />

      {/* 제출 영역 */}
      <ProblemSubmitButton isSubmitting={isSubmitting} onSubmit={onSubmit} />
    </div>
  );
}

export default ProblemSolveBox;
