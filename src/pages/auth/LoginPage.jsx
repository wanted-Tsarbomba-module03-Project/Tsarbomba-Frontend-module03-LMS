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

  // const handleGoogleLogin = () => {
  //   window.location.href =
  // };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    setEmailErr("");
    setPasswordErr("");
    setLoginCommonErr("");

    let isValid = true;

    // 유효성 검사
    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
      isValid = false;
    }
    if (!password) {
      setPasswordErr("비밀번호를 입력해주세요.");
      isValid = false;
    }

    if (isValid) {
      try {
        const data = await login(email, password);
        const realNickname =
          data?.data?.nickname || data?.nickname || email.split("@")[0];
        localStorage.setItem("userNickname", realNickname);

        setModalTitle("로그인 성공");
        setModalContent("환영합니다! 로그인이 완료되었습니다.");
        setIsSuccess(true);
        setModalOpen(true);
      } catch (error) {
        setLoginCommonErr("아이디 또는 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>
        <form onSubmit={handleLoginSubmit}>
          {/* 이메일 입력 */}
          <div className="login-input-box">
            <label>이메일</label>
            <input
              type="text"
              className={emailErr || loginCommonErr ? "input-error" : ""}
              placeholder="your@email.com"
              value={email}
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

          {/* 비밀번호 입력 */}
          <div className="login-input-box">
            <label>비밀번호</label>
            <input
              type="password"
              className={passwordErr || loginCommonErr ? "input-error" : ""}
              placeholder="비밀번호를 입력해주세요"
              value={password}
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

          <div className="login-find-box">
            <span onClick={() => navigate("/find-id")}>아이디 찾기</span>
            <span className="bar">|</span>
            <span onClick={() => navigate("/reset-pw")}>비밀번호 재설정</span>
          </div>

          {/* 버튼 박스 */}
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

          {/* 구글 로그인 버튼 */}
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
            window.location.href = "/";
          }
        }}
        modalTitle={modalTitle}
        modalContent={modalContent}
      />
    </div>
  );
}

export default LoginPage;
