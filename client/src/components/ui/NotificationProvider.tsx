import type React from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type Notification = {
  id: string;
  message: string;
  type?: "success" | "error";
  timeout?: number;
};

const NotificationContext = createContext<{
  notify: (
    message: string,
    type?: "success" | "error",
    timeout?: number,
  ) => void;
}>({
  notify: () => {},
});

const createNotificationId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timeoutsRef = useRef<Set<number>>(new Set());

  const dismiss = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const notify = (
    message: string,
    type: "success" | "error" = "success",
    timeout = 5000,
  ) => {
    const id = createNotificationId();
    setNotifications((prev) => [{ id, message, type, timeout }, ...prev]);

    if (timeout > 0) {
      const timeoutId = window.setTimeout(() => {
        timeoutsRef.current.delete(timeoutId);
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id),
        );
      }, timeout);

      timeoutsRef.current.add(timeoutId);
    }
  };

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      timeoutsRef.current.clear();
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notifications.length > 0 && (
        <div
          aria-live="polite"
          className="fixed top-4 left-1/2 z-100 flex w-full max-w-md -translate-x-1/2 flex-col gap-3 px-4"
        >
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start gap-3 rounded px-4 py-2 text-white shadow ${
                notification.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <span className="flex-1">{notification.message}</span>
              <button
                type="button"
                onClick={() => dismiss(notification.id)}
                aria-label="Dismiss notification"
                className="text-white/80 hover:text-white focus:outline-none leading-none"
              >
                <span className="material-icons text-base align-middle">
                  close
                </span>
              </button>
            </div>
          ))}
        </div>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

export default NotificationProvider;
