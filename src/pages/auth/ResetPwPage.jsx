import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  sendVerificationCode,
  verifyCode,
  resetPassword,
} from "../../services/authService";
import OneButtonModal from "../../components/common/OneButtonModal";
import "./ResetPwPage.css";

function ResetPwPage() {
  const navigate = useNavigate();

  // 데이터
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  // 화면, 모달
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 에러
  const [emailErr, setEmailErr] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");

  // 이메일 인증 발송
  const handleSendEmail = async () => {
    if (!email) {
      setEmailErr("이메일을 입력하세요.");
      return;
    }
    try {
      await sendVerificationCode(email);
      alert("인증번호가 발송되었습니다.");
      setIsSent(true);
      setEmailErr("");
    } catch (error) {
      setEmailErr("인증번호 발송에 실패했습니다.");
    }
  };

  // 이메일 인증 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code) {
      setCodeErr("인증번호를 입력하세요.");
      return;
    }
    try {
      await verifyCode(email, code);
      alert("인증 완료되었습니다. 새 비밀번호를 입력해 주세요.");
      setIsVerified(true);
      setCodeErr("");
    } catch (error) {
      setCodeErr("인증번호가 일치하지 않습니다.");
    }
  };

  // 비밀번호 재설정
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setPasswordErr("");
    setConfirmErr("");

    let isValid = true;
    if (!password) {
      setPasswordErr("새 비밀번호를 입력하세요.");
      isValid = false;
    }
    if (password !== confirm) {
      setConfirmErr("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    if (isValid) {
      try {
        await resetPassword(email, password);
        setModalOpen(true);
      } catch (error) {
        setPasswordErr("비밀번호 재설정에 실패했습니다.");
      }
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h1 className="reset-title">비밀번호 재설정</h1>
        {/* 이메일 인증 */}
        {!isVerified ? (
          <form onSubmit={handleVerifyCode}>
            <div className="reset-input-box">
              <label>이메일</label>
              <div className="reset-input-with-btn">
                <input
                  type="text"
                  className={emailErr ? "input-error" : ""}
                  placeholder="이메일을 입력하세요"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (e.target.value) setEmailErr("");
                  }}
                />
                <button
                  type="button"
                  className="reset-inner-btn-blue"
                  onClick={handleSendEmail}
                >
                  인증번호 전송
                </button>
              </div>
              {emailErr && <p className="reset-error-text">{emailErr}</p>}
            </div>

            {/* 인증번호 확인 */}
            <div className="reset-input-box">
              <label>인증번호 입력</label>
              <div className="reset-input-with-btn">
                <input
                  type="text"
                  className={codeErr ? "input-error" : ""}
                  placeholder="인증번호를 입력하세요."
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    if (e.target.value) setCodeErr("");
                  }}
                />
                {isSent && (
                  <button
                    type="button"
                    className="reset-inner-btn-gray"
                    onClick={handleSendEmail}
                  >
                    재발송
                  </button>
                )}
              </div>
              {codeErr && <p className="reset-error-text">{codeErr}</p>}
            </div>
            <button type="submit" className="reset-btn-blue-full">
              확인
            </button>
          </form>
        ) : (
          /* 비밀번호 재설정 */
          <form onSubmit={handleResetSubmit}>
            <div className="reset-input-box">
              <label>새 비밀번호 입력</label>
              <input
                type="password"
                className={passwordErr ? "input-error" : ""}
                placeholder="새 비밀번호를 입력하세요"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (e.target.value) setPasswordErr("");
                }}
              />
              {passwordErr && <p className="reset-error-text">{passwordErr}</p>}
            </div>

            <div className="reset-input-box">
              <label>비밀번호 확인</label>
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
              {confirmErr && <p className="reset-error-text">{confirmErr}</p>}
            </div>
            <button type="submit" className="reset-btn-blue-full">
              확인
            </button>
          </form>
        )}
      </div>

      {/* 모달창 */}
      <OneButtonModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          navigate("/login");
        }}
        modalTitle="비밀번호 변경 완료"
        modalContent="새로운 비밀번호로 변경되었습니다. 다시 로그인해 주세요."
      />
    </div>
  );
}

export default ResetPwPage;
