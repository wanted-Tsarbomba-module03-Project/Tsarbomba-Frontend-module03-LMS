const BASE_URL = import.meta.env.VITE_API_URL;

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

// 공통 JSON 요청 처리
const requestJson = async (url, options, fallbackMessage) => {
  const response = await fetch(url, {
    credentials: "include",
    headers: JSON_HEADERS,
    ...options,
  });

  if (!response.ok) {
    throw new Error(fallbackMessage);
  }

  return response.json();
};

// 채팅방 메시지 목록 조회
export const getChatMessages = async (roomId, signal) => {
  const result = await requestJson(
    `${BASE_URL}/api/v1/chat/${roomId}/messages`,
    {
      method: "GET",
      signal,
    },
    "채팅 조회 실패",
  );

  return result.data ?? [];
};

// 채팅방 목록 조회
export const getChatRooms = async (signal) => {
  const result = await requestJson(
    `${BASE_URL}/api/v1/chat/list`,
    {
      method: "GET",
      signal,
    },
    "채팅방 목록 조회 실패",
  );

  return result.data ?? [];
};

// 새 채팅방 생성 및 첫 메시지 전송
export const createChatMessage = async (userMessage) => {
  const result = await requestJson(
    `${BASE_URL}/api/v1/chat/messages`,
    {
      method: "POST",
      body: JSON.stringify({
        userMessage,
        problemSetId: 2001,
        problemId: 2002,
      }),
    },
    "채팅 생성 실패",
  );

  return result.data;
};

// 기존 채팅방에 메시지 전송
export const sendChatMessage = async (roomId, userMessage) => {
  const result = await requestJson(
    `${BASE_URL}/api/v1/chat/${roomId}/messages`,
    {
      method: "POST",
      body: JSON.stringify({ userMessage }),
    },
    "메시지 전송 실패",
  );

  return result.data;
};
