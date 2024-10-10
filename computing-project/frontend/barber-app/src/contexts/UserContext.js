import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";

const UserContext = createContext(null);

const urlWhitelist = ["/account-setup"];

export const UserProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const fetchUserData = async () => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("Auth token not found");
      return;
    }
    
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/api/me`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Handle error, e.g., navigate to login or logout
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated]);

  useEffect(() => {
    if (user && !urlWhitelist.includes(pathname) && (!user.location || !user.needs)) {
      navigate("/account-setup");
    }
  }, [user, pathname, navigate]);

  const contextValue = {
    user,
    setUser,
    isUserDataComplete: user && user.location && user.needs,
    refreshUserData: fetchUserData,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
