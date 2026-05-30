import { DIFFICULTY_MAP } from "../../services/problemService";

// 목록에 표시할 날짜 형식 변환
const formatDate = (value) => {
  if (!value) return "-";

  const date = new Date(value);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}.${mm}.${dd}`;
};

// 문제 목록 테이블 컬럼 정의
export const problemListColumns = [
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
    render: (item) => DIFFICULTY_MAP[item.difficulty] || item.difficulty,
  },
  {
    key: "accuracyRate",
    label: "정답률",
    render: (item) => `${item.accuracyRate}%`,
  },
  {
    key: "createdAt",
    label: "등록일",
    render: (item) => formatDate(item.createdAt),
  },
];
