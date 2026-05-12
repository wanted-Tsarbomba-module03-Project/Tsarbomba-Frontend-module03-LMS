import { createBrowserRouter } from "react-router-dom";

// 레이아웃 임포트
import MainLayout from "../layouts/MainLayout";
import MypageLayout from "../layouts/MypageLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmptyLayout from "../layouts/EmptyLayout";

// 페이지 임포트 (공통/인증)
import HomePage from "../pages/common/HomePage";
import ErrorPage from "../pages/common/ErrorPage";
import LectureTotalPage from "../pages/common/LectureTotalPage";
import LectureDetailPage from "../pages/common/LectureDetailPage";
import ProblemTotalPage from "../pages/common/ProblemTotalPage";
import ProblemDetailPage from "../pages/common/ProblemDetailPage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import FindIdPage from "../pages/auth/FindIdPage";
import ResetPwPage from "../pages/auth/ResetPwPage";
import AuthVerifyPage from "../pages/student/mypage/AuthVerifyPage";

// 페이지 임포트 (학생 전용)
import MyLecturePage from "../pages/user/mypage/MyLecturePage";
import LectureSolvePage from "../pages/user/LectureSolvePage";
import MypageProfile from "../pages/user/mypage/MypageProfile";
import ProfileEditPage from "../pages/user/mypage/ProfileEditPage";

// 페이지 임포트 (관리자 전용)
import UserTotalPage from "../pages/admin/user/UserTotalPage";
import UserDetailPage from "../pages/admin/user/UserDetailPage";
import LectureRegistPage from "../pages/admin/lecture/LectureRegistPage";
import ProblemRegistPage from "../pages/admin/problem/ProblemRegistPage";

export const router = createBrowserRouter([
    // [1] 공통 메인 (헤더 + 카테고리바)
    {
        path: "/",
        element: <MainLayout />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <HomePage /> },
        ],
    },

    // [2] 인증 및 계정 관리 (최소 UI)
    {
        element: <EmptyLayout />,
        children: [
            { path: "login", element: <LoginPage /> },
            { path: "signup", element: <SignupPage /> },
            { path: "find-id", element: <FindIdPage /> },
            { path: "reset-pw", element: <ResetPwPage /> },
            { path: "verify", element: <AuthVerifyPage /> }, // 비번 재확인 (공용 관문)
        ],
    },

    // [3] 학생 전용 (헤더 + 학생 사이드바)
    {
        path: "user",
        element: <MypageLayout />,
        children: [
            // 강의 관련 (Total/Detail)
            { path: "lectures", element: <LectureTotalPage /> },
            { path: "lecture/:id", element: <LectureDetailPage /> },

            // 내 학습 관련
            { path: "my-classroom", element: <MyLecturePage /> },
            { path: "lecture/:id/solve", element: <LectureSolvePage /> }, // 강의실 내 풀이

            // 문제풀이방 관련 (Total)
            { path: "problems", element: <ProblemTotalPage /> },

            // 계정 관리
            { path: "profile", element: <MypageProfile /> },
            { path: "profile/edit", element: <ProfileEditPage /> },
        ],
    },

    // [4] 문제풀이 상세 (독립된 전체 화면)
    {
        path: "problem/:id",
        element: <ProblemDetailPage />,
    },

    // [5] 관리자 전용 (헤더 + 관리자 사이드바)
    {
        path: "admin",
        element: <AdminLayout />,
        children: [
            // 회원 관리 (Total/Detail)
            { path: "users", element: <UserTotalPage /> },
            { path: "user/:id", element: <UserDetailPage /> },

            // 강의 관리 (Total/Detail/Regist/Edit)
            { path: "lectures", element: <LectureTotalPage /> },
            { path: "lecture/:id", element: <LectureDetailPage /> },
            { path: "lecture/regist", element: <LectureRegistPage /> },
            { path: "lecture/edit/:id", element: <LectureRegistPage /> }, // 등록 페이지 재사용

            // 문제 관리 (Total/Detail/Regist/Edit)
            { path: "problems", element: <ProblemTotalPage /> },
            { path: "problem/:id", element: <ProblemDetailPage /> },
            { path: "problem/regist", element: <ProblemRegistPage /> },
            { path: "problem/edit/:id", element: <ProblemRegistPage /> }, // 등록 페이지 재사용
        ],
    },

    // [6] 통합 에러 처리 (404 등)
    {
        path: "*",
        element: <ErrorPage />,
    },
]);