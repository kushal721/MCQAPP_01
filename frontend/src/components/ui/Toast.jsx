import React, { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle, Close, CrossCircle } from "../icons";

const ToastContext = createContext(() => {});

export const useToast = () => useContext(ToastContext);

let nextId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback(
    (id) => setToasts((list) => list.filter((t) => t.id !== id)),
    []
  );

  // toast("Saved") or toast("Failed", "error")
  const toast = useCallback(
    (message, type = "success") => {
      const id = ++nextId;
      setToasts((list) => [...list, { id, message, type }]);
      setTimeout(() => dismiss(id), 3500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-fade-up items-start gap-3 rounded-lg border border-line bg-paper-card p-3.5 shadow-lg shadow-ink/10"
          >
            {t.type === "error" ? (
              <CrossCircle className="mt-0.5 h-5 w-5 shrink-0 text-wrong-500" />
            ) : (
              <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-right-500" />
            )}
            <p className="flex-1 text-sm font-medium text-ink-700">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-400 hover:text-ink"
              aria-label="Dismiss"
            >
              <Close className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
