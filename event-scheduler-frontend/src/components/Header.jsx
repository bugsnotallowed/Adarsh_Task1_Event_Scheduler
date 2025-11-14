import React from "react";
import { removeToken, getToken } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Header({ onOpenSettings }) {
  const navigate = useNavigate();
  const logout = () => {
    removeToken();
    navigate("/login");
  };
  return (
    <header className="flex items-center justify-between p-4 bg-white shadow">
      <h1 className="text-lg font-semibold">Event Scheduler</h1>
      <div className="flex items-center space-x-3">
        <button className="px-3 py-1 text-sm bg-green-500 text-white rounded" onClick={onOpenSettings}>Working hours</button>
        <button className="px-3 py-1 text-sm bg-red-500 text-white rounded" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
