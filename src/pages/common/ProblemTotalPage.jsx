import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "../../components/common/List";

function ProblemTotalPage() {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_API_URL;

  // 문제 목록
  const [problem, setProblem] = useState([]);

  // 기본 카테고리 ID
  const categoryId = 2001;

  // 난이도 한글 변환
  const difficultyMap = {
    EASY: "쉬움",
    MEDIUM: "보통",
    HARD: "어려움",
  };

  // 리스트 컬럼
  const columns = [
    {
      key: "problemNumber",
      label: "No.",
    },
    {
      key: "title",
      label: "문제명",
    },
    {
      key: "description",
      label: "문제 설명",
    },
    {
      key: "difficulty",
      label: "난이도",
      render: (item) =>
        difficultyMap[item.difficulty] || item.difficulty,
    },
    {
      key: "accuracyRate",
      label: "정답률",
      render: (item) => `${item.accuracyRate}%`,
    },
    {
      key: "createdAt",
      label: "등록일",
      render: (item) => {
        if (!item.createdAt) return "-";

        const date = new Date(item.createdAt);

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");

        return `${yyyy}.${mm}.${dd}`;
      },
    },
  ];

  // 문제 목록 조회
  useEffect(() => {
    fetch(
      `${BASE_URL}/api/v1/problem-sets`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`서버 오류: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("API 응답:", result);
        setProblem(result.data || []);
      })
      .catch((err) => {
        console.error("문제 목록 조회 실패:", err);
      });
  }, []);

  // 클릭 → 상세 이동
  const handleRowClick = (item) => {
    const id = item.problemSetId;

    if (!id) {
      console.error("problemSetId 없음:", item);
      return;
    }

    navigate(`/admin/problem/${id}`);
  };

  return (
    <div>
      <h2>문제 관리</h2>

      <div style={ { marginBottom: "20px" } }>
        <button onClick={ () => navigate("/admin/problem/new") }>
          등록하기
        </button>
      </div>

      <List
        data={ problem }
        columns={ columns }
        onRowClick={ handleRowClick }
      />
    </div>
  );
}

export default ProblemTotalPage;