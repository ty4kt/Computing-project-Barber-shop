import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to call the API and validate the token
  const checkAuthStatus = async (calledWhere = "self") => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/auth/validate-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Check if the token was valid
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.isValid);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("authToken");
        }
      } catch (error) {
        console.error("Error validating auth token", error);
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsAuthenticated(!!token);
    checkAuthStatus().finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
