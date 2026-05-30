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

function ExecutionResult({ executionResult }) {
  if (!executionResult) return null;

  const output =
    executionResult.output ??
    executionResult.stdout ??
    executionResult.result ??
    executionResult.message;
  const error = executionResult.errorMessage ?? executionResult.stderr;

  return (
    <>
      {executionResult.executionStatus && (
        <p>실행 상태: {executionResult.executionStatus}</p>
      )}
      {output && <pre className="execution-output">{output}</pre>}
      {error && <pre className="execution-error">{error}</pre>}
      {!executionResult.executionStatus && !output && !error && (
        <pre className="execution-output">
          {JSON.stringify(executionResult, null, 2)}
        </pre>
      )}
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
  executionResult,
  submissionResult,
}) {
  const solutionText =
    submissionResult?.explanation ?? currentProblem.explanation ?? "풀이가 없습니다.";

  return (
    <div className="bottom-panel">
      {/* 실행 결과 */}
      {activeTab === "result" && (
        <div>
          {submissionResult ? (
            <SubmissionResult submissionResult={submissionResult} />
          ) : executionResult ? (
            <ExecutionResult executionResult={executionResult} />
          ) : (
            "결과 영역"
          )}
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
