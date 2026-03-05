import { useState, useEffect, useCallback } from "react";
import { api } from "../../api/client";
import { SkeletonList } from "../common/Loaders";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

/**
 * Admin panel — works with the actual backend API:
 *
 * GET /api/admin/user → UserResponse[] { id, username, roles }
 *   No account data is exposed through the user listing endpoint.
 *
 * POST /api/admin/{accountNumber}/deposit  → TransactionResponse
 * POST /api/admin/{accountNumber}/withdraw → TransactionResponse
 * DELETE /api/admin/account/delete/{accountId} → (UUID, not account number)
 *
 * Since the user listing doesn't include accounts, account operations
 * are done via a manual-entry form where admin types the account number.
 * Delete requires an account UUID which must also be entered manually.
 */
export function AdminPanel() {
  const { token } = useAuthContext();
  const showToast = useToast();

  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  // Account operation form (deposit / withdraw / delete)
  const [opMode, setOpMode]     = useState(null); // "deposit" | "withdraw" | "delete"
  const [opForm, setOpForm]     = useState({ accountNumber: "", amount: "", currency: "USD", accountId: "" });
  const [opLoading, setOpLoading] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const res = await api.adminGetUsers(token);
      setUsers(Array.isArray(res) ? res : []);
    } catch (ex) { setError(ex.message); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const startOp = (mode) => {
    setOpMode(mode);
    setOpForm({ accountNumber: "", amount: "", currency: "USD", accountId: "" });
    setError("");
  };

  const confirmOp = async () => {
    setOpLoading(true); setError("");
    try {
      if (opMode === "deposit") {
        if (!opForm.accountNumber) return;
        await api.adminDeposit(opForm.accountNumber, { amount: parseFloat(opForm.amount), currency: opForm.currency }, token);
        showToast(`Deposited ${opForm.amount} ${opForm.currency} to ${opForm.accountNumber}`, "success");
      } else if (opMode === "withdraw") {
        if (!opForm.accountNumber) return;
        await api.adminWithdraw(opForm.accountNumber, { amount: parseFloat(opForm.amount), currency: opForm.currency }, token);
        showToast(`Withdrawn ${opForm.amount} ${opForm.currency} from ${opForm.accountNumber}`, "success");
      } else if (opMode === "delete") {
        if (!opForm.accountId) return;
        if (!confirm(`Delete account ${opForm.accountId}? This cannot be undone.`)) return;
        await api.adminDeleteAccount(opForm.accountId, token);
        showToast("Account deleted", "info");
      }
      setOpMode(null);
    } catch (ex) { setError(ex.message); }
    finally { setOpLoading(false); }
  };

  const set = (k) => (e) => setOpForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, marginBottom: 4 }}>
          Admin Panel
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Manage users and accounts</p>
      </div>

      {/* Account operations */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>
          Account Operations
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: opMode ? 16 : 0 }}>
          {["deposit", "withdraw", "delete"].map((m) => (
            <button
              key={m}
              onClick={() => opMode === m ? setOpMode(null) : startOp(m)}
              className={`btn ${opMode === m ? "btn-primary" : "btn-secondary"} btn-sm`}
              style={{ textTransform: "capitalize" }}
            >
              {m}
            </button>
          ))}
        </div>

        {opMode && (
          <div className="fade-in" style={{ display: "flex", gap: 10, alignItems: "flex-end", flexWrap: "wrap", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            {opMode !== "delete" ? (
              <>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <label className="field-label">Account Number</label>
                  <input
                    type="number" placeholder="e.g. 1000000001"
                    value={opForm.accountNumber} onChange={set("accountNumber")}
                    autoFocus
                  />
                </div>
                <div style={{ flex: 1, minWidth: 120 }}>
                  <label className="field-label">Amount</label>
                  <input
                    type="number" step="0.01" min="0.01" max="10000"
                    placeholder="0.00"
                    value={opForm.amount} onChange={set("amount")}
                  />
                </div>
                <div style={{ width: 100 }}>
                  <label className="field-label">Currency</label>
                  <select value={opForm.currency} onChange={set("currency")}>
                    <option>USD</option>
                    <option>KHR</option>
                  </select>
                </div>
              </>
            ) : (
              <div style={{ flex: 1, minWidth: 300 }}>
                <label className="field-label">Account ID (UUID)</label>
                <input
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  value={opForm.accountId} onChange={set("accountId")}
                  autoFocus
                />
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>
                  Account UUID from the database — not the account number
                </div>
              </div>
            )}

            <button
              className="btn btn-primary"
              onClick={confirmOp}
              disabled={opLoading || (opMode !== "delete" ? !opForm.accountNumber || !opForm.amount : !opForm.accountId)}
            >
              {opLoading ? "…" : "Confirm"}
            </button>
            <button className="btn btn-secondary" onClick={() => setOpMode(null)}>Cancel</button>
          </div>
        )}

        {error && (
          <div style={{ marginTop: 12, fontSize: 13, color: "var(--danger)" }}>{error}</div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
        <div className="card" style={{ padding: "14px 20px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Total Users</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--gold)" }}>{users.length}</div>
        </div>
        <div className="card" style={{ padding: "14px 20px", flex: 1 }}>
          <div style={{ fontSize: 10, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>Admin Users</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: "var(--gold)" }}>
            {users.filter(u => u.roles?.includes("ADMIN")).length}
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="card" style={{ overflowX: "auto" }}>
        {loading ? (
          <SkeletonList count={5} height={60} />
        ) : users.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)", fontSize: 14 }}>No users found</div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Username", "User ID", "Roles"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="tx-row" style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, fontWeight: 600 }}>{u.username}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{u.id}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>
                    {u.roles?.map((r) => (
                      <span key={r} className="badge" style={{
                        background: r === "ADMIN" ? "rgba(201,168,76,0.15)" : "rgba(255,255,255,0.05)",
                        color: r === "ADMIN" ? "var(--gold)" : "var(--muted)",
                        marginRight: 4, padding: "2px 8px", borderRadius: 4, fontSize: 10,
                        fontWeight: 600, letterSpacing: "0.06em",
                      }}>
                        {r}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
