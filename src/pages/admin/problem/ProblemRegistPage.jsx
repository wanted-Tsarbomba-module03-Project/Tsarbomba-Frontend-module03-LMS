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

  // 파일
  const [files, setFiles] = React.useState([null]);

  // 모달
  const [openConfirmModal, setOpenConfirmModal] =
    React.useState(false);

  const [openSuccessModal, setOpenSuccessModal] =
    React.useState(false);

  const [openCancelModal, setOpenCancelModal] =
    React.useState(false);

  // 유효성 검사 모달
  const [openValidationModal, setOpenValidationModal] =
    React.useState(false);

  const [validationMessage, setValidationMessage] =
    React.useState("");

  // 문제 기본정보
  const handleproblemChange = (e) => {
    const { name, value } = e.target;

    dispatch(setProblemInfo({ [name]: value }));
  };

  // 파일 변경
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];

    const updatedFiles = [...files];
    updatedFiles[index] = file;

    setFiles(updatedFiles);
  };

  // 파일 추가
  const handleAddFileInput = () => {
    setFiles((prev) => [...prev, null]);
  };

  // 파일 제거
  const handleRemoveFileInput = (index) => {
    if (files.length === 1) return;

    setFiles((prev) =>
      prev.filter((_, i) => i !== index)
    );
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
    // 문제 기본정보
    if (!problemInfo.title.trim()) {
      return "문제명을 입력해주세요.";
    }

    if (!problemInfo.categoryId) {
      return "카테고리를 선택해주세요.";
    }

    if (!problemInfo.description.trim()) {
      return "문제 설명을 입력해주세요.";
    }

    // 파일
    const validFiles = files.filter(
      (f) => f !== null
    );

    if (validFiles.length === 0) {
      return "데이터 파일을 추가해주세요.";
    }

    // 소문제
    for (let i = 0; i < problems.length; i++) {
      const p = problems[i];

      if (!p.questionTitle.trim()) {
        return `소문제 ${i + 1
          }의 문제 제목을 입력해주세요.`;
      }

      if (!p.context.trim()) {
        return `소문제 ${i + 1
          }의 문제 내용을 입력해주세요.`;
      }

      if (!p.answer.trim()) {
        return `소문제 ${i + 1
          }의 문제 정답을 입력해주세요.`;
      }

      if (!p.hint.trim()) {
        return `소문제 ${i + 1
          }의 문제 힌트를 입력해주세요.`;
      }

      if (!p.solution.trim()) {
        return `소문제 ${i + 1
          }의 문제 풀이를 입력해주세요.`;
      }
    }

    return null;
  };

  // 등록
  const handleSubmit = async () => {
    try {
      const requestBody =
        createProblemRequestBody(
          problemInfo,
          problems
        );

      const formData = new FormData();

      files.forEach((file) => {
        if (file) {
          formData.append("datasetFile", file);
        }
      });

      formData.append(
        "data",
        new Blob([JSON.stringify(requestBody)], {
          type: "application/json",
        })
      );

      await createProblem(formData);

      setOpenConfirmModal(false);
      setOpenSuccessModal(true);
    } catch (err) {
      console.error(err);

      setOpenConfirmModal(false);

      setValidationMessage(
        err.message || "문제 등록에 실패했습니다."
      );

      setOpenValidationModal(true);
    }
  };

  // 목록 이동
  const handleGoList = () => {
    dispatch(resetProblemState());

    navigate("/admin/problems");
  };

  // 등록 모달
  const handleOpenSubmitModal = () => {
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
        files={ files }
        onProblemInfoChange={
          handleproblemChange
        }
        onProblemChange={ handleProblemChange }
        onFileChange={ handleFileChange }
        onAddFile={ handleAddFileInput }
        onRemoveFile={
          handleRemoveFileInput
        }
        onAddProblem={ () =>
          dispatch(addProblem())
        }
        onRemoveProblem={ (index) =>
          dispatch(removeProblem(index))
        }
      />

      {/* 하단 버튼 */ }
      <div className="bottom-btn-group">
        <button
          className="submit-btn"
          onClick={ handleOpenSubmitModal }
        >
          등록
        </button>

        <button
          className="cancel-btn"
          onClick={ handleOpenCancelModal }
        >
          취소
        </button>
      </div>

      {/* 등록 확인 */ }
      <TwoButtonModal
        isOpen={ openConfirmModal }
        onClose={ () =>
          setOpenConfirmModal(false)
        }
        onConfirm={ handleSubmit }
        modalTitle="등록하시겠습니까?"
      />

      {/* 등록 완료 */ }
      <OneButtonModal
        isOpen={ openSuccessModal }
        onClose={ handleGoList }
        modalTitle="등록 완료"
        modalContent="문제가 등록되었습니다."
      />

      {/* 유효성 검사 / 에러 */ }
      <OneButtonModal
        isOpen={ openValidationModal }
        onClose={ () =>
          setOpenValidationModal(false)
        }
        modalTitle="입력 확인"
        modalContent={ validationMessage }
      />

      {/* 취소 */ }
      <WarningModal
        isOpen={ openCancelModal }
        onClose={ () =>
          setOpenCancelModal(false)
        }
        onConfirm={ handleGoList }
        modalTitle="취소하시겠습니까?"
        modalContent="작성한 내용이 저장되지 않습니다."
      />
    </div>
  );
}

export default ProblemRegistPage;