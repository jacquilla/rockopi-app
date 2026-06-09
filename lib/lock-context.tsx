"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

interface LockContextType {
  isLocked: boolean;
  lock: () => void;
  unlock: (pin: string) => boolean;
  wrongPinCount: number;
}

const LockContext = createContext<LockContextType>({
  isLocked: false,
  lock: () => {},
  unlock: () => false,
  wrongPinCount: 0,
});

export const useLock = () => useContext(LockContext);

const LOCK_KEY = "rockopi_lock";
const LAST_ACTIVE_KEY = "rockopi_last_active";
const PIN_KEY = "rockopi_cached_pin";
const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [wrongPinCount, setWrongPinCount] = useState(0);
  const [cachedPin, setCachedPin] = useState("");

  // Fetch PIN from Supabase
  const fetchPin = useCallback(async () => {
    try {
      const { data } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_pin")
        .maybeSingle();
      if (data?.value) {
        setCachedPin(data.value);
        localStorage.setItem(PIN_KEY, data.value);
      }
    } catch {
      const stored = localStorage.getItem(PIN_KEY);
      if (stored) setCachedPin(stored);
    }
  }, []);

  useEffect(() => {
    fetchPin();
  }, [fetchPin]);

  useEffect(() => {
    const wasLocked = localStorage.getItem(LOCK_KEY) === "true";
    if (wasLocked) {
      setIsLocked(true);
    } else {
      const hasUnlocked = localStorage.getItem(LOCK_KEY) === "false";
      setIsLocked(!hasUnlocked);
      if (!hasUnlocked) localStorage.setItem(LOCK_KEY, "true");
    }

    const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
    if (lastActive) {
      const elapsed = Date.now() - parseInt(lastActive, 10);
      if (elapsed > IDLE_TIMEOUT) {
        setIsLocked(true);
        localStorage.setItem(LOCK_KEY, "true");
      }
    }
  }, []);

  // Idle timeout tracker
  useEffect(() => {
    if (isLocked) return;

    const updateActivity = () => {
      localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
    };

    const checkIdle = () => {
      const lastActive = localStorage.getItem(LAST_ACTIVE_KEY);
      if (lastActive) {
        const elapsed = Date.now() - parseInt(lastActive, 10);
        if (elapsed > IDLE_TIMEOUT) {
          lock();
        }
      }
    };

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, updateActivity));

    updateActivity();
    const interval = setInterval(checkIdle, 30000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, updateActivity));
      clearInterval(interval);
    };
  }, [isLocked]);

  const lock = useCallback(() => {
    setIsLocked(true);
    setWrongPinCount(0);
    localStorage.setItem(LOCK_KEY, "true");
    localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
  }, []);

  const unlock = useCallback(
    (pin: string) => {
      const validPin = cachedPin || localStorage.getItem(PIN_KEY) || "123456";
      if (pin === validPin) {
        setIsLocked(false);
        setWrongPinCount(0);
        localStorage.setItem(LOCK_KEY, "false");
        localStorage.setItem(LAST_ACTIVE_KEY, Date.now().toString());
        return true;
      }
      setWrongPinCount((prev) => prev + 1);
      return false;
    },
    [cachedPin]
  );

  return (
    <LockContext.Provider value={{ isLocked, lock, unlock, wrongPinCount }}>
      {children}
    </LockContext.Provider>
  );
}
