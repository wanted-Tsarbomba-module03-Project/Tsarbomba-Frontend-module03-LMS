export const USER_DETAIL_TABS = {
  COURSE: "COURSE",
  PROBLEM: "PROBLEM",
};

// 회원별 강의 목록 컬럼
export const courseColumns = [
  { key: "index", label: "No." },
  { key: "title", label: "강의명" },
  {
    key: "progress",
    label: "진행도",
    render: (item) => `${item.progress ?? 0}%`,
  },
  { key: "date", label: "등록일" },
];

// 회원별 문제 제출 목록 컬럼
export const problemColumns = [
  { key: "index", label: "No." },
  { key: "problemTitle", label: "문제명" },
  {
    key: "submissionStatus",
    label: "결과",
  },
  {
    key: "submittedAt",
    label: "제출일",
    render: (item) => item.submittedAt?.split("T")[0],
  },
];

// 선택된 탭에 맞는 컬럼 반환
export const getUserDetailColumns = (tab) =>
  tab === USER_DETAIL_TABS.COURSE ? courseColumns : problemColumns;
