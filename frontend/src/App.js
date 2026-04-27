import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Movimentacoes from "./pages/Movimentacoes";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("nexbiz_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/movimentacoes"
          element={
            <PrivateRoute>
              <Movimentacoes />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}