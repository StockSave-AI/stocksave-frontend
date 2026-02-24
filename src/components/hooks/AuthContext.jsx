import { createContext, useContext, useState, useEffect } from "react";
import { clearAuthToken, getAuthToken, setAuthToken } from "../../utils/authStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = getAuthToken();
    if (storedToken) setToken(storedToken);
  }, []);

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

export const useAuth = () => useContext(AuthContext);
