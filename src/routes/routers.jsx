import { createBrowserRouter } from "react-router-dom";

// [레이아웃]
import MainLayout from "../layouts/mainlayout";
import MypageLayout from "../layouts/mypagelayout";
import AdminLayout from "../layouts/adminlayout";
import EmptyLayout from "../layouts/emptylayout";

// [공통]
import HomePage from "../pages/common/homepage";
import ErrorPage from "../pages/common/errorpage";
import LectureTotalPage from "../pages/common/lecturetotalpage";
import LectureDetailPage from "../pages/common/lecturedetailpage";
import ProblemTotalPage from "../pages/common/problemtotalpage";
import ProblemDetailPage from "../pages/common/problemdetailpage";

// [인증]
import LoginPage from "../pages/auth/loginpage";
import SignupPage from "../pages/auth/signuppage";
import FindIdPage from "../pages/auth/findidpage";
import ResetPwPage from "../pages/auth/resetpwpage";

// [유저]
import MyLecturePage from "../pages/user/mypage/mylecturepage";
import MypageProfile from "../pages/user/mypage/mypageprofile";
import ProfileEditPage from "../pages/user/mypage/profileeditpage";
import AuthVerifyPage from "../pages/user/mypage/authverifypage";
import LectureSolvePage from "../pages/user/lecture/lectursolvepage";

// [관리자]
import UserTotalPage from "../pages/admin/user/usertotalpage";
import UserDetailPage from "../pages/admin/user/userdetailpage";
import LectureRegistPage from "../pages/admin/lecture/lectureregistpage";
import ProblemRegistPage from "../pages/admin/problem/problemregistpage";
import BadgeTotalPage from "../pages/admin/badge/BadgeTotalPage";
import RuleTotalPage from "../pages/admin/rule/RuleTotalPage";
import AlramTotalPage from "../pages/admin/alram/AlramTotalPage";

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
      { path: "lectures", element: <LectureTotalPage /> },
      { path: "lecture/:id", element: <LectureDetailPage /> },
      { path: "my-classroom", element: <MyLecturePage /> },
      { path: "lecture/:id/solve", element: <LectureSolvePage /> },
      { path: "problems", element: <ProblemTotalPage /> },
      { path: "problem/:id", element: <ProblemDetailPage /> },
      { path: "profile", element: <MypageProfile /> },
      { path: "profile/edit", element: <ProfileEditPage /> },
    ],
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      { path: "users", element: <UserTotalPage /> },
      { path: "user/:id", element: <UserDetailPage /> },
      { path: "lectures", element: <LectureTotalPage /> },
      { path: "lecture/:id", element: <LectureDetailPage /> },
      { path: "lecture/regist", element: <LectureRegistPage /> },
      { path: "problems", element: <ProblemTotalPage /> },
      { path: "problem/:id", element: <ProblemDetailPage /> },
      { path: "problem/regist", element: <ProblemRegistPage /> },
      { path: "profile", element: <MypageProfile /> },
      { path: "profile/edit", element: <ProfileEditPage /> },
      { path: "badges", element: <BadgeTotalPage /> },
      { path: "rules", element: <RuleTotalPage /> },
      { path: "alrams", element: <AlramTotalPage /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
