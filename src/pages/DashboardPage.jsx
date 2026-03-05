import { useEffect } from "react";
import { useAuthContext } from "../contexts/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { Dashboard } from "../components/dashboard/Dashboard";

export function DashboardPage() {
  const { token, reloadUser } = useAuthContext();
  const { transactions, loading, reload } = useTransactions(token);

  useEffect(() => { reload(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dashboard
      transactions={transactions}
      txLoading={loading}
      onRefresh={() => { reload(0); reloadUser(); }}
    />
  );
}
