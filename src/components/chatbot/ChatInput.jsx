function ChatInput({
  inputValue,
  sending,
  onChangeInput,
  onKeyDown,
  onSendMessage,
}) {
  return (
    <div className="chat-input-wrapper">
      {/* 메시지 입력창 */}
      <textarea
        className="chat-input"
        placeholder="질문 입력"
        value={inputValue}
        onChange={(event) => onChangeInput(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={sending}
      />

      {/* 메시지 전송 버튼 */}
      <button
        className="chat-send-button"
        onClick={onSendMessage}
        disabled={sending || !inputValue.trim()}
      >
        전송
      </button>
    </div>
  );
}

export default ChatInput;
