import { createContext, useContext, useState, useCallback } from "react";
import { Toast } from "../components/common/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {toast && (
        <Toast
          key={toast.id}
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
