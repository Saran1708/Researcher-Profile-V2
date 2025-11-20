// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // "Admin" or "Staff"

  // Not logged in
  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // Explicitly allow only Staff
  if (role !== "Staff") {
    return <Navigate to="/login" replace />; 
    // OR "/login", depending on your flow
  }

  return children;
};

export default PrivateRoute;
