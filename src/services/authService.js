const BASE_URL = "http://localhost:8080"; 

export const login = async (email, password) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    }
  );

  console.log("서버 응답 상태 코드:", response.status);
  const data = await response.json().catch(() => null);
  console.log("서버가 보내준 데이터:", data);

  if (!response.ok) {
    throw new Error("로그인 실패");
  }

  return data;
};