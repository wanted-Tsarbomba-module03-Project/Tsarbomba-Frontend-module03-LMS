const BASE_URL = import.meta.env.VITE_API_URL;

const HEADERS = { "Content-Type": "application/json" };

/* 알람 목록 조회 */
export const getOperationAlerts = async (
  targetType = "PROBLEM",
  status = "",
  page = 0,
  size = 20,
) => {
  const statusQuery = status ? `&status=${status}` : "";

  const response = await fetch(
    `${BASE_URL}/api/v1/admin/operation-alerts?targetType=${targetType}${statusQuery}&page=${page}&size=${size}`,
    {
      method: "GET",
      headers: HEADERS,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("알람 목록 조회 실패");
  }

  return response.json().catch(() => null);
};

// User Detail API

export const getUserDetail = async (id) => {
  const response = await fetch(`${BASE_URL}/api/v1/admin/users/${id}`, {
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("회원 상세 조회 실패");
  }

  return response.json();
};

export const getUserCourseProgress = async (courseId) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/courses/${courseId}/learning-progress`,
    {
      method: "GET",
      headers: HEADERS,
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("강의 진행률 조회 실패");
  }

  return response.json();
};

export const getUserProblemList = async (userId) => {
  const response = await fetch(`${BASE_URL}/api/v1/users/${userId}/problem`, {
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("문제 목록 조회 실패");
  }

  return response.json();
};

export const toggleUserLock = async (id, locked) => {
  const response = await fetch(`${BASE_URL}/api/v1/users/${id}/lock`, {
    method: "PATCH",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({ locked }),
  });

  if (!response.ok) {
    throw new Error("회원 상태 변경 실패");
  }

  return response.json().catch(() => null);
};
