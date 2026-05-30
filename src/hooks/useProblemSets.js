import { useEffect, useState } from "react";
import { getProblemSets } from "../services/problemService";

function useProblemSets(categoryId) {
  const [problemSets, setProblemSets] = useState([]);

  // 선택된 카테고리 기준으로 문제 세트 목록 조회
  useEffect(() => {
    let isMounted = true;

    const fetchProblemSets = async () => {
      try {
        const data = await getProblemSets(categoryId);

        if (isMounted) {
          setProblemSets(data);
        }
      } catch (error) {
        console.error("문제 목록 조회 실패:", error);
      }
    };

    fetchProblemSets();

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  return problemSets;
}

export default useProblemSets;
