import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import OneButtonModal from "../../../components/common/OneButtonModal";
import TwoButtonModal from "../../../components/common/TwoButtonModal";
import WarningButtonModal from "../../../components/common/WarningModal";
import {
  deleteOperationAlert,
  getOperationAlertDetail,
  updateOperationAlertMemo,
  updateOperationAlertStatus,
} from "../../../services/adminService";
import "./AlramDetailPage.css";

const statusMap = {
  OPEN: "미처리",
  RESOLVED: "처리 완료",
  IGNORED: "무시됨",
};

const targetTypeMap = {
  PROBLEM: "문제",
  USER: "회원",
  COURSE: "강의",
};

const initialNoticeModal = {
  isOpen: false,
  title: "",
  content: "",
  onClose: null,
};

function AlramDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState(null);
  const [adminMemo, setAdminMemo] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noticeModal, setNoticeModal] = useState(initialNoticeModal);
  const [statusModal, setStatusModal] = useState({
    isOpen: false,
    nextStatus: null,
  });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const openNoticeModal = (title, content, onClose = null) => {
    setNoticeModal({
      isOpen: true,
      title,
      content,
      onClose,
    });
  };

  const closeNoticeModal = () => {
    const closeAction = noticeModal.onClose;
    setNoticeModal(initialNoticeModal);

    if (closeAction) {
      closeAction();
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const result = await getOperationAlertDetail(id);
        const data = result.data;

        setDetail(data);
        setAdminMemo(data.alert.adminMemo ?? "");
        setStatus(data.alert.status);
      } catch (error) {
        console.error("알림 상세 조회 실패:", error);
        openNoticeModal("조회 실패", "알림 상세 조회에 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleMemoSave = async () => {
    if (adminMemo.length > 500) {
      openNoticeModal(
        "입력 확인",
        "관리자 메모는 500자까지 입력할 수 있습니다.",
      );
      return;
    }

    try {
      setSaving(true);
      await updateOperationAlertMemo(id, adminMemo);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              alert: {
                ...prev.alert,
                adminMemo,
              },
            }
          : prev,
      );
      openNoticeModal("저장 완료", "관리자 메모가 저장되었습니다.");
    } catch (error) {
      console.error("관리자 메모 저장 실패:", error);
      openNoticeModal("저장 실패", "관리자 메모 저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusButtonClick = (newStatus) => {
    if (newStatus === status) return;

    setStatusModal({
      isOpen: true,
      nextStatus: newStatus,
    });
  };

  const handleStatusConfirm = async () => {
    const newStatus = statusModal.nextStatus;
    if (!newStatus) return;

    try {
      setSaving(true);
      await updateOperationAlertStatus(id, newStatus);
      setStatus(newStatus);
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              alert: {
                ...prev.alert,
                status: newStatus,
              },
            }
          : prev,
      );
      setStatusModal({ isOpen: false, nextStatus: null });
      openNoticeModal("변경 완료", "알림 상태가 변경되었습니다.");
    } catch (error) {
      console.error("알림 상태 변경 실패:", error);
      openNoticeModal("변경 실패", "알림 상태 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      setSaving(true);
      await deleteOperationAlert(id);
      setDeleteModalOpen(false);
      openNoticeModal("삭제 완료", "알림이 삭제되었습니다.", () =>
        navigate("/admin/alrams"),
      );
    } catch (error) {
      console.error("알림 삭제 실패:", error);
      openNoticeModal("삭제 실패", "알림 삭제에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="alram-wrapper">로딩 중...</div>;
    }

    if (!detail) {
      return (
        <div className="alram-wrapper">알림 정보를 찾을 수 없습니다.</div>
      );
    }

    const { alert, rule, target, metric, assignee } = detail;

    return (
      <div className="alram-wrapper">
        <div className="alram-topBar">
          <div className="alram-status">
            상태: {statusMap[status] ?? status}
          </div>

          <div className="alram-topActions">
            <button
              className="alram-btn alram-btn-white-blue"
              disabled={saving || status === "OPEN"}
              onClick={() => handleStatusButtonClick("OPEN")}
            >
              미처리
            </button>

            <button
              className="alram-btn alram-btn-white-blue"
              disabled={saving || status === "RESOLVED"}
              onClick={() => handleStatusButtonClick("RESOLVED")}
            >
              처리 완료
            </button>

            <button
              className="alram-btn alram-btn-white-blue"
              disabled={saving || status === "IGNORED"}
              onClick={() => handleStatusButtonClick("IGNORED")}
            >
              무시
            </button>

            <button
              className="alram-btn alram-btn-white-red"
              disabled={saving}
              onClick={() => setDeleteModalOpen(true)}
            >
              삭제하기
            </button>
          </div>
        </div>

        <div className="alram-card">
          <div className="alram-title">알림 정보</div>

          <div className="alram-grid">
            <Info label="알림 ID" value={alert.operationAlertId} />
            <Info label="규칙" value={rule.ruleName} />
            <Info label="규칙 코드" value={rule.ruleCode} />
            <Info label="설명" value={rule.description} />
            <Info
              label="대상"
              value={`${targetTypeMap[target.targetType] ?? target.targetType} #${target.targetId}`}
            />
            <Info label="대상명" value={target.title ?? target.nickname} />
            <Info label="상태" value={statusMap[status] ?? status} />
            <Info label="심각도" value={alert.severity} />
            <Info label="감지 사유" value={alert.reason} />
            <Info label="권장 조치" value={alert.recommendedAction} />
            <Info
              label="최초 감지"
              value={formatDateTime(alert.firstDetectedAt)}
            />
            <Info
              label="최근 감지"
              value={formatDateTime(alert.lastDetectedAt)}
            />
            <Info label="생성일" value={formatDateTime(alert.createdAt)} />
            <Info label="수정일" value={formatDateTime(alert.updatedAt)} />
          </div>
        </div>

        <div className="alram-card">
          <div className="alram-title">측정 정보</div>

          <div className="alram-grid">
            <Info
              label={metric.observedLabel ?? "감지값"}
              value={formatMetric(metric.observedValue, metric.unit)}
            />
            <Info
              label={metric.thresholdLabel ?? "기준값"}
              value={formatMetric(metric.thresholdValue, metric.unit)}
            />
            <Info
              label={rule.minSampleCountLabel ?? "최소 표본 수"}
              value={formatMetric(
                metric.minSampleCount,
                metric.minSampleCountUnit,
              )}
            />
            <Info
              label="스냅샷 기준값"
              value={formatMetric(
                alert.thresholdValueSnapshot,
                rule.thresholdUnit,
              )}
            />
          </div>
        </div>

        <div className="alram-card">
          <div className="alram-title">대상 상세</div>

          <div className="alram-grid">
            <Info label="문제집" value={target.problemSetTitle} />
            <Info label="강의" value={target.courseTitle} />
            <Info label="회원 닉네임" value={target.nickname} />
            <Info label="회원 이메일" value={target.email} />
            <Info label="대상 상태" value={target.status} />
          </div>
        </div>

        <div className="alram-card">
          <div className="alram-title">담당자</div>
          <div className="alram-text">
            {assignee
              ? `${assignee.name} (${assignee.email})`
              : "담당자가 지정되지 않았습니다."}
          </div>
        </div>

        <div className="alram-card">
          <div className="alram-memoHeader">
            <div className="alram-title">관리자 메모</div>

            <button
              className="alram-btn alram-btn-blue"
              disabled={saving}
              onClick={handleMemoSave}
            >
              저장
            </button>
          </div>

          <textarea
            className="alram-textarea"
            value={adminMemo}
            onChange={(e) => setAdminMemo(e.target.value)}
            maxLength={500}
            placeholder="관리자 메모를 입력하세요."
          />

          <div className="alram-count">{adminMemo.length}/500</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {renderContent()}

      <TwoButtonModal
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal({ isOpen: false, nextStatus: null })}
        onConfirm={handleStatusConfirm}
        confirmDisabled={saving}
        cancelDisabled={saving}
        modalTitle="상태를 변경하시겠습니까?"
        modalContent={`${statusMap[statusModal.nextStatus] ?? ""} 상태로 변경합니다.`}
      />

      <WarningButtonModal
        isOpen={deleteModalOpen}
        onClose={() => {
          if (!saving) setDeleteModalOpen(false);
        }}
        onConfirm={handleDeleteConfirm}
        modalTitle="알림을 삭제하시겠습니까?"
        modalContent="삭제한 알림은 되돌릴 수 없습니다."
      />

      <OneButtonModal
        isOpen={noticeModal.isOpen}
        onClose={closeNoticeModal}
        modalTitle={noticeModal.title}
        modalContent={noticeModal.content}
      />
    </>
  );
}

function Info({ label, value }) {
  return (
    <div className="alram-infoRow">
      <div className="alram-infoLabel">{label}</div>
      <div className="alram-infoValue">{value ?? "-"}</div>
    </div>
  );
}

function formatMetric(value, unit) {
  if (value === null || value === undefined) return "-";
  return `${value}${unit ?? ""}`;
}

function formatDateTime(value) {
  if (!value) return "-";

  return value.replace("T", " ").replace("Z", "");
}

export default AlramDetailPage;
