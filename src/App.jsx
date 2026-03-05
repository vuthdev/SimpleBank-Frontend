import { Routes, Route, Navigate } from "react-router-dom";
import { injectGlobalStyles } from "./styles/global";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AuthScreen } from "./components/auth/AuthScreen";
import { DashboardPage } from "./pages/DashboardPage";
import { TransferPage } from "./pages/TransferPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdminPage } from "./pages/AdminPage";

injectGlobalStyles();

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<AuthScreen />} />

          {/* Authenticated — all share the AppLayout (sidebar + main) */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transfer"  element={<TransferPage />} />
            <Route path="/history"   element={<HistoryPage />} />
            <Route path="/admin"     element={
              <ProtectedRoute adminOnly>
                <AdminPage />
              </ProtectedRoute>
            } />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}
