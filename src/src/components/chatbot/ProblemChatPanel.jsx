import ChatInput from "./ChatInput";
import ChatMessageList from "./ChatMessageList";
import useProblemChat from "../../hooks/useProblemChat";

function ProblemChatPanel({ isOpen, problemSetId, problemId }) {
  const {
    messages,
    inputValue,
    setInputValue,
    sending,
    sendMessage,
    handleKeyDown,
    startNewChat,
  } = useProblemChat({ problemSetId, problemId });

  return (
    <aside
      className={`problem-chat-panel ${isOpen ? "open" : ""}`}
      aria-hidden={!isOpen}
    >
      <div className="problem-chat-header">
        <span>문제 풀이 챗봇</span>
        <button
          type="button"
          className="problem-chat-new-button"
          onClick={startNewChat}
          aria-label="새 대화"
        >
          +
        </button>
      </div>

      <ChatMessageList messages={messages} sending={sending} />

      <ChatInput
        inputValue={inputValue}
        sending={sending}
        onChangeInput={setInputValue}
        onKeyDown={handleKeyDown}
        onSendMessage={sendMessage}
      />
    </aside>
  );
}

export default ProblemChatPanel;
