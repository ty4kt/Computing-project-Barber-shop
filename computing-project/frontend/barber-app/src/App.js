import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Logout from "./pages/Logout";
import AccountSetup from "./pages/AccountSetup";
import Main from "./pages/Main";
import Chat from "./pages/Chat";
import Menu from "./pages/Menu";
import { AuthProvider } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import ProtectedRoute from "./components/ProtectedRoute";

// tailwind
import "./App.css";
import "./tailwind.css";
import BarberSetup from "./pages/BarberSetup";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Define other routes */}
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/logout" element={<Logout />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Main />} />
              <Route path="/account-setup" element={<AccountSetup />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/barber-setup" element={<BarberSetup />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
