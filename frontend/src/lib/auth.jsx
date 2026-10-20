import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api, setAuthToken, setUnauthorizedHandler } from "../api";
import { useToast } from "../components/ui/Toast";

const KEY = "mcq-admin-token";

const readToken = () => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

const writeToken = (token) => {
  try {
    if (token) window.localStorage.setItem(KEY, token);
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: the session just won't survive a reload.
  }
};

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const [admin, setAdmin] = useState(null);
  // checking | signedIn | signedOut
  const [status, setStatus] = useState(() => (readToken() ? "checking" : "signedOut"));

  const clearSession = useCallback(() => {
    writeToken(null);
    setAuthToken(null);
    setAdmin(null);
    setStatus("signedOut");
  }, []);

  // Validate a token left over from a previous visit.
  useEffect(() => {
    const token = readToken();
    if (!token) return;
    setAuthToken(token);
    api
      .me()
      .then((me) => {
        setAdmin(me);
        setStatus("signedIn");
      })
      .catch(clearSession);
  }, [clearSession]);

  useEffect(() => {
    setUnauthorizedHandler((message) => {
      clearSession();
      toast(message || "Your session has ended. Please sign in again.", "error");
    });
  }, [clearSession, toast]);

  const login = useCallback(async (email, password) => {
    const { token, admin: me } = await api.login({ email, password });
    writeToken(token);
    setAuthToken(token);
    setAdmin(me);
    setStatus("signedIn");
    return me;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    toast("Signed out");
  }, [clearSession, toast]);

  const value = useMemo(
    () => ({ admin, status, login, logout }),
    [admin, status, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
