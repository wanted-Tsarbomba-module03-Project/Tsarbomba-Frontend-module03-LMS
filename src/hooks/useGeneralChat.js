import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  createChatMessage,
  getChatMessages,
  getChatRooms,
  sendChatMessage,
} from "../services/chatService";

export const DEFAULT_CHAT_TITLE = "새 대화";

// 화면에 표시할 메시지 객체 생성
const createMessage = (role, content, extra = {}) => ({
  role,
  content,
  ...extra,
});

function useGeneralChat() {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialMessageState = useMemo(() => {
    if (!location.state?.userMessage || !location.state?.answer) {
      return null;
    }

    return [
      createMessage("USER", location.state.userMessage),
      createMessage("ASSISTANT", location.state.answer),
    ];
  }, [location.state?.answer, location.state?.userMessage]);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);
  const [chatTitle, setChatTitle] = useState(DEFAULT_CHAT_TITLE);

  // 채팅방 진입 시 제목과 메시지 목록 조회
  useEffect(() => {
    if (!roomId) {
      setMessages([]);
      setInputValue("");
      setSending(false);
      setChatTitle(DEFAULT_CHAT_TITLE);
      return undefined;
    }

    const controller = new AbortController();

    const loadChatTitle = async () => {
      try {
        const rooms = await getChatRooms(controller.signal);
        const currentRoom = rooms.find(
          (room) => String(room.roomId) === String(roomId),
        );

        setChatTitle(currentRoom?.title || DEFAULT_CHAT_TITLE);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
        setChatTitle(DEFAULT_CHAT_TITLE);
      }
    };

    const loadMessages = async () => {
      try {
        const roomMessages = await getChatMessages(roomId, controller.signal);
        setMessages(roomMessages);
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error(error);
      }
    };

    loadChatTitle();

    if (initialMessageState) {
      setMessages(initialMessageState);
    } else {
      loadMessages();
    }

    return () => {
      controller.abort();
    };
  }, [initialMessageState, roomId]);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  // 사용자 메시지 전송 및 AI 응답 처리
  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending) return;

    const userMessage = inputValue;

    appendMessage(createMessage("USER", userMessage));
    setInputValue("");
    setSending(true);

    try {
      const response = roomId
        ? await sendChatMessage(roomId, userMessage)
        : await createChatMessage(userMessage);

      appendMessage(createMessage("ASSISTANT", response.answer));
      window.dispatchEvent(new Event("chatRoomUpdated"));

      if (!roomId) {
        navigate(`/user/chat/${response.roomId}`, {
          replace: true,
          state: {
            userMessage,
            answer: response.answer,
          },
        });
      }
    } catch (error) {
      console.error(error);
      appendMessage(
        createMessage(
          "ASSISTANT",
          "AI 응답에 실패했습니다. 다시 시도해주세요.",
          { error: true },
        ),
      );
    } finally {
      setSending(false);
    }
  }, [appendMessage, inputValue, navigate, roomId, sending]);

  // Enter 입력 시 메시지 전송
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    },
    [sendMessage],
  );

  return {
    chatTitle,
    messages,
    inputValue,
    setInputValue,
    sending,
    sendMessage,
    handleKeyDown,
  };
}

export default useGeneralChat;
