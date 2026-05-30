import OneButtonModal from "../common/OneButtonModal";
import WarningButtonModal from "../common/WarningModal";

function ProblemDetailModals({
  successModalOpen,
  emptySubmitModalOpen,
  warningModalOpen,
  onCloseSuccess,
  onCloseEmptySubmit,
  onCloseWarning,
  onConfirmBack,
}) {
  return (
    <>
      {/* 정답 안내 모달 */}
      <OneButtonModal
        isOpen={successModalOpen}
        onClose={onCloseSuccess}
        modalTitle="정답입니다."
        modalContent="해당 문제의 풀이를 확인할 수 있습니다."
      />

      {/* 빈 제출 안내 모달 */}
      <OneButtonModal
        isOpen={emptySubmitModalOpen}
        onClose={onCloseEmptySubmit}
        modalTitle="내용을 입력해주세요."
        modalContent="제출한 내용이 비어있습니다."
      />

      {/* 뒤로가기 확인 모달 */}
      <WarningButtonModal
        isOpen={warningModalOpen}
        onClose={onCloseWarning}
        onConfirm={onConfirmBack}
        modalTitle="정말 나가시겠습니까?"
        modalContent="작성한 내용이 모두 삭제됩니다."
      />
    </>
  );
}

export default ProblemDetailModals;
