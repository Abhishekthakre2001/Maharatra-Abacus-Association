import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/DashboardPage";
import StudentPage from "../Pages/StudentPage";
import AddStudentPage from "../Pages/AddStudentPage";
import ResultPage from "../Pages/ResultPage";
import StudentResultDetailPage from "../Pages/StudentResultDetailPage";
import QuestionPage from "../Pages/QuestionPage";
import AddQuestionPage from "../Pages/Addquestion";
import ProtectedRoute from "./RoleBasedProtectedRoute";
import PublicRoute from "./PublicRoute";
import Masters from "../Pages/Masters";
import Examschedule from "../Pages/Examschedule";

// student dashboard routes from here below
import StudentDashboardPage from "../Pages/Student/StudentDashboardPage";
import ExamRule from "../Pages/Student/ExamRule";
import ExamPage from "../Pages/Student/ExamPage";
import StudentResultPage from "../Pages/Student/ResultPage";
import RoleProtectedRoute from "./RoleBasedProtectedRoute";



const AppRoutes = () => {
  return (
    <Routes>

      {/* 🔓 Public Route */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <Dashboard />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/masters"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <Masters />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/exam-schedule"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <Examschedule />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/students-list"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <StudentPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/add-student"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AddStudentPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/add-student/:id"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AddStudentPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/add-question"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <AddQuestionPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <ResultPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/results/:id"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <StudentResultDetailPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/questions"
        element={
          <RoleProtectedRoute allowedRoles={["Admin"]}>
            <QuestionPage />
          </RoleProtectedRoute>
        }
      />


      {/*  student dashboard route added here */}
      <Route
        path="/student-dashboard"
        element={
          <RoleProtectedRoute allowedRoles={["student"]}>
            <StudentDashboardPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/exam-rule"
        element={
          <RoleProtectedRoute allowedRoles={["student"]}>
            <ExamRule />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/exam-page"
        element={
          <RoleProtectedRoute allowedRoles={["student"]}>
            <ExamPage />
          </RoleProtectedRoute>
        }
      />

      <Route
        path="/student-result"
        element={
          <RoleProtectedRoute allowedRoles={["student"]}>
            <StudentResultPage />
          </RoleProtectedRoute>
        }
      />


    </Routes>
  );
};

export default AppRoutes;
