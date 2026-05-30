import { USER_DETAIL_TABS } from "./userDetailColumns";

// 회원 상세 하단 목록 탭
function UserDetailTabs({ activeTab, onChangeTab }) {
  return (
    <div className="user-ListBtn-group">
      {/* 강의 목록 탭 */}
      <button
        className={activeTab === USER_DETAIL_TABS.COURSE ? "btn active" : "btn"}
        onClick={() => onChangeTab(USER_DETAIL_TABS.COURSE)}
      >
        강의목록
      </button>

      {/* 문제 목록 탭 */}
      <button
        className={
          activeTab === USER_DETAIL_TABS.PROBLEM ? "btn active" : "btn"
        }
        onClick={() => onChangeTab(USER_DETAIL_TABS.PROBLEM)}
      >
        문제목록
      </button>
    </div>
  );
}

export default UserDetailTabs;
