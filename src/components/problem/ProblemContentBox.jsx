function ProblemContentBox({ content }) {
  return (
    <div className="problem-box">
      {/* 문제 본문 */}
      <h2>문제 내용</h2>

      <div className="problem-content">{content}</div>
    </div>
  );
}

export default ProblemContentBox;
