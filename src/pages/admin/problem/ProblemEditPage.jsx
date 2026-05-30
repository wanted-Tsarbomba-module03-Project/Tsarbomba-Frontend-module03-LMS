import React from "react";
import "./ProblemRegistPage.css";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
    createProblemUpdateRequestBody,
    deleteProblem,
    getProblem,
    normalizeProblemDetail,
    updateProblem,
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

function ProblemEditPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id: problemSetId } = useParams();

    const { problemInfo, problems } = useSelector((state) => state.problem);

    const [file, setFile] = React.useState(null);
    const [datasetId, setDatasetId] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const isSubmittingRef = React.useRef(false);

    const [openConfirmModal, setOpenConfirmModal] = React.useState(false);
    const [openSuccessModal, setOpenSuccessModal] = React.useState(false);
    const [openCancelModal, setOpenCancelModal] = React.useState(false);
    const [openDeleteModal, setOpenDeleteModal] = React.useState(false);
    const [openDeleteSuccessModal, setOpenDeleteSuccessModal] =
        React.useState(false);
    const [openValidationModal, setOpenValidationModal] = React.useState(false);
    const [validationMessage, setValidationMessage] = React.useState("");

    React.useEffect(() => {
        let isMounted = true;

        const fetchProblem = async () => {
            try {
                const result = await getProblem(problemSetId);
                const normalized = normalizeProblemDetail(result.data);

                if (!isMounted) return;

                dispatch(setProblemInfo(normalized.problemInfo));
                dispatch(setProblems(normalized.problems));
                setFile(normalized.file);
                setDatasetId(normalized.datasetId ?? null);
            } catch (err) {
                console.error(err);

                if (!isMounted) return;

                setValidationMessage(err.message || "문제 조회에 실패했습니다.");
                setOpenValidationModal(true);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        fetchProblem();

        return () => {
            isMounted = false;
            dispatch(resetProblemState());
        };
    }, [dispatch, problemSetId]);

    const handleProblemInfoChange = (e) => {
        const { name, value } = e.target;
        dispatch(setProblemInfo({ [name]: value }));
    };

    const handleFileChange = (file) => {
        setFile(file);
    };

    const handleRemoveFileInput = () => {
        setFile(null);
    };

    const handleProblemChange = (index, e) => {
        const { name, value } = e.target;

        const updatedProblems = problems.map((p, i) => (i === index ? { ...p } : p));

        if (name === "point") {
            const parsedValue = parseInt(value, 10);

            updatedProblems[index][name] =
                isNaN(parsedValue) || parsedValue < 1 ? 1 : parsedValue;
        } else {
            updatedProblems[index][name] = value;
        }

        dispatch(setProblems(updatedProblems));
    };

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

            if (!p.questionTitle.trim()) {
                return `소문제 ${i + 1}의 문제 제목을 입력해주세요.`;
            }

            if (!p.context.trim()) {
                return `소문제 ${i + 1}의 문제 내용을 입력해주세요.`;
            }

            if (!p.answer.trim()) {
                return `소문제 ${i + 1}의 문제 정답을 입력해주세요.`;
            }

            if (!p.hint.trim()) {
                return `소문제 ${i + 1}의 문제 힌트를 입력해주세요.`;
            }

            if (!p.solution.trim()) {
                return `소문제 ${i + 1}의 문제 풀이를 입력해주세요.`;
            }
        }

        return null;
    };

    const handleSubmit = async () => {
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            const requestBody = createProblemUpdateRequestBody(
                problemInfo,
                problems,
                file,
                datasetId,
            );

            await updateProblem(problemSetId, requestBody, file);

            setOpenConfirmModal(false);
            setOpenSuccessModal(true);
        } catch (err) {
            console.error(err);

            setOpenConfirmModal(false);
            setValidationMessage(err.message || "문제 수정에 실패했습니다.");
            setOpenValidationModal(true);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);

        try {
            await deleteProblem(problemSetId);

            setOpenDeleteModal(false);
            setOpenDeleteSuccessModal(true);
        } catch (err) {
            console.error(err);

            setOpenDeleteModal(false);
            setValidationMessage(err.message || "문제 삭제에 실패했습니다.");
            setOpenValidationModal(true);
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const handleGoList = () => {
        dispatch(resetProblemState());
        navigate("/admin/problems");
    };

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

    if (isLoading) {
        return (
            <div className="problem-regist-container">
                <h2 className="page-title">문제 수정</h2>
                <div className="section-box">Loading...</div>
            </div>
        );
    }

    return (
        <div className="problem-regist-container">
            <h2 className="page-title">문제 수정</h2>

            <ProblemForm
                problemInfo={ problemInfo }
                problems={ problems }
                file={ file }
                onProblemInfoChange={ handleProblemInfoChange }
                onProblemChange={ handleProblemChange }
                onFileChange={ handleFileChange }
                onRemoveFile={ handleRemoveFileInput }
                onAddProblem={ () => dispatch(addProblem()) }
                onRemoveProblem={ (index) => dispatch(removeProblem(index)) }
            />

            <div className="bottom-btn-group">
                <button
                    className="cancel-btn"
                    onClick={ () => setOpenDeleteModal(true) }
                    disabled={ isSubmitting }
                >
                    삭제
                </button>

                <button
                    className="submit-btn"
                    onClick={ handleOpenSubmitModal }
                    disabled={ isSubmitting }
                >
                    수정
                </button>

                <button
                    className="cancel-btn"
                    onClick={ () => setOpenCancelModal(true) }
                    disabled={ isSubmitting }
                >
                    취소
                </button>
            </div>

            <TwoButtonModal
                isOpen={ openConfirmModal }
                onClose={ () => {
                    if (!isSubmitting) setOpenConfirmModal(false);
                } }
                onConfirm={ handleSubmit }
                confirmDisabled={ isSubmitting }
                cancelDisabled={ isSubmitting }
                modalTitle="수정하시겠습니까?"
            />

            <OneButtonModal
                isOpen={ openSuccessModal }
                onClose={ handleGoList }
                modalTitle="수정 완료"
                modalContent="문제가 수정되었습니다."
            />

            <OneButtonModal
                isOpen={ openValidationModal }
                onClose={ () => setOpenValidationModal(false) }
                modalTitle="입력 확인"
                modalContent={ validationMessage }
            />

            <WarningModal
                isOpen={ openCancelModal }
                onClose={ () => setOpenCancelModal(false) }
                onConfirm={ handleGoList }
                modalTitle="취소하시겠습니까?"
                modalContent="수정한 내용이 저장되지 않습니다."
            />

            <WarningModal
                isOpen={ openDeleteModal }
                onClose={ () => {
                    if (!isSubmitting) setOpenDeleteModal(false);
                } }
                onConfirm={ handleDelete }
                modalTitle="삭제하시겠습니까?"
                modalContent="삭제한 문제는 복구할 수 없습니다."
            />

            <OneButtonModal
                isOpen={ openDeleteSuccessModal }
                onClose={ handleGoList }
                modalTitle="삭제 완료"
                modalContent="문제가 삭제되었습니다."
            />
        </div>
    );
}

export default ProblemEditPage;