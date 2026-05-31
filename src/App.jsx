import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import Transactions from "./pages/transactions/Transactions";
import Categories from "./pages/categories/Categories";
import Statistics from "./pages/statistics/Statistics";
import Profile from "./pages/profile/Profile";
import RoutesLayout from "./layout/RoutesLayout";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<RoutesLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/transaction" element={<Transactions />} />
          <Route path="/dashboard/categories" element={<Categories />} />
          <Route path="/dashboard/statistics" element={<Statistics />} />
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
