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

const getProblemCategoryId = (categoryName) => {
  const category = Object.entries(PROBLEM_CATEGORY).find(
    ([, name]) => name === categoryName,
  );

  return category?.[0] ?? INITIAL_PROBLEM_INFO.categoryId;
};

export const normalizeProblemDetail = (data) => ({
  problemInfo: {
    title: data?.title ?? "",
    categoryId: getProblemCategoryId(data?.categoryName),
    difficulty: data?.difficulty ?? INITIAL_PROBLEM_INFO.difficulty,
    description: data?.description ?? "",
  },
  problems: (data?.problems?.length ? data.problems : [INITIAL_SUB_PROBLEM]).map(
    (problem) => ({
      problemId: problem.problemId,
      hintId: problem.hintId,
      questionTitle: problem.title ?? "",
      context: problem.content ?? "",
      point: problem.point ?? 1,
      startCode: problem.startCode ?? null,
      answer: problem.answer ?? "",
      hint: problem.hint ?? "",
      solution: problem.explanation ?? "",
    }),
  ),
  file: data?.dataFileName
    ? {
        name: data.dataFileName,
        isExisting: true,
      }
    : null,
  datasetId: data?.datasetId,
});

export const createProblemUpdateRequestBody = (
  problemInfo,
  problems,
  file,
  datasetId,
) => ({
  title: problemInfo.title,
  categoryName: PROBLEM_CATEGORY[problemInfo.categoryId],
  difficulty: problemInfo.difficulty,
  description: problemInfo.description,
  dataFileName: file?.name ?? "",
  datasetId,

  problems: problems.map((p) => ({
    problemId: p.problemId,
    title: p.questionTitle,
    content: p.context,
    point: Number(p.point),
    startCode: p.startCode ?? null,
    answer: p.answer,
    hintId: p.hintId,
    hint: p.hint,
    explanation: p.solution,
  })),
});

export const getProblem = async (problemSetId) => {
  const response = await fetch(`${BASE_URL}/api/v1/problems/${problemSetId}`, {
    method: "GET",
    ...FETCH_OPTIONS,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "문제 조회 실패");
  }

  return response.json();
};

const parseErrorMessage = async (response, fallbackMessage) => {
  const errorData = await response.json().catch(() => null);
  return errorData?.message || fallbackMessage;
};

// 문제 세트 목록 조회
export const getProblemSets = async (categoryId) => {
  const categoryQuery = categoryId
    ? `?categoryId=${encodeURIComponent(categoryId)}`
    : "";

  const response = await fetch(
    `${BASE_URL}/api/v1/problem-sets${categoryQuery}`,
    {
      method: "GET",
      ...FETCH_OPTIONS,
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`서버 오류: ${response.status}`);
  }

  const result = await response.json();
  return result.data || [];
};

const updateProblemWithFormData = async (problemSetId, requestBody, file) => {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    }),
  );

  if (file && !file.isExisting) {
    formData.append("datasetFile", file);
  }

  const response = await fetch(`${BASE_URL}/api/v1/problems/${problemSetId}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  return response;
};

export const updateProblem = async (problemSetId, requestBody, file) => {
  const hasNewFile = file && !file.isExisting;

  if (hasNewFile) {
    const response = await updateProblemWithFormData(
      problemSetId,
      requestBody,
      file,
    );

    if (!response.ok) {
      throw new Error(await parseErrorMessage(response, "문제 수정 실패"));
    }

    return response.json().catch(() => null);
  }

  const response = await fetch(`${BASE_URL}/api/v1/problems/${problemSetId}`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (response.ok) {
    return response.json().catch(() => null);
  }

  if (response.status === 415) {
    const formDataResponse = await updateProblemWithFormData(
      problemSetId,
      requestBody,
      file,
    );

    if (formDataResponse.ok) {
      return formDataResponse.json().catch(() => null);
    }

    throw new Error(
      await parseErrorMessage(formDataResponse, "문제 수정 실패"),
    );
  }

  throw new Error(await parseErrorMessage(response, "문제 수정 실패"));
};

export const deleteProblem = async (problemSetId) => {
  const response = await fetch(`${BASE_URL}/api/v1/problems/${problemSetId}`, {
    method: "DELETE",
    ...FETCH_OPTIONS,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || "문제 삭제 실패");
  }

  return response.json().catch(() => null);
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
