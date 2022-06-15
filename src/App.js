import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import Feed from "./Components/Home/Feed/Feed";
import Login from "./Components/Login/Login";
import Register from "./Components/Login/Register";
import LoginProtectedRoute from "./Components/ProtectedRoutes/LoginProtectedRoute";
import ProtectedRoute from "./Components/ProtectedRoutes/ProtectedRoute";
import Reel from "./Components/Reels/Reels";
import SavedPost from "./Components/SavedPost/Savedpost";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Navigate to="/login" />}></Route>
        <Route element={<LoginProtectedRoute />}>
          <Route exact path="/login" element={<Login />}></Route>
          <Route exact path="/register" element={<Register />}></Route>
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/feeds" element={<Feed />}></Route>
          <Route exact path="/savedFeeds" element={<SavedPost />}></Route>
          <Route exact path="/videoReels" element={<Reel />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
