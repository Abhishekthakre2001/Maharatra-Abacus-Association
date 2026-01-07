import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/DashboardPage";
import StudentPage from "../Pages/StudentPage";
import AddStudentPage from "../Pages/AddStudentPage";
import ResultPage from "../Pages/ResultPage";
import StudentResultDetailPage from "../Pages/StudentResultDetailPage";
import QuestionPage from "../Pages/QuestionPage";
import AddQuestionPage from "../Pages/Addquestion";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import Masters from "../Pages/Masters";
import Examschedule from "../Pages/Examschedule";

// student dashboard routes from here below
import StudentDashboardPage from "../Pages/Student/StudentDashboardPage";
import ExamRule from "../Pages/Student/ExamRule";
import ExamPage from "../Pages/Student/ExamPage";
import StudentResultPage from "../Pages/Student/ResultPage";


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

      {/* 🔒 Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/masters"
        element={
          <ProtectedRoute>
            <Masters />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exam-schedule"
        element={
          <ProtectedRoute>
            <Examschedule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/students-list"
        element={
          <ProtectedRoute>
            <StudentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-student"
        element={
          <ProtectedRoute>
            <AddStudentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-student/:id"
        element={
          <ProtectedRoute>
            <AddStudentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-question"
        element={
          <ProtectedRoute>
            <AddQuestionPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results"
        element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <StudentResultDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/questions"
        element={
          <ProtectedRoute>
            <QuestionPage />
          </ProtectedRoute>
        }
      />

      {/*  student dashboard route added here */}
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute>
            <StudentDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exam-rule"
        element={
          <ProtectedRoute>
            <ExamRule />
          </ProtectedRoute>
        }
      />

      <Route
        path="/exam-page"
        element={
          <ProtectedRoute>
            <ExamPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/student-result"
        element={
          <ProtectedRoute>
            <StudentResultPage />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
