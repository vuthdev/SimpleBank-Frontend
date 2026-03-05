import { useState } from "react";
import { api } from "../../api/client";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

const MAX_ACCOUNTS = 3; // matches BankConfig.MAX_ACCOUNT_PER_USER

export function CreateAccountModal({ onClose }) {
  const { token, user, reloadUser } = useAuthContext();
  const showToast = useToast();
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const accountCount = user?.account?.length || 0;
  const canCreate    = accountCount < MAX_ACCOUNTS;

  const submit = async () => {
    setLoading(true); setError("");
    try {
      await api.createAccount({ currency }, token);
      await reloadUser(); // refresh user so new account appears immediately everywhere
      showToast(`${currency} account opened successfully`, "success");
      onClose();
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Backdrop
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="slide-up card"
        style={{ width: "100%", maxWidth: 420, padding: 32 }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 300, marginBottom: 4 }}>
              Open Account
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              {accountCount}/{MAX_ACCOUNTS} accounts used
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", color: "var(--muted)", fontSize: 20, lineHeight: 1, padding: 4, cursor: "pointer" }}
          >
            ✕
          </button>
        </div>

        {!canCreate ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⊘</div>
            <p style={{ color: "var(--muted)", fontSize: 14 }}>
              You've reached the maximum of {MAX_ACCOUNTS} accounts.
            </p>
            <button className="btn btn-secondary" onClick={onClose} style={{ marginTop: 20 }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 20 }}>
              <label className="field-label">Account Currency</label>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                {["USD", "KHR"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    style={{
                      flex: 1, padding: "14px 0", borderRadius: 8,
                      border: `1px solid ${currency === c ? "var(--gold)" : "var(--border)"}`,
                      background: currency === c ? "var(--gold-dim)" : "transparent",
                      color: currency === c ? "var(--gold)" : "var(--muted)",
                      fontSize: 14, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {c === "USD" ? "🇺🇸 USD" : "🇰🇭 KHR"}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
                {currency === "USD"
                  ? "US Dollar — international transfers supported"
                  : "Cambodian Riel — local transactions"}
              </p>
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 14px",
                background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.2)",
                borderRadius: 6, fontSize: 13, color: "var(--danger)",
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-secondary" onClick={onClose} style={{ flex: 1 }}>
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={submit}
                disabled={loading}
                style={{ flex: 2, justifyContent: "center" }}
              >
                {loading ? "Opening…" : `Open ${currency} Account`}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
