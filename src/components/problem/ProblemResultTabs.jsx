const getTabClassName = (isActive, isDisabled = false) =>
  `${isActive ? "active-tab" : ""} ${isDisabled ? "disabled-button" : ""}`;

// 실행 결과, 힌트, 풀이 탭
function ProblemResultTabs({
  activeTab,
  hintEnabled,
  solutionEnabled,
  onChangeTab,
}) {
  return (
    <div className="tabs">
      {/* 실행 결과 탭 */}
      <button
        className={activeTab === "result" ? "active-tab" : ""}
        onClick={() => onChangeTab("result")}
      >
        실행결과
      </button>

      {/* 힌트 탭 */}
      <button
        disabled={!hintEnabled}
        className={getTabClassName(activeTab === "hint", !hintEnabled)}
        onClick={() => onChangeTab("hint")}
      >
        힌트
      </button>

      {/* 풀이 보기 탭 */}
      <button
        disabled={!solutionEnabled}
        className={getTabClassName(activeTab === "solution", !solutionEnabled)}
        onClick={() => onChangeTab("solution")}
      >
        풀이보기
      </button>
    </div>
  );
}

export default ProblemResultTabs;
