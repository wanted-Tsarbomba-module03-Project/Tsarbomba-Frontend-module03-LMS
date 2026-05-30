import { useCallback, useEffect, useState } from "react";
import { createChatMessage, sendChatMessage } from "../services/chatService";

const createMessage = (role, content, extra = {}) => ({
  role,
  content,
  ...extra,
});

function useProblemChat({ problemSetId, problemId }) {
  const [roomId, setRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [sending, setSending] = useState(false);

  const appendMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const startNewChat = useCallback(() => {
    setRoomId(null);
    setMessages([]);
    setInputValue("");
    setSending(false);
  }, []);

  useEffect(() => {
    startNewChat();
  }, [problemId, problemSetId, startNewChat]);

  const sendMessage = useCallback(async () => {
    if (!inputValue.trim() || sending) return;

    const userMessage = inputValue;

    appendMessage(createMessage("USER", userMessage));
    setInputValue("");
    setSending(true);

    try {
      const response = roomId
        ? await sendChatMessage(roomId, userMessage)
        : await createChatMessage(userMessage, { problemSetId, problemId });

      appendMessage(createMessage("ASSISTANT", response.answer));

      if (!roomId && response.roomId) {
        setRoomId(response.roomId);
      }

      window.dispatchEvent(new Event("chatRoomUpdated"));
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
  }, [
    appendMessage,
    inputValue,
    problemId,
    problemSetId,
    roomId,
    sending,
  ]);

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
    messages,
    inputValue,
    setInputValue,
    sending,
    sendMessage,
    handleKeyDown,
    startNewChat,
  };
}

export default useProblemChat;
