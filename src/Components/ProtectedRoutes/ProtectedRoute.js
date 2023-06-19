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
    let timeoutId;

    function handleMouseMove() {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleTimeout, 10000); // Set the timeout to 30 seconds
    }

    function handleMouseStop() {
      clearTimeout(timeoutId);
    }

    function handleTimeout() {
      // Perform session timeout action here
      const Session = window.confirm(
        "The session seems to be timed out because you have not interacted with the application.Please confirm to Sign out"
      );
      if (Session) {
        // User clicked "OK", perform the action
        var cookies = Cookies.get();

        for (var cookie in cookies) {
          Cookies.remove(cookie);
        }
        localStorage.clear();
        navigate("/login");
      }
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseout", handleMouseStop);

    timeoutId = setTimeout(handleTimeout, 10000); // Initial timeout when the component mounts

    // Clean up the interval when the component unmounts
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseout", handleMouseStop);
      clearTimeout(timeoutId);
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
