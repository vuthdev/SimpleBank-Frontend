export function Shimmer({ height = 48, style = {} }) {
  return <div className="shimmer" style={{ height, marginBottom: 8, ...style }} />;
}

export function SkeletonList({ count = 5, height = 60 }) {
  return (
    <div style={{ padding: 24 }}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} height={height} />
      ))}
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 48 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "50%",
        border: "2px solid var(--border)",
        borderTopColor: "var(--gold)",
        animation: "spin 0.7s linear infinite",
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
