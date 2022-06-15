import React from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
// import Navbar from "../HomeNavbar/Navbar";

const ProtectedRoute = () => {
  const token = Cookies.get("token");
  return token ? (
    <>
      <div
        className="container-fluid"
        style={{ minHeight: "8vh", fontFamily: "Public-Sans" }}
      >
        <Navbar />
      </div>
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
