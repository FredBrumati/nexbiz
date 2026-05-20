import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Movimentacoes from "./pages/Movimentacoes";
import Categorias from "./pages/Categorias";
import Relatorios from "./pages/Relatorios";
import Insights from "./pages/Insights";
import FloatingGroqChat from "./components/FloatingGroqChat";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("nexbiz_token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {children}
      <FloatingGroqChat />
    </>
  );
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

        <Route
          path="/categorias"
          element={
            <PrivateRoute>
              <Categorias />
            </PrivateRoute>
          }
        />

        <Route
          path="/relatorios"
          element={
            <PrivateRoute>
              <Relatorios />
            </PrivateRoute>
          }
        />

        <Route
          path="/insights"
          element={
            <PrivateRoute>
              <Insights />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}