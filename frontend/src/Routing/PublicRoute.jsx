import { Navigate } from "react-router-dom";
import { getAuth } from "../utils/auth";

const PublicRoute = ({ children }) => {
  const { token, user, isremember } = getAuth();

  // auto login ONLY if remember me true
  if (token && user && isremember) {
    if (user.usertype.toLowerCase() === "student") {
      return <Navigate to="/student-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // remember false → allow login page
  return children;
};

export default PublicRoute;
