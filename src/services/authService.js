const BASE_URL = "http://localhost:8080";
const HEADERS = { "Content-Type": "application/json" };

/* 로그인 */
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("로그인 실패");
  return response.json().catch(() => null);
};

/* 회원가입 */
export const signup = async (signupData) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/signup`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({
      email: signupData.email,
      password: signupData.password,
      name: signupData.name,
      nickname: signupData.nickname,
      phone: signupData.phone,
    }),
  });

  if (!response.ok) throw new Error("회원가입에 실패했습니다.");
  return response.json().catch(() => null);
};

/* 이메일 중복 체크 */
export const checkEmail = async (email) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/email/check`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ email }),
  });

  if (!response.ok) throw new Error("이미 사용 중인 이메일입니다.");
  return response.json().catch(() => null);
};

/* 닉네임 중복 체크 */
export const checkNickname = async (nickname) => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/nickname/check`, {
    method: "POST",
    headers: HEADERS,
    body: JSON.stringify({ nickname }),
  });

  if (!response.ok) throw new Error("이미 사용 중인 닉네임입니다.");
  return response.json().catch(() => null);
};

/* 이메일 인증 - 코드 전송 */
export const sendVerificationCode = async (email) => {
  return {
    status: "OK",
    success: true,
    statusCode: 200,
    message: "인증번호가 발송되었습니다.",
    data: true,
  };
  // const response = await fetch(`${BASE_URL}/api/v1/auth/email/send`, {
  //   method: "POST",
  //   headers: HEADERS,
  //   body: JSON.stringify({ email }),
  // });

  // if (!response.ok) throw new Error("인증번호 발송 실패");
  // return response.json().catch(() => null);
};

/* 이메일 인증 - 코드 확인 */
export const verifyCode = async (email, code) => {
  return {
    status: "OK",
    success: true,
    statusCode: 200,
    message: "인증번호 확인 성공",
    data: true,
  };
  // const response = await fetch(`${BASE_URL}/api/v1/auth/email/verify`, {
  //   method: "POST",
  //   headers: HEADERS,
  //   body: JSON.stringify({ email, code }),
  // });

  // if (!response.ok) throw new Error("인증번호가 일치하지 않습니다.");
  // return response.json().catch(() => null);
};

/* 이메일 찾기 (아이디 찾기) */
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

  // const response = await fetch(`${BASE_URL}/api/v1/users/find-email`, {
  //   method: "POST",
  //   headers: HEADERS,
  //   body: JSON.stringify({
  //     name: name,
  //     phoneNumber: phone,
  //   }),
  // });

  // const data = await response.json().catch(() => null);
  // if (!response.ok)
  //   throw new Error(data?.message || "일치하는 회원 정보가 없습니다.");
  // return data;
};

/* 비밀번호 재설정 */
export const resetPassword = async (email, newPassword) => {
  return {
    status: "OK",
    success: true,
    statusCode: 200,
    message: "비밀번호 변경 성공",
    data: true,
  };

  // const response = await fetch(`${BASE_URL}/api/v1/auth/password/reset`, {
  //   method: "PUT",
  //   headers: HEADERS,
  //   body: JSON.stringify({ email, newPassword }),
  // });

  // if (!response.ok) throw new Error("비밀번호 변경 실패");
  // return response.json().catch(() => null);
};

/* 로그아웃 */
export const logoutService = async () => {
  const response = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
  });

  if (!response.ok) throw new Error("로그아웃 실패");
  return response.json().catch(() => null);
};
