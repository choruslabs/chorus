import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type Notification = {
  message: string;
  type?: "success" | "error";
};

const NotificationContext = createContext<{ notify: (message: string, type?: "success" | "error", timeout?: number) => void }>({
  notify: () => {},
});

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    if (notification) {
      timer = window.setTimeout(() => setNotification(null), 5000);
    }
    return () => {
      if (timer) {
        window.clearTimeout(timer);
      }
    };
  }, [notification]);

  const notify = useCallback((message: string, type: "success" | "error" = "success", timeout = 5000) => {
    setNotification({ message, type });
    if (timeout !== 5000) {
      window.setTimeout(() => setNotification(null), timeout);
    }
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
            {notification.message}
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
