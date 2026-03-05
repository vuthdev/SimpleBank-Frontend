import { useState, useCallback, useEffect } from "react";
import { api } from "../api/client";

const PAGE_SIZE = 10;

export function useTransactions(token) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [page, setPage]                 = useState(0);
  const [hasMore, setHasMore]           = useState(false); // true if there's a next page

  const load = useCallback(async (p = 0) => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const res = await api.getTransactions(token, p, PAGE_SIZE);
      const list = Array.isArray(res) ? res : [];
      setTransactions(list);
      setPage(p);
      // If we got a full page, assume there's more. If less, we're on the last page.
      setHasMore(list.length === PAGE_SIZE);
    } catch (ex) {
      setError(ex.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load page 0 on mount / token change
  useEffect(() => {
    if (token) load(0);
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const goTo   = useCallback((p) => load(p),     [load]);
  const next   = useCallback(()   => load(page + 1), [load, page]);
  const prev   = useCallback(()   => load(page - 1), [load, page]);
  const reload = useCallback(()   => load(page),  [load, page]);

  return { transactions, loading, error, page, hasMore, goTo, next, prev, reload };
}

