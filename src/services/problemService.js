const BASE_URL = import.meta.env.VITE_API_URL;

const FETCH_OPTIONS = {
  credentials: "include",
};

/* 난이도 */
export const DIFFICULTY_MAP = {
  EASY: "쉬움",
  MEDIUM: "보통",
  HARD: "어려움",
};

/* 문제 카테고리 */
export const PROBLEM_CATEGORY = {
  2001: "비즈니스 기초",
  2002: "데이터 분석",
  2003: "백엔드 설계",
  2004: "Python 데이터 분석",
};

/* 문제 기본 정보 초기값 */
export const INITIAL_PROBLEM_INFO = {
  title: "",
  categoryId: "2001",
  difficulty: "EASY",
  description: "",
};

/* 소문제 초기값 */
export const INITIAL_SUB_PROBLEM = {
  questionTitle: "",
  context: "",
  point: 1,
  answer: "",
  hint: "",
  solution: "",
};

/* request body 생성 */
export const createProblemRequestBody = (problemInfo, problems, file) => {
  return {
    title: problemInfo.title,
    categoryName: PROBLEM_CATEGORY[problemInfo.categoryId],
    difficulty: problemInfo.difficulty,
    description: problemInfo.description,
    dataFileName: file?.name ?? "",

    problems: problems.map((p) => ({
      title: p.questionTitle,
      content: p.context,
      point: Number(p.point),
      startCode: null,
      answer: p.answer,
      hint: p.hint,
      explanation: p.solution,
    })),
  };
};

/**
 * 문제 등록 (multipart/form-data)
 * - request: JSON Blob
 * - datasetFile: File (필수)
 */
export const createProblem = async (requestBody, file) => {
  if (!file) {
    throw new Error("datasetFile이 존재하지 않습니다.");
  }

  const formData = new FormData();

  // 1. JSON part (Spring @RequestPart("request"))
  formData.append(
    "request",
    new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    }),
  );

  // 2. FILE part (Spring @RequestPart("datasetFile"))
  formData.append("datasetFile", file);

  const response = await fetch(`${BASE_URL}/api/v1/problems/with-dataset`, {
    method: "POST",

    // Spring Security + Cookie 인증 유지
    credentials: "include",

    body: formData,
  });

  // 에러 처리
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "문제 등록 실패");
  }

  return response.json().catch(() => null);
};
