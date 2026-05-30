function ProblemEditor({ code, showHintToast, onCodeChange }) {
  return (
    <div className="editor-section">
      {/* 코드 입력 영역 */}
      <h2>문제풀이영역</h2>

      {/* 힌트 활성화 알림 */}
      {showHintToast && (
        <div className="hint-toast">힌트를 확인할 수 있습니다.</div>
      )}

      <textarea value={code} onChange={(event) => onCodeChange(event.target.value)} />
    </div>
  );
}

export default ProblemEditor;
