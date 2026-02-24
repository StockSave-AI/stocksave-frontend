import { useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { getAuthRole, getAuthToken } from "../../utils/authStorage";

function ProtectedRoute({ requiredRole }) {
  const location = useLocation();
  const token = getAuthToken();
  const hasShownDeniedToast = useRef(false);

  const storedUserRaw =
    localStorage.getItem("user") || sessionStorage.getItem("user");
  let accountTypeFromUser = null;
  try {
    accountTypeFromUser = storedUserRaw
      ? JSON.parse(storedUserRaw)?.account_type || null
      : null;
  } catch {
    accountTypeFromUser = null;
  }

  const fallbackRole = getAuthRole();
  const normalizedAccountType =
    accountTypeFromUser ||
    (fallbackRole === "owner"
      ? "Owner"
      : fallbackRole === "customer"
        ? "Customer"
        : null);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole === "owner" && normalizedAccountType !== "Owner") {
    if (!hasShownDeniedToast.current) {
      toast.error("Access denied. Customers cannot access owner dashboard.");
      hasShownDeniedToast.current = true;
    }
    return <Navigate to="/dashboard" replace />;
  }

  if (requiredRole === "customer" && normalizedAccountType === "Owner") {
    if (!hasShownDeniedToast.current) {
      toast.error("Access denied. Owners cannot access customer dashboard.");
      hasShownDeniedToast.current = true;
    }
    return <Navigate to="/owner/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
