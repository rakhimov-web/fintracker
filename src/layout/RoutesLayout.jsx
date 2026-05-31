import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Aside from "./aside/Aside";

export default function RoutesLayout() {
  const isAuth = localStorage.getItem("isAuth") === "true";

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  const wrapper = {
    backgroundColor: "var(--color-white)",
    flex: 1,
    paddingLeft: "260px",
    paddingTop: "32px",
    paddingRight: "32px",
    paddingBottom: "32px",
    boxSizing: "border-box",
    minWidth: 0,
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        width: "100%",
        padding: "20px",
      }}
    >
      <Aside />

      <main style={wrapper}>
        <Outlet />
      </main>
    </div>
  );
}
