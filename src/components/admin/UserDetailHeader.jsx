function UserDetailHeader({
  isLocked,
  isLoading,
  onLockToggle,
  onGoList,
}) {
  return (
    <div className="page-header">
      {/* 회원 상세 상단 제목 */}
      <h2 className="page-title">회원 상세조회</h2>

      {/* 계정 상태 변경 및 목록 이동 버튼 */}
      <div className="header-btn-group">
        <button
          className="gray-btn"
          onClick={onLockToggle}
          disabled={isLoading}
        >
          {isLoading ? "처리중..." : isLocked ? "정지해제" : "계정정지"}
        </button>

        <button className="gray-btn" onClick={onGoList}>
          목록으로
        </button>
      </div>
    </div>
  );
}

export default UserDetailHeader;
