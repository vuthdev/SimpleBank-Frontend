import { useState, useMemo } from "react";
import { TxRow } from "../common/TxRow";
import { SkeletonList } from "../common/Loaders";
import { useAuthContext } from "../../contexts/AuthContext";

const FILTERS = ["ALL", "TRANSFER", "DEPOSIT", "WITHDRAW"];

function Pagination({ page, hasMore, onPrev, onNext, loading }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 24px", borderTop: "1px solid var(--border)",
    }}>
      <button
        onClick={onPrev}
        disabled={page === 0 || loading}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
          background: "transparent", border: "1px solid var(--border)",
          color: page === 0 ? "var(--muted)" : "var(--text)",
          opacity: page === 0 ? 0.4 : 1,
          cursor: page === 0 ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        ‹ Previous
      </button>

      <span className="mono" style={{ fontSize: 12, color: "var(--muted)" }}>
        Page {page + 1}
      </span>

      <button
        onClick={onNext}
        disabled={!hasMore || loading}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 500,
          background: hasMore ? "var(--gold)" : "transparent",
          border: `1px solid ${hasMore ? "var(--gold)" : "var(--border)"}`,
          color: hasMore ? "var(--ink)" : "var(--muted)",
          opacity: !hasMore ? 0.4 : 1,
          cursor: !hasMore ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        Next ›
      </button>
    </div>
  );
}

export function History({ transactions, loading, page, hasMore, onNext, onPrev, onGoTo, onRefresh }) {
  const { user } = useAuthContext();
  const [filter, setFilter] = useState("ALL");

  // Client-side filter is applied on top of the current page results.
  // When switching filters, jump back to page 0 to get fresh server results.
  const handleFilterChange = (f) => { setFilter(f); onGoTo(0); };

  const visible = useMemo(() =>
    filter === "ALL" ? transactions : transactions.filter((t) => t.type === filter),
    [transactions, filter]
  );

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 38, fontWeight: 300, marginBottom: 4 }}>
          Transaction History
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          {visible.length} transaction{visible.length !== 1 ? "s" : ""} on this page
        </p>
      </div>

      {/* Filter bar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        {FILTERS.map((f) => (
          <button key={f} onClick={() => handleFilterChange(f)} style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600,
            letterSpacing: "0.06em",
            background: filter === f ? "var(--gold)" : "transparent",
            color:      filter === f ? "var(--ink)" : "var(--muted)",
            border:     `1px solid ${filter === f ? "var(--gold)" : "var(--border)"}`,
            transition: "all 0.2s",
          }}>
            {f}
          </button>
        ))}

        <button className="btn btn-secondary btn-sm" onClick={onRefresh} disabled={loading} style={{ marginLeft: "auto" }}>
          {loading ? "Loading…" : "↻ Refresh"}
        </button>
      </div>

      <div className="card">
        {loading ? (
          <SkeletonList count={10} height={64} />
        ) : visible.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--muted)", fontSize: 14 }}>
            No {filter !== "ALL" ? filter.toLowerCase() : ""} transactions on this page
          </div>
        ) : (
          <>
            <div style={{ padding: "0 24px" }}>
              {visible.map((tx) => (
                <TxRow key={tx.id} tx={tx} accounts={user?.account || []} />
              ))}
            </div>

            <Pagination
              page={page}
              hasMore={hasMore}
              onPrev={onPrev}
              onNext={onNext}
              loading={loading}
            />
          </>
        )}
      </div>
    </div>
  );
}
