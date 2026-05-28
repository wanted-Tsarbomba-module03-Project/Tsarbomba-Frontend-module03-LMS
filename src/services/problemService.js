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
export const createProblemRequestBody = (problemInfo, problems) => {
  return {
    title: problemInfo.title,
    categoryId: Number(problemInfo.categoryId),
    difficulty: problemInfo.difficulty,
    description: problemInfo.description,

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

//JSON + FILE 업로드

export const createProblem = async (requestBody, file) => {
  const formData = new FormData();

  // 1. JSON 데이터 (data라는 이름으로 전송)
  formData.append(
    "data",
    new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    }),
  );

  // 2. CSV / 파일 데이터
  if (file) {
    formData.append("file", file);
  }

  const response = await fetch(`${BASE_URL}/api/v1/problems`, {
    method: "POST",
    ...FETCH_OPTIONS,

    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "문제 등록 실패");
  }

  return response.json().catch(() => null);
};
