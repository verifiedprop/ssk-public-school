import type { AuthUser, UserRole } from "@/types/school";
import { useEffect, useState } from "react";

// Mock auth state for now — replace with real canister call in Phase 2
const STORAGE_KEY = "ssk_auth_user";

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

// ─── Module-level singleton ──────────────────────────────────────────────────
// All components share the same auth state. No race conditions between
// the login page writing state and portal pages reading it.

type Listener = () => void;
const listeners = new Set<Listener>();
let _currentUser: AuthUser | null = readStoredUser();

function setUser(user: AuthUser | null) {
  _currentUser = user;
  // Notify every mounted component that uses useAuth
  for (const cb of listeners) cb();
}

// ─── Initialized flag ───────────────────────────────────────────────────────
// Prevents portal guards from redirecting before localStorage has been read.
let _initialized = false;

export function isInitialized() {
  return _initialized;
}

export function useAuth() {
  const [, rerender] = useState(0);

  useEffect(() => {
    const trigger = () => rerender((n) => n + 1);
    listeners.add(trigger);
    // Mark initialized on first mount so portals know auth has been read
    if (!_initialized) {
      _initialized = true;
      // Re-read from storage in case it was set before React hydrated
      const stored = readStoredUser();
      if (stored && !_currentUser) {
        _currentUser = stored;
      }
    }
    return () => {
      listeners.delete(trigger);
    };
  }, []);

  const login = (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const currentUser = _currentUser;

  const isAdmin =
    currentUser?.role === "super_admin" ||
    currentUser?.role === "principal" ||
    currentUser?.role === "accountant" ||
    currentUser?.role === "admission_counsellor";

  const hasRole = (role: UserRole) => currentUser?.role === role;

  return {
    currentUser,
    role: currentUser?.role ?? null,
    isAdmin,
    isAuthenticated: currentUser !== null,
    initialized: _initialized,
    login,
    logout,
    hasRole,
  };
}
