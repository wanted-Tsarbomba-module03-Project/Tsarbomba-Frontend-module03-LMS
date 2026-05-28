import { useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;
const PROBLEM_SET_ID = 3001;

// ✅ mock 데이터
const DUMMY_PROBLEM_SET = {
  id: 3001,
  problems: [
    {
      title: "1번 문제",
      content: "두 수를 더하는 함수를 작성하세요.",
      startCode: "function add(a, b) {\n  return a + b;\n}",
      answer: "return a + b",
      hint: "a와 b를 더하면 됩니다.",
      explanation: "두 매개변수를 더해 반환합니다.",
    },
    {
      title: "2번 문제",
      content: "문자열을 대문자로 변환하세요.",
      startCode: "function toUpper(str) {\n\n}",
      answer: "toUpperCase",
      hint: "JavaScript 내장 메서드를 사용하세요.",
      explanation: "toUpperCase()를 사용하면 됩니다.",
    },
    {
      title: "3번 문제",
      content: "배열의 길이를 반환하세요.",
      startCode: "function getLength(arr) {\n\n}",
      answer: "length",
      hint: "배열의 length 속성을 사용하세요.",
      explanation: "arr.length를 반환합니다.",
    },
  ],
};

const USE_MOCK = true;

function useProblemDetail() {
  const [problemSet, setProblemSet] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [code, setCode] = useState("");

  // 문제별 코드 저장
  const [userCodes, setUserCodes] = useState([]);

  const [showHintToast, setShowHintToast] = useState(false);

  // unsolved | wrong | solved
  const [problemStates, setProblemStates] = useState([]);

  // 힌트/강의 활성화
  const [hintEnabled, setHintEnabled] = useState([]);

  // 풀이 활성화
  const [solutionEnabled, setSolutionEnabled] = useState([]);

  const [activeTab, setActiveTab] = useState("result");

  // 모달 상태
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [warningModalOpen, setWarningModalOpen] = useState(false);

  useEffect(() => {
    fetchProblemSet();
  }, []);

  const fetchProblemSet = async () => {
    try {
      let data;

      // ✅ mock 모드
      if (USE_MOCK) {
        data = DUMMY_PROBLEM_SET;
      } else {
        const res = await fetch(
          `${BASE_URL}/api/v1/problem-sets/${PROBLEM_SET_ID}`,
        );
        data = await res.json();
      }

      setProblemSet(data);

      setProblemStates(data.problems.map(() => "unsolved"));
      setHintEnabled(data.problems.map(() => false));
      setSolutionEnabled(data.problems.map(() => false));

      // 문제별 코드 저장
      setUserCodes(data.problems.map((problem) => problem.startCode));

      setCode(data.problems[0].startCode);
    } catch (error) {
      console.error(error);
    }
  };

  const currentProblem = problemSet?.problems[currentIndex];

  // 다음 문제 이동 가능 여부
  const canMoveProblem = (index) => {
    if (index === 0) return true;
    return problemStates[index - 1] === "solved";
  };

  // 문제 이동
  const moveProblem = (index) => {
    if (!canMoveProblem(index)) return;

    const updatedCodes = [...userCodes];
    updatedCodes[currentIndex] = code;

    setUserCodes(updatedCodes);
    setCurrentIndex(index);
    setCode(updatedCodes[index]);
    setActiveTab("result");
  };

  // 제출
  const handleSubmit = () => {
    const answer = currentProblem.answer.trim();
    const userAnswer = code.trim();

    if (userAnswer.includes(answer)) {
      const updatedStates = [...problemStates];
      updatedStates[currentIndex] = "solved";
      setProblemStates(updatedStates);

      const updatedHint = [...hintEnabled];
      updatedHint[currentIndex] = true;
      setHintEnabled(updatedHint);

      const updatedSolution = [...solutionEnabled];
      updatedSolution[currentIndex] = true;
      setSolutionEnabled(updatedSolution);

      setSuccessModalOpen(true);
    } else {
      const updatedStates = [...problemStates];
      updatedStates[currentIndex] = "wrong";
      setProblemStates(updatedStates);

      const updatedHint = [...hintEnabled];
      updatedHint[currentIndex] = true;
      setHintEnabled(updatedHint);

      setShowHintToast(true);

      setTimeout(() => {
        setShowHintToast(false);
      }, 2000);
    }
  };

  // 버튼 스타일
  const getProblemButtonClass = (state, isSelected) => {
    if (isSelected) return "problem-button selected";
    if (state === "solved") return "problem-button solved";
    if (state === "wrong") return "problem-button wrong";
    return "problem-button";
  };

  // 뒤로가기
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

    successModalOpen,
    setSuccessModalOpen,

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
