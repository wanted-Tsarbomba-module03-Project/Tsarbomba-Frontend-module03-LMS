import { useLocation, useNavigate } from "react-router-dom";
import List from "../../components/common/List";
import { problemListColumns } from "../../components/problem/problemListColumns";
import useProblemSets from "../../hooks/useProblemSets";
import "./ProblemTotalPage.css";

// 현재 경로에 맞는 문제 상세 경로 생성
const getProblemDetailPath = (pathname, problemSetId) => {
  if (pathname.startsWith("/admin")) {
    return `/admin/problem/${problemSetId}`;
  }

  if (pathname.startsWith("/user")) {
    return `/user/problem/${problemSetId}`;
  }

  return null;
};

function ProblemTotalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");
  const selectedCategoryId = new URLSearchParams(location.search).get(
    "categoryId",
  );
  const problemSets = useProblemSets(selectedCategoryId);

  // 문제 행 클릭 시 상세 화면으로 이동
  const handleRowClick = (item) => {
    const id = item.problemSetId;

    if (!id) {
      console.error("problemSetId 없음:", item);
      return;
    }

    const detailPath = getProblemDetailPath(location.pathname, id);

    if (!detailPath) {
      console.error("지원하지 않는 경로:", location.pathname);
      return;
    }

    navigate(detailPath);
  };

  return (
    <div className="problem-total-page">
      <h2>{isAdminPath ? "문제 관리" : "문제풀이"}</h2>

      {/* 관리자 문제 등록 버튼 */}
      {isAdminPath && (
        <div className="problem-total-actions">
          <button
            className="problem-register-button"
            type="button"
            onClick={() => navigate("/admin/problem/new")}
          >
            등록하기
          </button>
        </div>
      )}

      {/* 문제 목록 */}
      <List
        data={problemSets}
        columns={problemListColumns}
        onRowClick={handleRowClick}
      />
    </div>
  );
}

export default ProblemTotalPage;
