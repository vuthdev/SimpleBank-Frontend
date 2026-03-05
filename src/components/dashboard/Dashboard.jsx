import { useState } from "react";
import { fmt } from "../../utils/helpers";
import { TxRow } from "../common/TxRow";
import { SkeletonList } from "../common/Loaders";
import { CreateAccountModal } from "../common/CreateAccountModal";
import { useAuthContext } from "../../contexts/AuthContext";

export function Dashboard({ transactions, txLoading, onRefresh }) {
  const { user } = useAuthContext();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const totalBalance = user?.account?.reduce((s, a) => s + parseFloat(a.balance || 0), 0) || 0;
  const hasAccounts  = user?.account?.length > 0;

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, marginBottom: 4 }}>
          Good day, <em style={{ fontStyle: "italic", color: "var(--gold)" }}>{user?.fullName?.split(" ")[0]}</em>
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Here's your financial overview</p>
      </div>

      {/* Total balance */}
      <div className="card" style={{
        padding: 28, marginBottom: 20,
        background: "linear-gradient(135deg, #16161e 0%, #1c1c28 100%)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>Total Balance</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20 }}>
          <span className="stat-number">{fmt(totalBalance)}</span>
          <span style={{ color: "var(--muted)", fontSize: 14 }}>USD</span>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {user?.roles?.map((r) => (
            <span key={r} className="badge" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>
              {r.replace("ROLE_", "")}
            </span>
          ))}
        </div>
      </div>

      {/* Account cards */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Your Accounts
          </span>
          {hasAccounts && user.account.length < 3 && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowCreateModal(true)}
            >
              + Open Account
            </button>
          )}
        </div>

        {!hasAccounts ? (
          /* Empty state — prominent CTA for new users */
          <div className="card" style={{
            padding: 36, textAlign: "center",
            border: "1px dashed rgba(201,168,76,0.25)",
            background: "linear-gradient(135deg, rgba(201,168,76,0.03) 0%, transparent 100%)",
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🏦</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, marginBottom: 8 }}>
              No accounts yet
            </div>
            <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24, maxWidth: 280, margin: "0 auto 24px" }}>
              Open your first bank account to start sending and receiving money.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => setShowCreateModal(true)}
              style={{ justifyContent: "center" }}
            >
              Open Your First Account
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {user.account.map((acc, i) => (
              <div key={acc.accountNumber} className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>
                  Account {i + 1}
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 300, color: "var(--gold)", marginBottom: 12 }}>
                  {fmt(acc.balance)}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>{acc.accountNumber}</span>
                  <span className="badge" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>{acc.currency}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent transactions */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Recent Transactions</h2>
          <button className="btn btn-secondary btn-sm" onClick={onRefresh} disabled={txLoading}>
            {txLoading ? "Loading…" : "Refresh"}
          </button>
        </div>

        {txLoading ? (
          <SkeletonList count={4} height={52} />
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0", color: "var(--muted)", fontSize: 13 }}>
            No transactions yet
          </div>
        ) : (
          <div>
            {transactions.slice(0, 8).map((tx) => (
              <TxRow key={tx.id} tx={tx} accounts={user?.account || []} />
            ))}
          </div>
        )}
      </div>

      {showCreateModal && <CreateAccountModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}
