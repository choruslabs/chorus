import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

type Notification = {
  message: string;
  type?: "success" | "error";
  timeout?: number;
};

const NotificationContext = createContext<{ notify: (message: string, type?: "success" | "error", timeout?: number) => void }>({
  notify: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const timerRef = useRef<number>();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const dismiss = useCallback(() => {
    clearTimer();
    setNotification(null);
  }, [clearTimer]);

  useEffect(() => {
    clearTimer();
    if (notification) {
      const duration = notification.timeout ?? 5000;
      timerRef.current = window.setTimeout(() => setNotification(null), duration);
    }
    return clearTimer;
  }, [clearTimer, notification]);

  const notify = useCallback((message: string, type: "success" | "error" = "success", timeout = 5000) => {
    setNotification({ message, type, timeout });
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <div aria-live="polite" className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
          <div
            className={`px-4 py-2 rounded shadow text-white ${
              notification.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            <div className="flex items-start gap-3">
              <span>{notification.message}</span>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className="ml-auto text-white/80 hover:text-white focus:outline-none"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
