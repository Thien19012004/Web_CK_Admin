import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar"; // Import Navbar
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import LoginForm from "./components/LoginForm";

// Protected Route để kiểm tra trạng thái đăng nhập
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // Kiểm tra token
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token); // Nếu có token, xác định là đã đăng nhập
  }, []);

  return (
    <Router>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        {/* Navbar */}
        {isAuthenticated && <Navbar />}

        {/* Bố trí Sidebar và nội dung */}
        <div style={{ display: "flex", flex: 1, marginTop: isAuthenticated ? "60px" : "0" }}>
          {/* Sidebar */}
          {isAuthenticated && (
            <div style={{ width: "250px", position: "fixed", top: "60px", left: 0 }}>
              <Sidebar />
            </div>
          )}

          {/* Nội dung chính */}
          <div
            style={{
              flex: 1,
              marginLeft: isAuthenticated ? "250px" : "0",
              marginTop: 20,
            }}
          >
            <Routes>
              {/* Trang chính hướng về Login */}
              <Route path="/" element={<Navigate to="/dashboard" />} />

              {/* Đăng nhập và Đăng ký */}
              <Route path="/login" element={<LoginForm setIsAuthenticated={setIsAuthenticated} />} />

              {/* Các trang yêu cầu đăng nhập */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <Orders />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
