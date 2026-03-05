import { fmt, fmtDate, txSign } from "../../utils/helpers";

const TYPE_ICON = { TRANSFER: "⇄", DEPOSIT: "↓", WITHDRAW: "↑" };

export function TxRow({ tx, accounts = [] }) {
  const sign      = txSign(tx, accounts);
  const signColor = sign === "+" ? "var(--success)" : "var(--text)";
  const statusKey = tx.status?.toLowerCase() || "pending";
  const icon      = TYPE_ICON[tx.type] || "·";

  return (
    <div className="tx-row" style={{ display: "flex", alignItems: "center", padding: "13px 0", borderBottom: "1px solid var(--border)", gap: 14 }}>
      {/* Icon */}
      <div style={{
        width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        background: sign === "+" ? "rgba(76,175,125,0.08)" : "rgba(255,255,255,0.04)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
      }}>
        {icon}
      </div>

      {/* Type & accounts */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 3 }}>{tx.type}</div>
        <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>
          {tx.senderNumber ?? "—"} → {tx.receiverNumber ?? "—"}
        </div>
      </div>

      {/* Amount & status */}
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div className="mono" style={{ fontSize: 14, color: signColor, marginBottom: 4 }}>
          {sign}{fmt(tx.amount)}{" "}
          <span style={{ fontSize: 11, color: "var(--muted)" }}>{tx.currency}</span>
        </div>
        <span className={`badge ${statusKey}`}>{tx.status}</span>
      </div>

      {/* Date */}
      <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", flexShrink: 0 }}>
        {fmtDate(tx.createdAt)}
      </div>
    </div>
  );
}
