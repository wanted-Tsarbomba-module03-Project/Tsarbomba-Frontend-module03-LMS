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
