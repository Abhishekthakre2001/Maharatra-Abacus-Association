import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/DashboardPage";
import StudentPage from "../Pages/StudentPage";
import AddStudentPage from "../Pages/AddStudentPage";
import ResultPage from "../Pages/ResultPage";
import StudentResultDetailPage from "../Pages/StudentResultDetailPage";
import QuestionPage from "../Pages/QuestionPage";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

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

    </Routes>
  );
};

export default AppRoutes;
