import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { authApi, usersApi } from "../lib/api.js";
import { onUnauthorized, tokenStore } from "../lib/http.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [state, setState] = useState(() => ({
    status: tokenStore.get() ? "loading" : "anonymous", // loading | authenticated | anonymous
    user: null,
  }));

  // Restaura a sessão se houver token guardado.
  useEffect(() => {
    if (!tokenStore.get()) return undefined;
    let cancelled = false;
    usersApi
      .me()
      .then((user) => !cancelled && setState({ status: "authenticated", user }))
      .catch(() => {
        if (cancelled) return;
        tokenStore.set(null);
        setState({ status: "anonymous", user: null });
      });
    return () => { cancelled = true; };
  }, []);

  // Token rejeitado pela API (expirado/inválido): volta para o login.
  useEffect(() => onUnauthorized(() => setState({ status: "anonymous", user: null })), []);

  const login = useCallback(async (email, password) => {
    const { token } = await authApi.login(email, password);
    tokenStore.set(token);
    try {
      const user = await usersApi.me();
      setState({ status: "authenticated", user });
    } catch (err) {
      tokenStore.set(null);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    tokenStore.set(null);
    setState({ status: "anonymous", user: null });
  }, []);

  const value = useMemo(() => ({ ...state, login, logout }), [state, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
