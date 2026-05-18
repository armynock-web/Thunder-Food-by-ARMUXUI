"use client";

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import { X, CheckCircle, AlertCircle, Info, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationType = "success" | "error" | "info" | "cart";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

// Synthesize dynamic premium chimes based on notification category
const playNotificationSound = (type: NotificationType) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();

    if (type === "success" || type === "cart") {
      // First note (warm D5 tone)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gain1.gain.setValueAtTime(0, audioCtx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.04);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);
      
      // Second note (crystal A5 chime)
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08); // A5
      gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.08);
      gain2.gain.linearRampToValueAtTime(0.1, audioCtx.currentTime + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.45);
      
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.3);
      osc2.start(audioCtx.currentTime + 0.08);
      osc2.stop(audioCtx.currentTime + 0.5);
    } else if (type === "error") {
      // Error: two quick descending warning tones (F3 -> D#3)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(174.61, audioCtx.currentTime); // F3
      gain1.gain.setValueAtTime(0, audioCtx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.05);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.25);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(155.56, audioCtx.currentTime + 0.12); // D#3
      gain2.gain.setValueAtTime(0, audioCtx.currentTime + 0.12);
      gain2.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.17);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.38);

      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.25);
      osc2.start(audioCtx.currentTime + 0.12);
      osc2.stop(audioCtx.currentTime + 0.4);
    } else {
      // Info: Soft warm crystal single chime (E5)
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.4);
    }
  } catch (e) {
    console.error("Audio Context playback failed:", e);
  }
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback(
    (notification: Omit<Notification, "id">) => {
      // Trigger dynamic chimes instantly
      playNotificationSound(notification.type);

      const id = Math.random().toString(36).substr(2, 9);
      setNotifications((prev) => [...prev, { ...notification, id }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, notification.duration || 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-[100] space-y-3 pointer-events-none">
        {notifications.map((notification) => (
          <div key={notification.id} className="pointer-events-auto">
            <NotificationToast
              notification={notification}
              onClose={() => removeNotification(notification.id)}
            />
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

function NotificationToast({
  notification,
  onClose,
}: {
  notification: Notification;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    cart: ShoppingBag,
  };

  const colors = {
    success: "bg-green-500 text-white shadow-green-200",
    error: "bg-red-500 text-white shadow-red-200",
    info: "bg-blue-500 text-white shadow-blue-200",
    cart: "bg-[#ffd709] text-gray-900 shadow-yellow-200",
  };

  const Icon = icons[notification.type];

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-2xl transition-all duration-300 transform",
        isVisible ? "translate-y-0 scale-100 opacity-100" : "-translate-y-4 scale-95 opacity-0"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-md",
          colors[notification.type]
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0 font-thai">
        <p className="font-black text-gray-900 text-sm leading-tight font-thai">{notification.title}</p>
        {notification.message && (
          <p className="text-xs text-gray-500 mt-1 font-medium font-thai leading-snug">
            {notification.message}
          </p>
        )}
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors clickable"
      >
        <X className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
}
