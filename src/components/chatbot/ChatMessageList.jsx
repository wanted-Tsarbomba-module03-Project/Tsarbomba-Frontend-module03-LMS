import { useEffect, useRef } from "react";

function ChatMessageList({ messages, sending }) {
  const messagesEndRef = useRef(null);

  // 새 메시지가 추가되면 하단으로 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  return (
    <div className="chat-message-container">
      {/* 채팅 메시지 목록 */}
      {messages.map((message, index) => (
        <div
          key={`${message.role}-${index}`}
          className={`chat-message-wrapper ${
            message.role === "USER" ? "user" : "assistant"
          }`}
        >
          <div
            className={`chat-message ${
              message.role === "USER" ? "user-message" : "assistant-message"
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}

      {/* AI 응답 대기 표시 */}
      {sending && (
        <div className="chat-message-wrapper assistant">
          <div className="chat-message assistant-message">AI 응답 중...</div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatMessageList;
