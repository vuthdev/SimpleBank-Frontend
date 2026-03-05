import { useAuthContext } from "../contexts/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { History } from "../components/history/History";

export function HistoryPage() {
  const { token } = useAuthContext();
  const { transactions, loading, page, hasMore, next, prev, goTo, reload } = useTransactions(token);

  return (
    <History
      transactions={transactions}
      loading={loading}
      page={page}
      hasMore={hasMore}
      onNext={next}
      onPrev={prev}
      onGoTo={goTo}
      onRefresh={reload}
    />
  );
}
