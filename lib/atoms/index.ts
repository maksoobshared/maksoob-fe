import { atom, createStore } from "jotai";

export type Session = {
  id: number | string | null;
  email: string | null;
  name: string | null;
  token: string | null;
} | null;

const SESSION_STORAGE_KEY = "maksoob_session";

// sessionAtom holds the current session: { id, email, name, token } or null when signed out
export const sessionAtom = atom<Session>(null);

export const sessionStore = createStore();

export function setSession(session: Session) {
  if (typeof window !== "undefined") {
    persistSession(session);
  }
  sessionStore.set(sessionAtom, session);
}

export function clearSession() {
  if (typeof window !== "undefined") {
    persistSession(null);
  }
  sessionStore.set(sessionAtom, null);
}

export function getSession(): Session {
  return sessionStore.get(sessionAtom);
}

export function hydrateSessionFromStorage(): Session {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Session;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function persistSession(session: Session) {
  if (typeof window === "undefined") return;
  try {
    if (session) {
      window.localStorage.setItem(
        SESSION_STORAGE_KEY,
        JSON.stringify({
          id: session.id ?? null,
          email: session.email ?? null,
          name: session.name ?? null,
          token: session.token ?? null,
        })
      );
    } else {
      window.localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (e) {
    // ignore storage errors (private mode, quota, etc.)
  }
}

const atoms = {
  sessionAtom,
  setSession,
  clearSession,
  getSession,
  hydrateSessionFromStorage,
};

export default atoms;
