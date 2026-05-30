import React from "react";
import "./ProblemRegistPage.css";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  createProblem,
  createProblemRequestBody,
} from "../../../services/problemService";

import {
  addProblem,
  removeProblem,
  resetProblemState,
  setProblemInfo,
  setProblems,
} from "../../../store/problemSlice";

import OneButtonModal from "../../../components/common/OneButtonModal";
import TwoButtonModal from "../../../components/common/TwoButtonModal";
import WarningModal from "../../../components/common/WarningModal";

import ProblemForm from "../../../components/admin/ProblemForm";

function ProblemRegistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { problemInfo, problems } = useSelector(
    (state) => state.problem
  );

  const [file, setFile] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isSubmittingRef = React.useRef(false);

  // 모달
  const [openConfirmModal, setOpenConfirmModal] =
    React.useState(false);

  const [openSuccessModal, setOpenSuccessModal] =
    React.useState(false);

  const [openCancelModal, setOpenCancelModal] =
    React.useState(false);

  const [openValidationModal, setOpenValidationModal] =
    React.useState(false);

  const [validationMessage, setValidationMessage] =
    React.useState("");

  // 문제 기본정보
  const handleproblemChange = (e) => {
    const { name, value } = e.target;
    dispatch(setProblemInfo({ [name]: value }));
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  // 파일 제거
  const handleRemoveFileInput = () => {
    setFile(null);
  };

  // 소문제 변경
  const handleProblemChange = (index, e) => {
    const { name, value } = e.target;

    const updatedProblems = problems.map((p, i) =>
      i === index ? { ...p } : p
    );

    if (name === "point") {
      const parsedValue = parseInt(value, 10);

      updatedProblems[index][name] =
        isNaN(parsedValue) || parsedValue < 1
          ? 1
          : parsedValue;
    } else {
      updatedProblems[index][name] = value;
    }

    dispatch(setProblems(updatedProblems));
  };

  // 유효성 검사
  const validateForm = () => {
    if (!problemInfo.title.trim()) {
      return "문제명을 입력해주세요.";
    }

    if (!problemInfo.categoryId) {
      return "카테고리를 선택해주세요.";
    }

    if (!problemInfo.description.trim()) {
      return "문제 설명을 입력해주세요.";
    }

    if (!file) {
      return "데이터 파일을 추가해주세요.";
    }

    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];

      if (!p.questionTitle.trim())
        return `소문제 ${i + 1}의 문제 제목을 입력해주세요.`;

      if (!p.context.trim())
        return `소문제 ${i + 1}의 문제 내용을 입력해주세요.`;

      if (!p.answer.trim())
        return `소문제 ${i + 1}의 문제 정답을 입력해주세요.`;

      if (!p.hint.trim())
        return `소문제 ${i + 1}의 문제 힌트를 입력해주세요.`;

      if (!p.solution.trim())
        return `소문제 ${i + 1}의 문제 풀이를 입력해주세요.`;
    }

    return null;
  };

  // 등록
  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (!file) {
        throw new Error("데이터 파일이 없습니다");
      }

      const requestBody = createProblemRequestBody(
        problemInfo,
        problems,
        file
      );

      await createProblem(requestBody, file);

      setOpenConfirmModal(false);
      setOpenSuccessModal(true);
    } catch (err) {
      console.error(err);

      setOpenConfirmModal(false);

      setValidationMessage(
        err.message || "문제 등록에 실패했습니다."
      );

      setOpenValidationModal(true);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  // 목록 이동
  const handleGoList = () => {
    dispatch(resetProblemState());
    navigate("/admin/problems");
  };

  // 등록 모달
  const handleOpenSubmitModal = () => {
    if (isSubmitting) return;

    const errorMessage = validateForm();

    if (errorMessage) {
      setValidationMessage(errorMessage);
      setOpenValidationModal(true);
      return;
    }

    setOpenConfirmModal(true);
  };

  // 취소 모달
  const handleOpenCancelModal = () => {
    setOpenCancelModal(true);
  };

  return (
    <div className="problem-regist-container">
      <h2 className="page-title">문제 등록</h2>

      <ProblemForm
        problemInfo={ problemInfo }
        problems={ problems }
        file={ file }
        onProblemInfoChange={ handleproblemChange }
        onProblemChange={ handleProblemChange }
        onFileChange={ handleFileChange }
        onRemoveFile={ handleRemoveFileInput }
        onAddProblem={ () => dispatch(addProblem()) }
        onRemoveProblem={ (index) =>
          dispatch(removeProblem(index))
        }
      />

      {/* 하단 버튼 */ }
      <div className="bottom-btn-group">
        <button
          className="submit-btn"
          onClick={ handleOpenSubmitModal }
          disabled={ isSubmitting }
        >
          등록
        </button>

        <button
          className="cancel-btn"
          onClick={ handleOpenCancelModal }
          disabled={ isSubmitting }
        >
          취소
        </button>
      </div>

      {/* 등록 확인 */ }
      <TwoButtonModal
        isOpen={ openConfirmModal }
        onClose={ () => {
          if (!isSubmitting) setOpenConfirmModal(false);
        } }
        onConfirm={ handleSubmit }
        confirmDisabled={ isSubmitting }
        cancelDisabled={ isSubmitting }
        modalTitle="등록하시겠습니까?"
      />

      {/* 등록 완료 */ }
      <OneButtonModal
        isOpen={ openSuccessModal }
        onClose={ handleGoList }
        modalTitle="등록 완료"
        modalContent="문제가 등록되었습니다."
      />

      {/* 유효성 검사 */ }
      <OneButtonModal
        isOpen={ openValidationModal }
        onClose={ () => setOpenValidationModal(false) }
        modalTitle="입력 확인"
        modalContent={ validationMessage }
      />

      {/* 취소 */ }
      <WarningModal
        isOpen={ openCancelModal }
        onClose={ () => setOpenCancelModal(false) }
        onConfirm={ handleGoList }
        modalTitle="취소하시겠습니까?"
        modalContent="작성한 내용이 저장되지 않습니다."
      />
    </div>
  );
}

export default ProblemRegistPage;
