import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { fmt } from "../../utils/helpers";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export function Transfer({ onSuccess }) {
  const { token, user, reloadUser } = useAuthContext();
  const showToast = useToast();
  const navigate  = useNavigate();
  const [form, setForm]       = useState({
    senderAccount:   user?.account?.[0]?.accountNumber || "",
    receiverAccount: "",
    amount:          "",
    currency:        "USD",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [result, setResult]   = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await api.transfer({
        senderAccount:   parseInt(form.senderAccount),
        receiverAccount: parseInt(form.receiverAccount),
        amount:          parseFloat(form.amount),
        currency:        form.currency,
      }, token);
      setResult(res);
      // Refresh balances immediately — no need for prop callback
      reloadUser();
      showToast("Transfer completed!", "success");
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setForm(f => ({ ...f, receiverAccount: "", amount: "" }));
  };

  return (
    <div className="fade-in" style={{ maxWidth: 520 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, marginBottom: 4 }}>
          Transfer Funds
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Move money between accounts securely</p>
      </div>

      <div className="card" style={{ padding: 32 }}>
        {result ? (
          /* Success state */
          <div className="fade-in" style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✓</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: "var(--success)", marginBottom: 8 }}>
              Transfer Successful
            </div>
            <div className="mono" style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6 }}>
              {fmt(result.amount)} {result.currency} sent
            </div>
            <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 28 }}>
              {result.senderNumber} → {result.receiverNumber}
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn btn-secondary" onClick={reset}>New Transfer</button>
              <button className="btn btn-primary" onClick={() => navigate("/history")}>View History</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              <div>
                <label className="field-label">From Account</label>
                <select value={form.senderAccount} onChange={set("senderAccount")} required>
                  <option value="">Select account…</option>
                  {user?.account?.map((a) => (
                    <option key={a.accountNumber} value={a.accountNumber}>
                      {a.accountNumber} — {fmt(a.balance)} {a.currency}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="field-label">To Account Number</label>
                <input
                  className="mono"
                  type="number"
                  placeholder="1000000001"
                  value={form.receiverAccount}
                  onChange={set("receiverAccount")}
                  required
                />
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label className="field-label">Amount</label>
                  <input
                    type="number" step="0.01" min="0.01" max="10000"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={set("amount")}
                    required
                  />
                </div>
                <div style={{ width: 110 }}>
                  <label className="field-label">Currency</label>
                  <select value={form.currency} onChange={set("currency")}>
                    <option>USD</option>
                    <option>KHR</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.2)", borderRadius: 6, fontSize: 13, color: "var(--danger)" }}>
                {error}
              </div>
            )}

            <div style={{ marginTop: 20, padding: "12px 16px", background: "var(--gold-glow)", border: "1px solid rgba(201,168,76,0.12)", borderRadius: 8, fontSize: 12, color: "var(--muted)" }}>
              Max transfer per transaction:{" "}
              <strong style={{ color: "var(--gold)" }}>$10,000</strong>
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: "100%", marginTop: 20, padding: "13px", justifyContent: "center" }}>
              {loading ? "Processing…" : "Send Transfer"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
