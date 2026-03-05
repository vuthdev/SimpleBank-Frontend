import { useState, useEffect, useRef, useCallback } from "react";
import { api } from "../api/client";
import { tokenStorage } from "../utils/tokenStorage";
import { isTokenExpired, msUntilExpiry, isTokenOfType } from "../utils/helpers";

export function useAuth() {
  const [tokens, setTokens]   = useState(() => tokenStorage.get());
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimer          = useRef(null);

  // ── Persist tokens whenever they change ──────────────────────────────────
  const saveTokens = useCallback((access, refresh) => {
    tokenStorage.set(access, refresh);
    setTokens({ access, refresh });
  }, []);

  const logout = useCallback(() => {
    clearTimeout(refreshTimer.current);
    tokenStorage.clear();
    setTokens({ access: null, refresh: null });
    setUser(null);
  }, []);

  // ── Schedule next silent refresh ─────────────────────────────────────────
  // Uses expiresIn (seconds) from AuthResponse — backend now correctly returns
  // e.g. 900 for a 15-minute token. Falls back to JWT exp parsing on restore.
  const scheduleRefreshRef = useRef(null);

  const scheduleRefresh = useCallback((access, refresh, expiresInSeconds = null) => {
    clearTimeout(refreshTimer.current);
    const ms = expiresInSeconds != null
      ? (expiresInSeconds * 1000) - 60_000   // use server value: refresh 1 min before expiry
      : msUntilExpiry(access)   - 60_000;    // fallback: parse JWT exp on mount restore

    if (ms <= 0) return;

    refreshTimer.current = setTimeout(async () => {
      try {
        const res = await api.refresh(refresh);
        if (!isTokenOfType(res.accessToken, "access")) throw new Error("Invalid token type");
        saveTokens(res.accessToken, res.refreshToken);
        scheduleRefreshRef.current?.(res.accessToken, res.refreshToken, res.expiresIn);
      } catch {
        logout();
      }
    }, ms);
  }, [saveTokens, logout]);

  scheduleRefreshRef.current = scheduleRefresh;

  // ── Restore session on mount ──────────────────────────────────────────────
  useEffect(() => {
    const { access, refresh } = tokenStorage.get();

    const restore = async () => {
      setLoading(true);
      try {
        if (!access || !refresh) { logout(); return; }

        // Sanity check — make sure stored tokens are the right types
        if (!isTokenOfType(access, "access") || !isTokenOfType(refresh, "refresh")) {
          logout(); return;
        }

        if (!isTokenExpired(access)) {
          // Access token still valid — load user and schedule next refresh
          // using JWT exp since we don't have expiresIn here
          const me = await api.me(access);
          setUser(me);
          scheduleRefresh(access, refresh);
          return;
        }

        // Access expired — try refreshing with the refresh token
        const res = await api.refresh(refresh);
        if (!isTokenOfType(res.accessToken, "access")) throw new Error("Invalid token type");
        saveTokens(res.accessToken, res.refreshToken);
        const me = await api.me(res.accessToken);
        setUser(me);
        scheduleRefresh(res.accessToken, res.refreshToken, res.expiresIn);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    restore();
    return () => clearTimeout(refreshTimer.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const res = await api.login({ username, password });
    if (!isTokenOfType(res.accessToken, "access")) throw new Error("Unexpected token type from server");
    saveTokens(res.accessToken, res.refreshToken);
    const me = await api.me(res.accessToken);
    setUser(me);
    scheduleRefresh(res.accessToken, res.refreshToken, res.expiresIn);
    setLoading(false);
  }, [saveTokens, scheduleRefresh]);

  // ── Register ──────────────────────────────────────────────────────────────
  const register = useCallback(async (data) => {
    return api.register(data);
  }, []);

  // ── Reload user balances without logging out ───────────────────────────────
  const reloadUser = useCallback(async () => {
    const { access } = tokenStorage.get();
    if (!access) return;
    try {
      const me = await api.me(access);
      setUser(me);
    } catch {
      // silently ignore
    }
  }, []);

  return {
    token: tokens.access,
    user,
    loading,
    login,
    register,
    logout,
    setUser,
    reloadUser,
  };
}

