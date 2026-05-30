import { createBrowserRouter } from "react-router-dom";

// [레이아웃]
import MainLayout from "../layouts/MainLayout";
import MypageLayout from "../layouts/MypageLayout";
import AdminLayout from "../layouts/AdminLayout";
import EmptyLayout from "../layouts/EmptyLayout";

// [공통]
import HomePage from "../pages/common/HomePage";
import ErrorPage from "../pages/common/ErrorPage";
import LectureTotalPage from "../pages/common/LectureTotalPage";
import LectureDetailPage from "../pages/common/LectureDetailPage";
import ProblemTotalPage from "../pages/common/ProblemTotalPage";
import ProblemDetailPage from "../pages/common/ProblemDetailPage";

// [인증]
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import FindIdPage from "../pages/auth/FindIdPage";
import ResetPwPage from "../pages/auth/ResetPwPage";

// [유저]
import MyLecturePage from "../pages/user/mypage/MyLecturePage";
import MypageProfile from "../pages/user/mypage/MypageProfile";
import ProfileEditPage from "../pages/user/mypage/ProfileEditPage";
import AuthVerifyPage from "../pages/user/mypage/AuthVerifyPage";
import LectureSolvePage from "../pages/user/lecture/LecturSolvePage";
import IntroducePage from "../pages/user/mypage/IntroducePage";

// [관리자]
import UserTotalPage from "../pages/admin/user/UserTotalPage";
import UserDetailPage from "../pages/admin/user/UserDetailPage";
import LectureRegistPage from "../pages/admin/lecture/LectureRegistPage";
import ProblemEditPage from "../pages/admin/problem/ProblemEditPage";
import ProblemRegistPage from "../pages/admin/problem/ProblemRegistPage";
import BadgeTotalPage from "../pages/admin/badge/BadgeTotalPage";
import RulePage from "../pages/admin/rule/RulePage";
import AlramTotalPage from "../pages/admin/alram/AlramTotalPage";
import AlramDetailPage from "../pages/admin/alram/AlramDetailPage";
import GeneralChatPage from "../pages/user/chatbot/GeneralChatPage";
import ProblemLayout from "../layouts/ProblemLayout";
import LectureProgressPage from "../pages/admin/lecture/LectureProgressPage";
import LectureManagementPage from "../pages/admin/lecture/LectureManagementPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    element: <EmptyLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "signup", element: <SignupPage /> },
      { path: "find-id", element: <FindIdPage /> },
      { path: "reset-pw", element: <ResetPwPage /> },
      { path: "verify", element: <AuthVerifyPage /> },
    ],
  },
  {
    path: "user",
    element: <MypageLayout />,
    children: [
      { path: "lecture/:id", element: <LectureTotalPage /> },
      { path: "lecture/:id/:lectureId", element: <LectureDetailPage /> },
      { path: "my-classroom", element: <MyLecturePage /> },
      { path: "lecture/:id/solve", element: <LectureSolvePage /> },
      { path: "problems", element: <ProblemTotalPage /> },
      { path: "introduce", element: <IntroducePage /> },
      { path: "profile", element: <MypageProfile /> },
      { path: "profile/edit", element: <ProfileEditPage /> },
      { path: "chat", element: <GeneralChatPage /> },
      { path: "chat/:roomId", element: <GeneralChatPage /> },
    ],
  },
  {
    path: "user",
    element: <ProblemLayout />,
    children: [{ path: "problem/:id", element: <ProblemDetailPage /> }],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { path: "users", element: <UserTotalPage /> },
      { path: "user/:id", element: <UserDetailPage /> },
      { path: "lectures", element: <LectureManagementPage /> },
      { path: "lecture/:id", element: <LectureTotalPage /> },
      { path: "lecture/:id/:lectureId", element: <LectureDetailPage /> },
      { path: "lecture/new", element: <LectureRegistPage /> },
      { path: "lecture/:id/progress", element: <LectureProgressPage /> },
      { path: "problems", element: <ProblemTotalPage /> },
      { path: "problem/:id", element: <ProblemEditPage /> },
      { path: "problem/new", element: <ProblemRegistPage /> },
      { path: "badges", element: <BadgeTotalPage /> },
      { path: "rules", element: <RulePage /> },
      { path: "alrams", element: <AlramTotalPage /> },
      { path: "alram/:id", element: <AlramDetailPage /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
