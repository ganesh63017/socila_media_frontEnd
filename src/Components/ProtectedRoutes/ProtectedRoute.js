import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const ProtectedRoute = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!document.cookie || localStorage.length === 0) navigate("/login");
      // console.log(document.cookie.split(";"));
    }, 2000);

    // Clean up the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
