import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signup,
  checkEmail,
  checkNickname,
  sendVerificationCode,
  verifyCode,
} from "../../services/authService";
import OneButtonModal from "../../components/common/OneButtonModal";
import "./SignupPage.css";

function SignupPage() {
  const navigate = useNavigate();

  // 회원가입 폼 데이터
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [phone, setPhone] = useState("");

  // 검증 및 화면 제어 상태
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);

  // 알림 모달
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 에러 메시지
  const [emailErr, setEmailErr] = useState("");
  const [codeErr, setCodeErr] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [confirmErr, setConfirmErr] = useState("");
  const [nameErr, setNameErr] = useState("");
  const [nicknameErr, setNicknameErr] = useState("");
  const [phoneErr, setPhoneErr] = useState("");

  // 이메일 양식 체크
  const checkEmailFormat = (emailValue) => {
    if (!emailValue) {
      setEmailErr("이메일을 입력해주세요.");
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(emailValue)) {
      setEmailErr("이메일 형식이 올바르지 않습니다. (예: user@email.com)");
      return false;
    }
    setEmailErr("");
    return true;
  };

  // 비밀번호 양식 체크
  const validatePasswordOnBlur = (value) => {
    if (!value) {
      setPwErr("비밀번호는 필수입니다.");
      return;
    }
    const pwRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]:;"'<>,.?/~`\\|-]).{8,}$/;
    if (!pwRegex.test(value)) {
      setPwErr(
        "비밀번호는 8자 이상, 영문/숫자/특수문자를 모두 포함해야 합니다.",
      );
    } else {
      setPwErr("");
    }
  };

  // 비밀번호 확인 실시간 체크
  const validateConfirmOnBlur = (value) => {
    if (!value) {
      setConfirmErr("비밀번호 확인은 필수입니다.");
      return;
    }
    if (pw !== value) {
      setConfirmErr("비밀번호가 일치하지 않습니다.");
    } else {
      setConfirmErr("");
    }
  };

  // 전화번호 양식 체크
  const validatePhoneOnBlur = (value) => {
    if (!value) {
      setPhoneErr("전화번호는 필수입니다.");
      return;
    }
    const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(value)) {
      setPhoneErr("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
    } else {
      setPhoneErr("");
    }
  };

  // 1. 이메일 중복 체크
  const handleEmailCheck = async () => {
    const isFormatValid = checkEmailFormat(email);
    if (!isFormatValid) return;

    try {
      const res = await checkEmail(email);
      const isAvailable =
        res === true || res?.data === true || res?.data?.available === true;

      if (isAvailable) {
        setModalTitle("중복 확인 완료");
        setModalContent("사용 가능한 이메일입니다.");
        setIsSuccess(false);
        setModalOpen(true);
        setIsEmailChecked(true);
        setEmailErr("");
      } else {
        setEmailErr("이미 사용 중인 이메일입니다.");
        setIsEmailChecked(false);
      }
    } catch (err) {
      setEmailErr("이미 사용 중인 이메일입니다.");
      setIsEmailChecked(false);
    }
  };

  // 2. 닉네임 중복 체크
  const handleNicknameCheck = async () => {
    if (!nickname) {
      setNicknameErr("닉네임을 입력해주세요.");
      return;
    }
    try {
      const res = await checkNickname(nickname);
      const isAvailable =
        res === true || res?.data === true || res?.data?.available === true;

      if (isAvailable) {
        setModalTitle("중복 확인 완료");
        setModalContent("사용 가능한 닉네임입니다.");
        setIsSuccess(false);
        setModalOpen(true);
        setIsNicknameChecked(true);
        setNicknameErr("");
      } else {
        setNicknameErr("이미 사용 중인 닉네임입니다.");
        setIsNicknameChecked(false);
      }
    } catch (err) {
      setNicknameErr("이미 사용 중인 닉네임입니다.");
      setIsNicknameChecked(false);
    }
  };

  // 3. 이메일 인증번호 전송
  const handleSendEmail = async () => {
    if (!email) {
      setEmailErr("이메일을 입력해주세요.");
      return;
    }
    if (!isEmailChecked) {
      setEmailErr("이메일 중복확인을 먼저 완료해주세요.");
      return;
    }
    try {
      await sendVerificationCode(email);
      setIsSent(true);
      setEmailErr("");
      setModalTitle("인증번호 발송");
      setModalContent("입력하신 이메일로 인증번호가 발송되었습니다.");
      setIsSuccess(false);
      setModalOpen(true);
    } catch (err) {
      if (err.message.includes("횟수") || err.message.includes("AUT-014")) {
        setEmailErr("이메일 발송 횟수를 초과했습니다.");
      } else {
        setEmailErr(err.message || "인증번호 발송 중 오류가 발생했습니다.");
      }
    }
  };

  // 4. 인증번호 확인 검증
  const handleVerifyCode = async () => {
    if (!code) {
      setCodeErr("인증번호를 입력해주세요.");
      return;
    }
    try {
      await verifyCode(email, code);
      setIsVerified(true);
      setCodeErr("");
      setModalTitle("인증 완료");
      setModalContent("이메일 인증이 성공적으로 완료되었습니다.");
      setIsSuccess(false);
      setModalOpen(true);
    } catch (err) {
      setCodeErr(err.message || "인증번호가 일치하지 않거나 만료되었습니다.");
      setIsVerified(false);
    }
  };

  // 5. 최종 회원가입 요청 제출
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (!email || emailErr) {
      setEmailErr("이메일을 확인해주세요.");
      isValid = false;
    }
    if (!isEmailChecked) {
      setEmailErr("이메일 중복확인을 완료해주세요.");
      isValid = false;
    }
    if (!isVerified) {
      setCodeErr("이메일 인증을 완료해주세요.");
      isValid = false;
    }
    if (!pw || pwErr) {
      setPwErr("비밀번호를 확인해주세요.");
      isValid = false;
    }
    if (pw !== confirm || confirmErr) {
      setConfirmErr("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }
    if (!name) {
      setNameErr("이름을 입력해주세요.");
      isValid = false;
    }
    if (!nickname || !isNicknameChecked) {
      setNicknameErr("닉네임 중복확인을 완료해주세요.");
      isValid = false;
    }
    if (!phone || phoneErr) {
      setPhoneErr("전화번호를 확인해주세요.");
      isValid = false;
    }

    if (isValid) {
      try {
        await signup({
          email,
          password: pw,
          passwordConfirm: confirm,
          name,
          nickname,
          phone,
        });

        setModalTitle("회원가입 완료");
        setModalContent("회원가입이 성공적으로 완료되었습니다!");
        setIsSuccess(true);
        setModalOpen(true);
      } catch (error) {
        alert(error.message || "회원가입 처리 중 오류가 발생했습니다.");
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
                  setIsEmailChecked(false);
                  if (e.target.value) setEmailErr("");
                }}
              />
              <button
                type="button"
                className="signup-inner-btn-gray"
                disabled={isVerified}
                onClick={handleEmailCheck}
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
              onBlur={(e) => validatePasswordOnBlur(e.target.value)}
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
              onBlur={(e) => validateConfirmOnBlur(e.target.value)}
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
                  setIsNicknameChecked(false);
                  if (e.target.value) setNicknameErr("");
                }}
              />
              <button
                type="button"
                className="signup-inner-btn-gray"
                onClick={handleNicknameCheck}
              >
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
              onBlur={(e) => validatePhoneOnBlur(e.target.value)}
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

      <OneButtonModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          if (isSuccess) {
            navigate("/login");
          }
        }}
        modalTitle={modalTitle}
        modalContent={modalContent}
      />
    </div>
  );
}

export default SignupPage;
