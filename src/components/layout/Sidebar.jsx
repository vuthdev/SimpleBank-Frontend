import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Logo } from "../auth/AuthScreen";
import { isAdmin } from "../../utils/helpers";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { CreateAccountModal } from "../common/CreateAccountModal";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Dashboard", icon: "◈" },
  { path: "/transfer",  label: "Transfer",  icon: "⇄" },
  { path: "/history",   label: "History",   icon: "≡" },
];

const ADMIN_ITEMS = [
  { path: "/admin", label: "Admin Panel", icon: "⬡" },
];

export function Sidebar() {
  const { token, user, logout } = useAuthContext();
  const showToast = useToast();
  const navigate  = useNavigate();
  const admin     = isAdmin(token || "");
  const items     = [...NAV_ITEMS, ...(admin ? ADMIN_ITEMS : [])];
  const [showCreateModal, setShowCreateModal] = useState(false);

  const accountCount = user?.account?.length || 0;
  const canOpenMore  = accountCount < 3;

  const handleLogout = () => {
    logout();
    showToast("You've been signed out", "info");
    navigate("/login", { replace: true });
  };

  return (
    <aside style={{
      width: 220, background: "var(--surface)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", padding: "28px 0",
      position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 100,
    }}>
      {/* Logo — clicking goes to dashboard */}
      <div style={{ padding: "0 24px 28px", borderBottom: "1px solid var(--border)" }}>
        <NavLink to="/dashboard" style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logo size={28} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600 }}>
              SimpleBank
            </span>
          </div>
        </NavLink>
      </div>

      {/* Nav links */}
      <nav style={{ padding: "20px 12px", flex: 1 }}>
        {items.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            style={{ textDecoration: "none", display: "flex", marginBottom: 2 }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {/* Open Account — shown when user can still create accounts */}
        {canOpenMore && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="nav-item"
            style={{
              marginTop: 12, width: "100%",
              border: "1px dashed rgba(201,168,76,0.3)",
              color: "var(--gold)",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span>
            Open Account
          </button>
        )}
      </nav>

      {/* User section */}
      {user && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "var(--gold-dim)", border: "1px solid rgba(201,168,76,0.3)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 700, color: "var(--gold)", flexShrink: 0,
            }}>
              {user.fullName?.[0] || "?"}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.fullName}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {user.email}
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            onClick={handleLogout}
            style={{ width: "100%", padding: "8px", fontSize: 11, justifyContent: "center" }}
          >
            Sign Out
          </button>
        </div>
      )}

      {showCreateModal && <CreateAccountModal onClose={() => setShowCreateModal(false)} />}
    </aside>
  );
}
