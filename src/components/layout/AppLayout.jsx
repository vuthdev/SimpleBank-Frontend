import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

/**
 * The shell rendered for every authenticated route.
 * Sidebar stays fixed; <Outlet /> renders the current page.
 */
export function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", display: "flex" }}>
      <Sidebar />

      <main style={{
        flex: 1,
        marginLeft: 220,
        padding: "40px 48px",
        minHeight: "100vh",
        maxWidth: "calc(100vw - 220px)",
      }}>
        <Outlet />
      </main>

      {/* Dev indicator */}
      <div style={{
        position: "fixed", bottom: 12, left: 232,
        fontSize: 10, color: "rgba(255,255,255,0.12)", fontFamily: "monospace",
      }}>
        {import.meta.env.VITE_API_BASE || "proxy"}
      </div>
    </div>
  );
}
