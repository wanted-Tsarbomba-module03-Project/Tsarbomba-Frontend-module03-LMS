function ProblemSubmitButton({ isSubmitting, onSubmit }) {
  return (
    <div className="submit-wrapper">
      {/* 답안 제출 버튼 */}
      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "제출 중" : "제출하기"}
      </button>
    </div>
  );
}

export default ProblemSubmitButton;
