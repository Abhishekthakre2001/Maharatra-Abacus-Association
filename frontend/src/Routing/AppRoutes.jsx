import { Routes, Route } from "react-router-dom";

import Login from "../Pages/Login";
import Dashboard from "../Pages/DashboardPage";
import StudentPage from "../Pages/StudentPage";
import AddStudentPage from "../Pages/AddStudentPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* <Route element={<ProtectedRoute />}> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/students-list" element={<StudentPage />} />
      <Route path="/add-student" element={<AddStudentPage />} />
      {/* </Route> */}

      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
