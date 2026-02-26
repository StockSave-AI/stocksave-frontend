import { useState } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../../utils/authStorage";
import { AuthContext } from "./authContextStore";

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAuthToken());

  const saveToken = (newToken, rememberMe = false) => {
    setToken(newToken);
    if (newToken) {
      setAuthToken(newToken, rememberMe);
    } else {
      clearAuthToken();
    }
  };

  return (
    <AuthContext.Provider value={{ token, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};
