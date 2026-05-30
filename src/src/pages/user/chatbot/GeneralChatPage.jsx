import ChatInput from "../../../components/chatbot/ChatInput";
import ChatMessageList from "../../../components/chatbot/ChatMessageList";
import useGeneralChat from "../../../hooks/useGeneralChat";
import "./GeneralChatPage.css";

function GeneralChatPage() {
  const {
    chatTitle,
    messages,
    inputValue,
    setInputValue,
    sending,
    sendMessage,
    handleKeyDown,
  } = useGeneralChat();

  return (
    <div className="general-chat-page">
      {/* 채팅방 제목 */}
      <div className="chat-header">{chatTitle}</div>

      {/* 채팅 메시지 영역 */}
      <ChatMessageList messages={messages} sending={sending} />

      {/* 채팅 입력 영역 */}
      <ChatInput
        inputValue={inputValue}
        sending={sending}
        onChangeInput={setInputValue}
        onKeyDown={handleKeyDown}
        onSendMessage={sendMessage}
      />
    </div>
  );
}

export default GeneralChatPage;
