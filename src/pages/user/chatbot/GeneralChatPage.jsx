import React, { useEffect, useRef, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";

import "./GeneralChatPage.css";

const BASE_URL = import.meta.env.VITE_API_URL;

function GeneralChatPage() {
    const { roomId } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [sending, setSending] = useState(false);
    const [chatTitle, setChatTitle] = useState("새 채팅");

    const messagesEndRef = useRef(null);

    // 자동 스크롤
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // 기존 채팅 진입
    useEffect(() => {
        if (!roomId) {
            setMessages([]);
            setInputValue("");
            setSending(false);
            return;
        }

        const controller = new AbortController();

        // navigate state 존재
        if (location.state?.userMessage && location.state?.answer) {
            setMessages([
                {
                    role: "USER",
                    content: location.state.userMessage,
                },
                {
                    role: "ASSISTANT",
                    content: location.state.answer,
                },
            ]);

            return;
        }

        // 새로고침 or 직접 접근
        fetchMessages(roomId, controller.signal);

        return () => {
            controller.abort();
        };
    }, [roomId, location.state]);

    // 채팅 내역 조회
    const fetchMessages = async (targetRoomId, signal) => {
        try {
            const accessToken = localStorage.getItem("accessToken");

            const response = await fetch(
                `${BASE_URL}/api/v1/chat/${targetRoomId}/messages`,
                {
                    method: "GET",
                    credentials: "include",
                    signal,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("채팅 조회 실패");
            }

            const result = await response.json();

            setMessages(result.data);
        } catch (error) {
            if (error.name === "AbortError") return;
            console.error(error);
        }
    };

    // 메시지 전송
    const handleSendMessage = async () => {
        if (!inputValue.trim() || sending) return;

        const userMessage = inputValue;

        // 유저 메시지 즉시 출력
        setMessages((prev) => [
            ...prev,
            {
                role: "USER",
                content: userMessage,
            },
        ]);

        setInputValue("");
        setSending(true);

        try {
            const accessToken = localStorage.getItem("accessToken");

            // 첫 메시지
            if (!roomId) {
                const response = await fetch(
                    `${BASE_URL}/api/v1/chat/messages`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userMessage,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("채팅 생성 실패");
                }

                const result = await response.json();

                // AI 응답 추가
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ASSISTANT",
                        content: result.data.answer,
                    },
                ]);

                // 사이드바 갱신
                window.dispatchEvent(new Event("chatRoomUpdated"));

                // 채팅방 이동
                navigate(`/user/chat/${result.data.roomId}`, {
                    replace: true,
                    state: {
                        userMessage,
                        answer: result.data.answer,
                    },
                });
            }

            // 기존 채팅방
            else {
                const response = await fetch(
                    `${BASE_URL}/api/v1/chat/${roomId}/messages`,
                    {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            userMessage,
                        }),
                    }
                );

                if (!response.ok) {
                    throw new Error("메시지 전송 실패");
                }

                const result = await response.json();

                // AI 응답 추가
                setMessages((prev) => [
                    ...prev,
                    {
                        role: "ASSISTANT",
                        content: result.data.answer,
                    },
                ]);

                // 사이드바 최신화
                window.dispatchEvent(new Event("chatRoomUpdated"));
            }
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "ASSISTANT",
                    content:
                        "AI 응답에 실패했습니다. 다시 시도해주세요.",
                    error: true,
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    // 엔터 전송
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="general-chat-page">
            {/* 헤더 */ }
            <div className="chat-header">
                { chatTitle }
            </div>

            {/* 채팅 영역 */ }
            <div className="chat-message-container">
                { messages.map((message, index) => (
                    <div
                        key={ index }
                        className={ `chat-message-wrapper ${message.role === "USER"
                            ? "user"
                            : "assistant"
                            }` }
                    >
                        <div
                            className={ `chat-message ${message.role === "USER"
                                ? "user-message"
                                : "assistant-message"
                                }` }
                        >
                            { message.content }
                        </div>
                    </div>
                )) }

                {/* 로딩 */ }
                { sending && (
                    <div className="chat-message-wrapper assistant">
                        <div className="chat-message assistant-message">
                            AI 응답 중...
                        </div>
                    </div>
                ) }

                <div ref={ messagesEndRef } />
            </div>

            {/* 입력창 */ }
            <div className="chat-input-wrapper">
                <textarea
                    className="chat-input"
                    placeholder="질문 입력"
                    value={ inputValue }
                    onChange={ (e) =>
                        setInputValue(e.target.value)
                    }
                    onKeyDown={ handleKeyDown }
                    disabled={ sending }
                />

                <button
                    className="chat-send-button"
                    onClick={ handleSendMessage }
                    disabled={ sending || !inputValue.trim() }
                >
                    전송
                </button>
            </div>
        </div>
    );
}

export default GeneralChatPage;
