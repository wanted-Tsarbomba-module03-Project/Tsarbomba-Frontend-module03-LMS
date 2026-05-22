import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { findId } from "../../services/authService";
import "./FindIdPage.css";

function FindIdPage() {
  const navigate = useNavigate();

  // 데이터
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [resultEmail, setResultEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 이메일 보안 (앞 3자리만 보이게)
  const maskEmail = (email) => {
    if (!email || !email.includes("@")) return email;
    const [id, domain] = email.split("@");
    if (id.length <= 3) return `${id}${"*".repeat(3)}@${domain}`;
    return `${id.slice(0, 3)}${"*".repeat(id.length - 3)}@${domain}`;
  };

  // 이메일 찾기
  const handleFindIdSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name || !phone) {
      setErrorMsg("이름과 전화번호를 모두 입력해주세요.");
      return;
    }

    try {
      const data = await findId(name, phone);
      const emailRes = data?.email || data?.username;
      if (emailRes)
        setResultEmail(
          emailRes.includes("***") ? emailRes : maskEmail(emailRes),
        );
    } catch (error) {
      setErrorMsg(error.message || "존재하지 않는 회원 정보입니다.");
    }
  };

  return (
    <div className="find-id-container">
      <div className="find-id-card">
        {!resultEmail ? (
          <>
            {/* 아이디 찾기 */}
            <h1 className="find-id-title">아이디 찾기</h1>
            <form onSubmit={handleFindIdSubmit}>
              <div className="find-id-input-box">
                <label>이름*</label>
                <input
                  type="text"
                  className={errorMsg && !name ? "input-error" : ""}
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (e.target.value) setErrorMsg("");
                  }}
                />
              </div>
              <div className="find-id-input-box">
                <label>전화번호*</label>
                <input
                  type="text"
                  className={errorMsg && !phone ? "input-error" : ""}
                  placeholder="010-0000-0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (e.target.value) setErrorMsg("");
                  }}
                />
              </div>
              {errorMsg && <p className="find-id-error-text">{errorMsg}</p>}
              <button type="submit" className="find-id-btn-blue">
                확인
              </button>
            </form>
          </>
        ) : (
          <>
            {/* 아이디 찾기 결과 */}
            <h1 className="find-id-title">아이디 찾기 결과</h1>
            <div className="find-id-result-box">{resultEmail}</div>
            <button
              type="button"
              className="find-id-btn-blue"
              onClick={() => navigate("/login")}
            >
              돌아가기
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default FindIdPage;
