import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { isAdmin } from "../../utils/helpers";
import { Spinner } from "../common/Loaders";

/**
 * Wraps any route that requires authentication.
 * - Still loading auth state  → show spinner
 * - Not logged in             → redirect to /login, remembering where they wanted to go
 * - adminOnly + not admin     → redirect to /dashboard
 * - Otherwise                 → render children
 */
export function ProtectedRoute({ children, adminOnly = false }) {
  const { token, loading } = useAuthContext();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, marginBottom: 24, color: "var(--gold)" }}>
            SimpleBank
          </div>
          <Spinner />
        </div>
      </div>
    );
  }

  if (!token) {
    // Remember where the user was trying to go so we can redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin(token)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
