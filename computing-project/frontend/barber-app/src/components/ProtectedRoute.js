import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { user, isUserDataComplete, refreshUserData } = useUser();
  const location = useLocation();

  const urlWhitelist = ["/account-setup", "/signin"];
  const [fetchingUser, setFetchingUser] = useState(true); // Track user data fetching status

  useEffect(() => {
    if (isAuthenticated && !user) {
      refreshUserData().then(() => setFetchingUser(false)); // Stop fetching after the call
    } else {
      setFetchingUser(false); // Not authenticated or user already exists
    }
  }, [isAuthenticated, user, refreshUserData]);

  // Check if we're still fetching user data or if the authentication is loading
  if (isAuthLoading || fetchingUser) {
    return <div>Loading...</div>;
  }

  // Redirect logic
  if (!isAuthenticated && !urlWhitelist.includes(location.pathname)) {
    return <Navigate to="/signin" replace />;
  }

  if (!isUserDataComplete && !urlWhitelist.includes(location.pathname)) {
    return <Navigate to="/account-setup" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
