const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 1. 관리자/운영자용 강좌(Course) 전체 목록 조회 (수강 신청 상태 강제 매싱 가드 추가)
export const getStudentCourses = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/courses`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "강좌 목록을 불러오지 못했습니다.");
    }

    const result = await response.json();
    const courses = result?.data?.courses || result?.data || result;

    const localSavedEnrollments = JSON.parse(
      localStorage.getItem("enrolled_courses") || "[]",
    );

    if (Array.isArray(courses)) {
      return courses.map((course) => {
        const cId = course.id || course.courseId;
        if (
          localSavedEnrollments.includes(String(cId)) ||
          localSavedEnrollments.includes(Number(cId))
        ) {
          return { ...course, isEnrolled: true, enrolled: true };
        }
        return course;
      });
    }

    return courses;
  } catch (error) {
    console.error("getStudentCourses API 에러:", error);
    throw error;
  }
};

// 2. 강좌 공개/비공개 상태 변경 토글 (ACTIVE <-> DRAFT)
export const updateCourseStatus = async (courseId, payload) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/courses/${courseId}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "상태 변경 도중 에러가 발생했습니다.",
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`updateCourseStatus API 에러 (ID: ${courseId}):`, error);
    throw error;
  }
};

// 3. 대카테고리 목록 조회 (강좌용)
export const getLectureCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/courses/categories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "강의 카테고리를 가져오지 못했습니다.",
      );
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.error("getLectureCategories API 에러:", error);
    throw error;
  }
};

// 4. 문제풀이 대카테고리 전체 목록 조회
export const getProblemCategories = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/problems/categories`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "문제 카테고리를 가져오지 못했습니다.",
      );
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.error("getProblemCategories API 에러:", error);
    throw error;
  }
};

// 5. 선택한 문제 카테고리 ID 하위의 문제 세트 목록 조회
export const getProblemSetsByCategory = async (categoryId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/problems/categories/${categoryId}/sets`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "해당 카테고리의 문제 세트를 가져오지 못했습니다.",
      );
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.error(
      `getProblemSetsByCategory API 에러 (ID: ${categoryId}):`,
      error,
    );
    throw error;
  }
};

// 6. 특정 강좌의 상세 정보 조회 (LectureTotalPage용)
export const getCourseDetail = async (courseId) => {
  try {
    const response = await fetch(`${BASE_URL}/api/v1/courses/${courseId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || "강좌 상세 정보를 불러오지 못했습니다.",
      );
    }

    const result = await response.json();
    const courseData = result?.data || result;

    const localSavedEnrollments = JSON.parse(
      localStorage.getItem("enrolled_courses") || "[]",
    );
    const cId = courseData.id || courseData.courseId || courseId;
    if (
      localSavedEnrollments.includes(String(cId)) ||
      localSavedEnrollments.includes(Number(cId))
    ) {
      courseData.isEnrolled = true;
      courseData.enrolled = true;
    }

    return courseData;
  } catch (error) {
    console.error(`getCourseDetail API 에러 (ID: ${courseId}):`, error);
    throw error;
  }
};

// 7. 특정 강좌의 커리큘럼 강의 목록 조회 (LectureTotalPage용)
export const getCourseLectures = async (courseId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/courses/${courseId}/lectures`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "강의 목록을 불러오지 못했습니다.");
    }

    const result = await response.json();
    return result?.data || result;
  } catch (error) {
    console.error(`getCourseLectures API 에러 (ID: ${courseId}):`, error);
    throw error;
  }
};

// 8. 학생용 강좌 수강 신청 (성공 기록 로컬 저장 로직 보완)
export const enrollCourse = async (courseId) => {
  try {
    const response = await fetch(
      `${BASE_URL}/api/v1/courses/${courseId}/enrollments`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "수강 신청에 실패했습니다.");
    }

    const localSavedEnrollments = JSON.parse(
      localStorage.getItem("enrolled_courses") || "[]",
    );
    if (!localSavedEnrollments.includes(String(courseId))) {
      localSavedEnrollments.push(String(courseId));
      localStorage.setItem(
        "enrolled_courses",
        JSON.stringify(localSavedEnrollments),
      );
    }

    return await response.json();
  } catch (error) {
    if (error.message && error.message.includes("Duplicate entry")) {
      const localSavedEnrollments = JSON.parse(
        localStorage.getItem("enrolled_courses") || "[]",
      );
      if (!localSavedEnrollments.includes(String(courseId))) {
        localSavedEnrollments.push(String(courseId));
        localStorage.setItem(
          "enrolled_courses",
          JSON.stringify(localSavedEnrollments),
        );
      }
      return { success: true, message: "이미 신청된 강좌 기록 보존" };
    }
    console.error(`enrollCourse API 에러 (ID: ${courseId}):`, error);
    throw error;
  }
};

// 9. 관리자용 강좌 삭제
export const deleteCourse = async (courseId) => {
  try {
    const token =
      localStorage.getItem("token") || localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/courses/${courseId}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "강좌 삭제에 실패했습니다.");
    }

    if (
      response.status === 204 ||
      response.headers.get("content-length") === "0"
    ) {
      return { success: true };
    }

    const responseText = await response.text();
    return responseText ? JSON.parse(responseText) : { success: true };
  } catch (error) {
    console.error(`deleteCourse API 에러 (ID: ${courseId}):`, error);
    throw error;
  }
};
