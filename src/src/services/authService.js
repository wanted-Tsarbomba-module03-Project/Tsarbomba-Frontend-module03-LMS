const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const HEADERS = { "Content-Type": "application/json" };

/* 공통 에러 핸들링 함수 */
const handleBadResponse = async (response, defaultMessage) => {
  try {
    const textData = await response.text();
    try {
      const jsonData = JSON.parse(textData);
      return jsonData?.message || jsonData?.data?.message || defaultMessage;
    } catch {
      if (textData.includes("default message")) {
        const match = textData.match(/default message \[(.*?)\]\]/);
        if (match && match[1]) return match[1];
      }
      return textData || defaultMessage;
    }
  } catch {
    return defaultMessage;
  }
};

/* 로그인 */
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "로그인 정보가 일치하지 않습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 회원가입 */
export const signup = async (signupData) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify(signupData),
  });

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "회원가입 처리 중 오류가 발생했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 3. 이메일 중복 체크 */
export const checkEmail = async (email) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/auth/check/email?email=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: HEADERS,
    },
  );

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "이메일 중복 확인 중 오류가 발생했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 4. 닉네임 중복 체크 */
export const checkNickname = async (nickname) => {
  const response = await fetch(
    `${BASE_URL}/api/v1/auth/check/nickname?nickname=${encodeURIComponent(nickname)}`,
    {
      method: "GET",
      headers: HEADERS,
    },
  );

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "닉네임 중복 확인 중 오류가 발생했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 5. 이메일 인증번호 전송 */
export const sendVerificationCode = async (email) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/email/send`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "인증번호 발송에 실패했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 6. 이메일 인증 - 코드 확인 */
export const verifyCode = async (email, code) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/email/verify`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ email, code }),
  });

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "인증번호 확인에 실패했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json();
};

/* 7. 임시 - 이메일 찾기 (아이디 찾기) */
export const findId = async (name, phone) => {
  return {
    status: "OK",
    success: true,
    statusCode: 200,
    message: "이메일 찾기 성공",
    data: "test@example.com",
    email: "test@example.com",
    userEmail: "test@example.com",
  };
};

/* 8. 임시 - 비밀번호 재설정 (비번 변경) */
export const resetPassword = async (email, newPassword) => {
  return {
    status: "OK",
    success: true,
    statusCode: 200,
    message: "비밀번호 변경 성공",
    data: true,
  };
};

/* 9. 로그아웃 */
export const logoutService = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
  });

  if (!response.ok) {
    const errMsg = await handleBadResponse(
      response,
      "로그아웃 처리 중 오류가 발생했습니다.",
    );
    throw new Error(errMsg);
  }

  return response.json().catch(() => null);
};
