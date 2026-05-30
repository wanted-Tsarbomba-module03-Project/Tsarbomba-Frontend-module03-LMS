import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserDetailHeader from "../../../components/admin/UserDetailHeader";
import UserDetailTabs from "../../../components/admin/UserDetailTabs";
import UserInfoSection from "../../../components/admin/UserInfoSection";
import {
  USER_DETAIL_TABS,
  getUserDetailColumns,
} from "../../../components/admin/userDetailColumns";
import List from "../../../components/common/List";
import OneButtonModal from "../../../components/common/OneButtonModal";
import { useUserDetail } from "../../../hooks/useUserDetail";
import { useUserLists } from "../../../hooks/useUserLists";
import { toggleUserLock } from "../../../services/adminService";
import "./UserDetailPage.css";

const COURSE_ID = 1;

// 계정 잠금 상태에 맞는 안내 문구 생성
const getLockModalContent = (isLocked) => ({
  title: isLocked ? "계정이 비활성화되었습니다." : "계정이 활성화되었습니다.",
  content: isLocked
    ? "해당 회원의 계정이 비활성화되었습니다."
    : "해당 회원의 계정이 활성화되었습니다.",
});

function UserDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [noticeModal, setNoticeModal] = useState({
    isOpen: false,
    title: "",
    content: "",
  });
  const [tab, setTab] = useState(USER_DETAIL_TABS.COURSE);
  const [isLoading, setIsLoading] = useState(false);

  const { user, setUser, loading: userLoading } = useUserDetail(id);
  const { listData } = useUserLists({
    tab,
    userId: id,
    courseId: COURSE_ID,
  });

  // 안내 모달 열기
  const openNoticeModal = (title, content) => {
    setNoticeModal({
      isOpen: true,
      title,
      content,
    });
  };

  // 회원 계정 잠금 상태 변경
  const handleLockToggle = async () => {
    if (isLoading || !user) return;

    try {
      setIsLoading(true);

      const nextLocked = !user.isLocked;

      await toggleUserLock(id, nextLocked);

      setUser((prev) => ({
        ...prev,
        isLocked: nextLocked,
      }));

      const modalContent = getLockModalContent(nextLocked);
      openNoticeModal(modalContent.title, modalContent.content);
    } catch (err) {
      console.error(err);
      openNoticeModal("오류 발생", "상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (userLoading || !user) return <div>로딩중...</div>;

  return (
    <>
      <div className="user-detail-container">
        {/* 회원 상세 헤더 */}
        <UserDetailHeader
          isLocked={user.isLocked}
          isLoading={isLoading}
          onLockToggle={handleLockToggle}
          onGoList={() => navigate("/admin/users")}
        />

        {/* 회원 기본 정보 */}
        <UserInfoSection user={user} />

        {/* 강의/문제 목록 탭 */}
        <UserDetailTabs activeTab={tab} onChangeTab={setTab} />

        {/* 선택된 탭의 목록 */}
        <div className="list-section">
          <List data={listData} columns={getUserDetailColumns(tab)} />
        </div>
      </div>

      {/* 처리 결과 안내 모달 */}
      <OneButtonModal
        isOpen={noticeModal.isOpen}
        onClose={() =>
          setNoticeModal({
            isOpen: false,
            title: "",
            content: "",
          })
        }
        modalTitle={noticeModal.title}
        modalContent={noticeModal.content}
      />
    </>
  );
}

export default UserDetailPage;
