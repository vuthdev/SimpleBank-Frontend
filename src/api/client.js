const API_BASE = import.meta.env.VITE_API_BASE || "";

async function request(path, options = {}, token = null) {
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.error || data?.message || `Error ${res.status}`);
  return data;
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  // Login: backend LoginRequest uses `username` not `email`
  login:   (body)         => request("/api/auth/login",    { method: "POST", body: JSON.stringify(body) }),
  register:(body)         => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  refresh: (refreshToken) => request("/api/auth/refresh",  { method: "POST", body: JSON.stringify({ refreshToken }) }),
  // No /api/auth/logout endpoint exists in the current backend — logout is local-only

  // ── User / Customer ───────────────────────────────────────────────────────
  // Backend split user data across two endpoints:
  //   GET /api/customers/me → { fullName, email, phoneNumber, createdAt }
  //   GET /api/accounts     → [{ accountNumber, balance, currency }]
  // We merge them so the rest of the app sees one unified `user` object.
  me: async (t) => {
    const [customer, accounts] = await Promise.all([
      request("/api/customers/me", {}, t),
      request("/api/accounts",     {}, t),
    ]);
    return { ...customer, account: Array.isArray(accounts) ? accounts : [] };
  },

  // Account
  checkAccount:  (num, t)  => request(`/api/accounts/${num}`,  {}, t),
  createAccount: (body, t) => request("/api/accounts", { method: "POST", body: JSON.stringify(body) }, t),

  // ── Transactions ──────────────────────────────────────────────────────────
  getTransactions: (t, page = 0, size = 10) =>
    request(`/api/transactions?page=${page}&size=${size}`, {}, t),
  transfer: (body, t) =>
    request("/api/transactions/transfer", { method: "POST", body: JSON.stringify(body) }, t),

  // ── Admin ─────────────────────────────────────────────────────────────────
  // GET /api/admin/user returns UserResponse: { id, username, roles }
  // No account data is exposed through the admin user listing endpoint.
  adminGetUsers:  (t, page = 0) => request(`/api/admin/user?page=${page}&size=20`, {}, t),
  adminGetUser:   (id, t)       => request(`/api/admin/user/${id}`, {}, t),
  // Deposit/withdraw use accountNumber (Long)
  adminDeposit:   (accountNumber, body, t) =>
    request(`/api/admin/${accountNumber}/deposit`,  { method: "POST", body: JSON.stringify(body) }, t),
  adminWithdraw:  (accountNumber, body, t) =>
    request(`/api/admin/${accountNumber}/withdraw`, { method: "POST", body: JSON.stringify(body) }, t),
  // Delete uses accountId (UUID) — path: /api/admin/account/delete/{accountId}
  adminDeleteAccount: (accountId, t) =>
    request(`/api/admin/account/delete/${accountId}`, { method: "DELETE" }, t),
};

