import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/DashboardPage";
import StudentPage from "../Pages/StudentPage";
import AddStudentPage from "../Pages/AddStudentPage";
import ResultPage from "../Pages/ResultPage";
import StudentResultDetailPage from "../Pages/StudentResultDetailPage";
import QuestionPage from "../Pages/QuestionPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students-list" element={<StudentPage />} />
      <Route path="/add-student" element={<AddStudentPage />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/results/:id" element={<StudentResultDetailPage />} />
      <Route path="/questions" element={<QuestionPage />} />
      {/* </Route> */}

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
