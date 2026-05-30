import { useEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const updateArrayItem = (items, index, value) =>
  items.map((item, itemIndex) => (itemIndex === index ? value : item));

const normalizeProblemSet = (payload) => {
  const data = payload?.data ?? payload;
  const problems = Array.isArray(data?.problems)
    ? data.problems
    : data?.problem
      ? [data.problem]
      : [];

  return {
    ...data,
    id: data?.problemSetId ?? data?.id,
    problems,
  };
};

function useProblemDetail() {
  const { id: problemSetId } = useParams();
  const { search } = useLocation();

  const userId = useMemo(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get("userId") ?? localStorage.getItem("userId") ?? "";
  }, [search]);

  const [problemSet, setProblemSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");

  const [userCodes, setUserCodes] = useState([]);
  const [showHintToast, setShowHintToast] = useState(false);

  // unsolved | wrong | solved
  const [problemStates, setProblemStates] = useState([]);
  const [hintEnabled, setHintEnabled] = useState([]);
  const [solutionEnabled, setSolutionEnabled] = useState([]);
  const [activeTab, setActiveTab] = useState("result");
  const [hints, setHints] = useState([]);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [emptySubmitModalOpen, setEmptySubmitModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  useEffect(() => {
    const fetchProblemSet = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/problem-sets/${problemSetId}?userId=${encodeURIComponent(userId)}`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error(`Problem set request failed: ${response.status}`);
        }

        const result = await response.json();
        const data = normalizeProblemSet(result);
        const initialIndex = Math.max(
          data.problems.findIndex(
            (problem) => problem.problemNumber === data.currentProblemNumber,
          ),
          0,
        );

        setProblemSet(data);
        setCurrentIndex(initialIndex);
        setProblemStates(data.problems.map(() => "unsolved"));
        setHintEnabled(data.problems.map(() => false));
        setSolutionEnabled(data.problems.map(() => false));
        setHints(data.problems.map(() => []));
        setSubmissionResult(null);
        setUserCodes(data.problems.map((problem) => problem.startCode ?? ""));
        setCode(data.problems[initialIndex]?.startCode ?? "");
      } catch (error) {
        console.error("Problem set detail request failed:", error);
      }
    };

    if (problemSetId) {
      fetchProblemSet();
    }
  }, [problemSetId, userId]);

  const currentProblem = problemSet?.problems[currentIndex];
  const currentHints = hints[currentIndex] ?? [];

  const canMoveProblem = (index) => {
    if (index === 0) return true;
    return problemStates[index - 1] === "solved";
  };

  const moveProblem = (index) => {
    if (!canMoveProblem(index)) return;

    const updatedCodes = [...userCodes];
    updatedCodes[currentIndex] = code;

    setUserCodes(updatedCodes);
    setCurrentIndex(index);
    setCode(updatedCodes[index] ?? "");
    setActiveTab("result");
    setSubmissionResult(null);
  };

  const fetchHints = async (problemId, index) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/problems/${problemId}/hints`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Hint request failed: ${response.status}`);
      }

      const result = await response.json();
      const hintList = Array.isArray(result?.data) ? result.data : [];

      setHints((prevHints) => updateArrayItem(prevHints, index, hintList));

      return hintList;
    } catch (error) {
      console.error("Hint request failed:", error);
      return [];
    }
  };

  const handleSubmit = async () => {
    if (!currentProblem?.problemId || isSubmitting) return;

    if (!code.trim()) {
      setEmptySubmitModalOpen(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/problems/${currentProblem.problemId}/submissions`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            userId,
            code,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Submission request failed: ${response.status}`);
      }

      const result = await response.json();
      const submission = result?.data ?? result;

      setSubmissionResult(submission);

      if (submission?.isCorrect) {
        setProblemStates((prevStates) =>
          updateArrayItem(prevStates, currentIndex, "solved"),
        );
        setHintEnabled((prevHint) =>
          updateArrayItem(prevHint, currentIndex, true),
        );
        setSolutionEnabled((prevSolution) =>
          updateArrayItem(prevSolution, currentIndex, true),
        );

        if (!hints[currentIndex]?.length) {
          await fetchHints(currentProblem.problemId, currentIndex);
        }

        setSuccessModalOpen(true);
      } else {
        setProblemStates((prevStates) =>
          updateArrayItem(prevStates, currentIndex, "wrong"),
        );
        setHintEnabled((prevHint) =>
          updateArrayItem(prevHint, currentIndex, true),
        );

        if (!hints[currentIndex]?.length) {
          await fetchHints(currentProblem.problemId, currentIndex);
        }

        setShowHintToast(true);

        setTimeout(() => {
          setShowHintToast(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Submission request failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProblemButtonClass = (state, isSelected) => {
    if (isSelected) return "problem-button selected";
    if (state === "solved") return "problem-button solved";
    if (state === "wrong") return "problem-button wrong";
    return "problem-button";
  };

  const handleBackButton = () => {
    setWarningModalOpen(true);
  };

  const handleConfirmBack = () => {
    setWarningModalOpen(false);
    window.history.back();
  };

  return {
    problemSet,
    currentProblem,

    currentIndex,
    setCurrentIndex,

    code,
    setCode,

    userCodes,
    setUserCodes,

    showHintToast,
    setShowHintToast,

    problemStates,
    setProblemStates,

    hintEnabled,
    setHintEnabled,

    solutionEnabled,
    setSolutionEnabled,

    activeTab,
    setActiveTab,

    currentHints,
    hints,
    setHints,

    submissionResult,
    setSubmissionResult,

    isSubmitting,

    successModalOpen,
    setSuccessModalOpen,

    emptySubmitModalOpen,
    setEmptySubmitModalOpen,

    warningModalOpen,
    setWarningModalOpen,

    canMoveProblem,
    moveProblem,

    handleSubmit,
    getProblemButtonClass,

    handleBackButton,
    handleConfirmBack,
  };
}

export default useProblemDetail;
