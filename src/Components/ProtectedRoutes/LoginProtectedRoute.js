import React from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";

const LoginProtectedRoute = () => {
  const token = Cookies.get("token");
  return token ? <Navigate to="/feeds" /> : <Outlet />;
};

export default LoginProtectedRoute;
