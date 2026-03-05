export function parseJwt(token) {
  try { return JSON.parse(atob(token.split(".")[1])); }
  catch { return {}; }
}

export function isAdmin(token) {
  const p = parseJwt(token);
  return Array.isArray(p.roles) && p.roles.includes("ADMIN");
}

export function isTokenExpired(token) {
  const { exp } = parseJwt(token);
  if (!exp) return true;
  return Date.now() >= exp * 1000;
}

// Still used for the restore-on-mount check where we don't have expiresIn handy
export function msUntilExpiry(token) {
  const { exp } = parseJwt(token);
  if (!exp) return 0;
  return exp * 1000 - Date.now();
}

// Validate the `type` claim so access tokens can't be used as refresh tokens
// and vice versa. Backend now sets type: "access" | "refresh" on every token.
export function isTokenOfType(token, expectedType) {
  const { type } = parseJwt(token);
  return type === expectedType;
}

export function fmt(amount) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export function txSign(tx, myAccounts = []) {
  const myNums = myAccounts.map((a) => a.accountNumber);
  if (tx.type === "DEPOSIT") return "+";
  if (tx.type === "WITHDRAW") return "-";
  // TRANSFER: incoming if receiver is mine and sender is not
  const inbound = myNums.includes(tx.receiverNumber) && !myNums.includes(tx.senderNumber);
  return inbound ? "+" : "-";
}
