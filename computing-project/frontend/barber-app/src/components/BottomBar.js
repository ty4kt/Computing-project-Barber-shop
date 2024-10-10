import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const BottomBar = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navigateTo = (path) => () => {
    navigate(path);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-black text-white flex justify-evenly items-center p-4 max-w-xl mx-auto">
      <button
        onClick={navigateTo("/dashboard")}
        className={isActive("/dashboard") ? "text-blue-500" : ""}
      >
        <i className="fa-solid fa-house w-6 h-6"></i>
      </button>
      <button
        onClick={navigateTo("/chat")}
        className={isActive("/chat") ? "text-blue-500" : ""}
      >
        <i className="fa-solid fa-message w-6 h-6"></i>
      </button>
      <button
        onClick={navigateTo("/menu")}
        className={isActive("/menu") ? "text-blue-500" : ""}
      >
        <i className="fa-solid fa-user w-6 h-6"></i>
      </button>
    </div>
  );
};

export default BottomBar;
