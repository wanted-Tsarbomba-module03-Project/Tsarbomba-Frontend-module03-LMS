import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { login } from "../../services/authService";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(email, password);

      console.log(data);

      alert("로그인 성공");

      navigate("/");
    } catch (error) {
      console.error(error);

      alert("로그인 실패");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <label>아이디</label>
            <input
              type="text"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="find-box">
            <span onClick={() => navigate("/find-id")}>아이디 찾기</span>
            <span className="bar">|</span>
            <span onClick={() => navigate("/find-pwd")}>비밀번호 찾기</span>
          </div>

          <div className="btn-box">
            <button type="submit" className="btn-blue">
              로그인
            </button>
            <button
              type="button"
              className="btn-gray"
              onClick={() => navigate("/signup")}
            >
              회원가입
            </button>
          </div>

          <button
            type="button"
            className="btn-google"
            onClick={() => console.log("구글")}
          >
            Google로 로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
