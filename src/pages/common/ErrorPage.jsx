import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ErrorPage.css";

function ErrorPage() {

  const navigate = useNavigate();
  const [params] = useSearchParams();

  const code = params.get("code");

  // 백엔드 값
  const status = params.get("status");
  const message = params.get("message");

  const getMessage = (code) => {

    switch (code) {

      case "401":
        return {
          title: "로그인이 필요합니다",
          desc: "인증 정보가 만료되었거나 접근 권한이 없습니다.",
        };

      case "403":
        return {
          title: "접근 권한이 없습니다",
          desc: "해당 페이지에 접근할 수 없습니다.",
        };

      case "404":
        return {
          title: "페이지를 찾을 수 없습니다",
          desc: "주소가 잘못되었거나 삭제된 페이지입니다.",
        };

      case "500":
        return {
          title: "서버 오류가 발생했습니다",
          desc: "잠시 후 다시 시도해주세요.",
        };

      default:
        return {
          title: "알 수 없는 오류",
          desc: "문제가 발생했습니다.",
        };
    }
  };

  const fallback = getMessage(code);

  // 백엔드 값 우선
  const errorCode = status || code;
  const desc = message
    ? decodeURIComponent(message)
    : fallback.desc;

  // 백엔드 값 있으면 title 숨김
  const showTitle = !status;

  return (
    <div className="error-container">

      <div className="error-box">

        <div className="error-code">
          { errorCode }
        </div>

        { showTitle && (
          <h1 className="error-title">
            { fallback.title }
          </h1>
        ) }

        <p className="error-desc">
          { desc }
        </p>

        <div className="error-buttons">

          <button
            className="home-btn"
            onClick={ () => navigate("/") }
          >
            홈으로
          </button>

          <button
            className="back-btn"
            onClick={ () => navigate(-1) }
          >
            이전 페이지
          </button>

        </div>
      </div>
    </div>
  );
}

export default ErrorPage;