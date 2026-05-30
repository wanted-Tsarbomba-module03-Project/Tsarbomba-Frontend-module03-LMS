import { useEffect, useState } from "react";
import {
  getUserCourseProgress,
  getUserProblemList,
} from "../services/adminService";

export const useUserLists = ({ tab, userId, courseId }) => {
  const [listData, setListData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        if (tab === "COURSE") {
          const result = await getUserCourseProgress(courseId);
          const d = result.data;

          setListData([
            {
              courseId: d.courseId,
              title: d.courseTitle,
              progress: d.averageLearningRate,
              date: d.updatedAt,
            },
          ]);
        }

        if (tab === "PROBLEM") {
          const result = await getUserProblemList(userId);
          const submissions = result.data.submissions;

          setListData(
            submissions.map((item, idx) => ({
              ...item,
              index: idx + 1,
            })),
          );
        }
      } catch (err) {
        console.error("리스트 조회 실패:", err);
      }
    };

    fetchData();
  }, [tab, userId, courseId]);

  return { listData };
};
