const TOKEN_KEY = "token";
const REMEMBER_KEY = "remember_me";
const ROLE_KEY = "account_role";

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const setAuthToken = (token, rememberMe = false) => {
  if (!token) return;

  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(REMEMBER_KEY, "true");
    sessionStorage.removeItem(TOKEN_KEY);
  } else {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REMEMBER_KEY);
  }
};

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  localStorage.removeItem(ROLE_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(ROLE_KEY);
};

const decodeJwtPayload = (token) => {
  try {
    const payload = token?.split(".")?.[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const setAuthRole = (role, rememberMe = false) => {
  const normalized = String(role || "").toLowerCase();
  if (!normalized) return;

  if (rememberMe) {
    localStorage.setItem(ROLE_KEY, normalized);
    sessionStorage.removeItem(ROLE_KEY);
    return;
  }

  sessionStorage.setItem(ROLE_KEY, normalized);
  localStorage.removeItem(ROLE_KEY);
};

export const getAuthRole = () => {
  const storedRole =
    localStorage.getItem(ROLE_KEY) || sessionStorage.getItem(ROLE_KEY);
  if (storedRole) return storedRole;

  const token = getAuthToken();
  const payload = decodeJwtPayload(token);
  const claim =
    payload?.account_type || payload?.role || payload?.user?.account_type;
  return claim ? String(claim).toLowerCase() : null;
};
