import { useEffect } from "react";

const COLORS = {
  success: "var(--success)",
  error:   "var(--danger)",
  info:    "var(--gold)",
};

export function Toast({ msg, type = "info", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="toast card"
      style={{
        padding: "14px 18px",
        display: "flex",
        gap: 10,
        alignItems: "center",
        minWidth: 280,
        maxWidth: 400,
        borderLeft: `3px solid ${COLORS[type] || COLORS.info}`,
      }}
    >
      <span style={{ fontSize: 13, flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{ background: "none", color: "var(--muted)", fontSize: 18, lineHeight: 1 }}
      >
        ×
      </button>
    </div>
  );
}
