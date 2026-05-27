import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import OneButtonModal from "../../components/common/OneButtonModal";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();

  // 데이터
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 에러
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loginCommonErr, setLoginCommonErr] = useState("");

  // 이메일 실시간 체크
  const validateEmailOnBlur = (e) => {
    if (
      e.relatedTarget &&
      e.relatedTarget.className.includes("login-btn-blue")
    ) {
      return;
    }
    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
    } else {
      setEmailErr("");
    }
  };

  // 비밀번호 실시간 체크
  const validatePasswordOnBlur = (e) => {
    if (
      e.relatedTarget &&
      e.relatedTarget.className.includes("login-btn-blue")
    ) {
      return;
    }
    if (!password) {
      setPasswordErr("비밀번호를 입력해주세요.");
    } else {
      setPasswordErr("");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/google`;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setEmailErr("");
    setPasswordErr("");
    setLoginCommonErr("");

    let isValid = true;

    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordErr("비밀번호를 입력해주세요.");
      isValid = false;
    }

    // 유저 닉네임
    if (isValid) {
      try {
        const responseData = await login(email, password);

        const realNickname = responseData?.data?.nickname;

        if (!realNickname) {
          throw new Error(
            "유저 정보를 정상적으로 불러올 수 없습니다. 다시 시도해주세요.",
          );
        }

        localStorage.setItem("userNickname", realNickname);

        window.dispatchEvent(new Event("loginSuccess"));

        setModalTitle("로그인 성공");
        setModalContent("환영합니다! 로그인이 완료되었습니다.");
        setIsSuccess(true);
        setModalOpen(true);
      } catch (error) {
        setLoginCommonErr(
          error.message || "아이디 또는 비밀번호가 일치하지 않습니다.",
        );
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <form onSubmit={handleLoginSubmit}>
          <div className="login-input-box">
            {/* 이메일 */}
            <label>이메일</label>
            <input
              type="text"
              className={emailErr || loginCommonErr ? "input-error" : ""}
              placeholder="your@email.com"
              value={email}
              onBlur={validateEmailOnBlur}
              onChange={(e) => {
                setEmail(e.target.value);
                if (e.target.value) {
                  setEmailErr("");
                  setLoginCommonErr("");
                }
              }}
            />
            {emailErr && <p className="error-text">{emailErr}</p>}
          </div>
          {/* 비밀번호 */}
          <div className="login-input-box">
            <label>비밀번호</label>
            <input
              type="password"
              className={passwordErr || loginCommonErr ? "input-error" : ""}
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onBlur={validatePasswordOnBlur}
              onChange={(e) => {
                setPassword(e.target.value);
                if (e.target.value) {
                  setPasswordErr("");
                  setLoginCommonErr("");
                }
              }}
            />
            {passwordErr && <p className="error-text">{passwordErr}</p>}
            {loginCommonErr && <p className="error-text">{loginCommonErr}</p>}
          </div>

          {/* 아이디 찾기, 비밀번호 재설정 */}
          <div className="login-find-box">
            <span onClick={() => navigate("/find-id")}>아이디 찾기</span>
            <span className="bar">|</span>
            <span onClick={() => navigate("/reset-pw")}>비밀번호 재설정</span>
          </div>

          {/* 로그인, 회원가입 */}
          <div className="login-btn-box">
            <button type="submit" className="login-btn-blue">
              로그인
            </button>
            <button
              type="button"
              className="login-btn-gray"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>

          {/* 구글 로그인 */}
          <button
            type="button"
            className="login-btn-google"
            onClick={handleGoogleLogin}
          >
            Google로 로그인
          </button>
        </form>
      </div>

      {/* 모달 */}
      <OneButtonModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (isSuccess) {
            navigate("/");
          }
        }}
        modalTitle={modalTitle}
        modalContent={modalContent}
      />
    </div>
  );
}

export default LoginPage;
