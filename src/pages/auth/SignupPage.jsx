import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import OneButtonModal from "../../components/common/OneButtonModal";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  // 데이터
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  // 화면, 모달
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 에러
  const [emailErr, setEmailErr] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [nicknameErr, setNicknameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  // 임시 - 이메일 인증번호 전송
  const handleSendEmail = () => {
    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
      return;
    }
    setIsSent(true);
    setEmailErr("");
  };

  // 임시 - 인증번호 확인
  const handleVerifyCode = () => {
    if (!code) {
      setCodeErr("인증번호를 입력해주세요.");
      return;
    }
    setIsVerified(true);
    setCodeErr("");
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setEmailErr("");
    setCodeErr("");
    setPwErr("");
    setConfirmErr("");
    setNameErr("");
    setNicknameErr("");
    setPhoneErr("");

    let isValid = true;

    // 유효성 검사
    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
      isValid = false;
    }
    if (!isVerified) {
      setCodeErr("이메일 인증을 완료해주세요.");
      isValid = false;
    }
    if (!pw) {
      setPwErr("비밀번호를 입력해주세요.");
      isValid = false;
    }
    if (pw !== confirm) {
      setConfirmErr("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }
    if (!name) {
      setNameErr("이름을 입력해주세요.");
      isValid = false;
    }
    if (!nickname) {
      setNicknameErr("닉네임을 입력해주세요.");
      isValid = false;
    }
    if (!phone) {
      setPhoneErr("전화번호를 입력해주세요.");
      isValid = false;
    }

    // 백엔드 연동
    if (isValid) {
      try {
        await signup({ email, password: pw, name, nickname, phone });
        setModalOpen(true);
      } catch (error) {
        alert("회원가입 처리 중 오류가 발생했습니다. 입력값을 확인하세요.");
      }
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>
        <form onSubmit={handleSignupSubmit}>
          {/* 이메일 */}
          <div className="signup-input-box">
            <label>이메일*</label>
            <div className="signup-input-with-btn">
              <input
                type="text"
                className={emailErr ? "input-error" : ""}
                placeholder="your@email.com"
                value={email}
                disabled={isVerified}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (e.target.value) setEmailErr("");
                }}
              />
              <button
                type="button"
                className="signup-inner-btn-gray"
                disabled={isVerified}
              >
                중복확인
              </button>
            </div>
            {emailErr && <p className="error-text">{emailErr}</p>}
          </div>

          {/* 이메일 인증 */}
          <div className="signup-input-box">
            <label>이메일 확인*</label>
            <div className="signup-input-with-btn">
              <input
                type="text"
                className={codeErr ? "input-error" : ""}
                placeholder="인증번호 입력"
                value={code}
                disabled={isVerified}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (e.target.value) setCodeErr("");
                }}
              />
              {!isSent ? (
                <button
                  type="button"
                  className="signup-wide-btn"
                  onClick={handleSendEmail}
                >
                  인증번호 전송
                </button>
              ) : (
                <div className="signup-split-btns">
                  <button
                    type="button"
                    className="signup-inner-btn-gray"
                    onClick={handleSendEmail}
                    disabled={isVerified}
                  >
                    재발송
                  </button>
                  <button
                    type="button"
                    className="signup-inner-btn-blue"
                    onClick={handleVerifyCode}
                    disabled={isVerified}
                  >
                    확인
                  </button>
                </div>
              )}
            </div>
            {codeErr && <p className="error-text">{codeErr}</p>}
          </div>

          {/* 비밀번호 */}
          <div className="signup-input-box">
            <label>비밀번호*</label>
            <input
              type="password"
              className={pwErr ? "input-error" : ""}
              placeholder="비밀번호를 입력해주세요"
              value={pw}
              onChange={(e) => {
                setPw(e.target.value);
                if (e.target.value) setPwErr("");
              }}
            />
            {pwErr && <p className="error-text">{pwErr}</p>}
          </div>

          {/* 비밀번호 확인 */}
          <div className="signup-input-box">
            <label>비밀번호 확인*</label>
            <input
              type="password"
              className={confirmErr ? "input-error" : ""}
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (e.target.value) setConfirmErr("");
              }}
            />
            {confirmErr && <p className="error-text">{confirmErr}</p>}
          </div>

          {/* 이름 */}
          <div className="signup-input-box">
            <label>이름*</label>
            <input
              type="text"
              className={nameErr ? "input-error" : ""}
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (e.target.value) setNameErr("");
              }}
            />
            {nameErr && <p className="error-text">{nameErr}</p>}
          </div>

          {/* 닉네임 */}
          <div className="signup-input-box">
            <label>닉네임*</label>
            <div className="signup-input-with-btn">
              <input
                type="text"
                className={nicknameErr ? "input-error" : ""}
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  if (e.target.value) setNicknameErr("");
                }}
              />
              <button type="button" className="signup-inner-btn-gray">
                중복확인
              </button>
            </div>
            {nicknameErr && <p className="error-text">{nicknameErr}</p>}
          </div>

          {/* 전화번호 */}
          <div className="signup-input-box">
            <label>전화번호*</label>
            <input
              type="text"
              className={phoneErr ? "input-error" : ""}
              placeholder="010-0000-0000"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (e.target.value) setPhoneErr("");
              }}
            />
            {phoneErr && <p className="error-text">{phoneErr}</p>}
          </div>

          {/* 가입하기, 취소 */}
          <div className="signup-btn-box">
            <button type="submit" className="signup-btn-blue">
              가입하기
            </button>
            <button
              type="button"
              className="signup-btn-gray"
              onClick={() => navigate("/login")}
            >
              취소
            </button>
          </div>
        </form>
      </div>

      {/* 모달창 */}
      <OneButtonModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate("/login");
        }}
        modalTitle="회원가입 완료"
        modalContent="회원가입이 성공적으로 완료되었습니다!"
      />
    </div>
  );
}

export default SignupPage;
