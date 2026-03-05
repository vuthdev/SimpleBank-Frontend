import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";

export function AuthScreen() {
  const { login, register, token } = useAuthContext();
  const showToast = useToast();
  const navigate  = useNavigate();
  const location  = useLocation();

  // ALL hooks must be declared before any early return — Rules of Hooks
  const [mode, setMode]       = useState("login");
  const [form, setForm]       = useState({
    username: "", password: "",
    // register only
    fullName: "", phoneNumber: "", email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");

  // If already logged in, redirect — safe to do after all hooks are declared
  const from = location.state?.from?.pathname || "/dashboard";
  if (token) return <Navigate to={from} replace />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const switchMode = (m) => { setMode(m); setError(""); setSuccess(""); };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(""); setSuccess("");
    try {
      if (mode === "login") {
        // backend LoginRequest: { username, password }
        await login(form.username, form.password);
        showToast("Welcome back!", "success");
        navigate(from, { replace: true });
      } else {
        // backend RegisterRequest: { username, password, fullName, phoneNumber, email }
        await register({
          username:    form.username,
          password:    form.password,
          fullName:    form.fullName,
          phoneNumber: form.phoneNumber,
          email:       form.email,
        });
        setSuccess("Account created! You can now sign in.");
        switchMode("login");
      }
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", padding: 24,
    }}>
      {/* Background glow */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)" }} />
        <div style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.03) 0%, transparent 70%)" }} />
      </div>

      <div className="slide-up" style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <Logo size={36} />
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em" }}>
              SimpleBank
            </span>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Private Banking Platform</p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {/* Tabs */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 28 }}>
            {["login", "register"].map((m) => (
              <button key={m} onClick={() => switchMode(m)} style={{
                flex: 1, padding: "10px 0", background: "none",
                color: mode === m ? "var(--gold)" : "var(--muted)",
                fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
                textTransform: "uppercase",
                borderBottom: `2px solid ${mode === m ? "var(--gold)" : "transparent"}`,
                transition: "all 0.2s",
              }}>
                {m}
              </button>
            ))}
          </div>

          <form onSubmit={submit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mode === "register" && (
                <>
                  <input
                    placeholder="Full name"
                    value={form.fullName}
                    onChange={set("fullName")}
                    required
                  />
                  <input
                    placeholder="Phone number"
                    value={form.phoneNumber}
                    onChange={set("phoneNumber")}
                    required
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={set("email")}
                    required
                  />
                </>
              )}
              <input
                placeholder="Username"
                value={form.username}
                onChange={set("username")}
                autoComplete="username"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={set("password")}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
              />
            </div>

            {error && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(224,92,92,0.1)", border: "1px solid rgba(224,92,92,0.2)", borderRadius: 6, fontSize: 13, color: "var(--danger)" }}>
                {error}
              </div>
            )}
            {success && (
              <div style={{ marginTop: 14, padding: "10px 14px", background: "rgba(76,175,125,0.1)", border: "1px solid rgba(76,175,125,0.2)", borderRadius: 6, fontSize: 13, color: "var(--success)" }}>
                {success}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={loading}
              style={{ width: "100%", marginTop: 20, padding: "13px", justifyContent: "center" }}>
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {mode === "login" && (
            <p style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "var(--muted)" }}>
              Default admin: <span className="mono" style={{ color: "var(--gold)" }}>system / admin123</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function Logo({ size = 28 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size * 0.22, background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ color: "var(--ink)", fontWeight: 700, fontSize: size * 0.48, lineHeight: 1 }}>S</span>
    </div>
  );
}
