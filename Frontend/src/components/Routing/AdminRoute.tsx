// src/components/AdminRoute.tsx
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("access_token");
  const role = localStorage.getItem("role"); // "Admin" or "Staff"

  if (!token || !role) {
    return <Navigate to="/login" replace />;
  }

  // Allow only Admin
  if (role !== "Admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
