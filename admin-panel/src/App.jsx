import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Users from "./pages/Users";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Profile from "./pages/Profile";

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
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Chỉ hiển thị Sidebar nếu đã đăng nhập */}
        
        <div style={{ flex: 1, padding: "0px", overflowY: "auto" }}>
          <Routes>
            {/* Trang chính hướng về Login */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />


            {/* Đăng nhập và Đăng ký */}
            <Route path="/login" element={isAuthenticated?<Sidebar />&&<LoginForm />:<LoginForm/>} />
            <Route path="/register" element={<RegisterForm />} />

            {/* Các trang yêu cầu đăng nhập */}
            <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div className="div1" style={{ display: "flex", height: "100vh", padding: "0px", margin: "0px" }}>
                      {/* Sidebar chiếm một phần cố định bên trái */}
                      <div style={{ width: "250px", flexShrink: 0 }}>
                        <Sidebar />
                      </div>
                      
                      {/* Dashboard chiếm phần còn lại */}
                      <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                        <Dashboard />
                      </div>
                    </div>
                  </ProtectedRoute>
                }
              />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <div className="div1" style={{ display: "flex", height: "100vh", padding: "0px", margin: "0px" }}>
                      {/* Sidebar chiếm một phần cố định bên trái */}
                      <div style={{ width: "250px", flexShrink: 0 }}>
                        <Sidebar />
                      </div>
                      
                      {/* Dashboard chiếm phần còn lại */}
                      <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                        <Products />
                      </div>
                    </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <div className="div1" style={{ display: "flex", height: "100vh", padding: "0px", margin: "0px" }}>
                      {/* Sidebar chiếm một phần cố định bên trái */}
                      <div style={{ width: "250px", flexShrink: 0 }}>
                        <Sidebar />
                      </div>
                      
                      {/* Dashboard chiếm phần còn lại */}
                      <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                        <Users />
                      </div>
                    </div>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <div className="div1" style={{ display: "flex", height: "100vh", padding: "0px", margin: "0px" }}>
                      {/* Sidebar chiếm một phần cố định bên trái */}
                      <div style={{ width: "250px", flexShrink: 0 }}>
                        <Sidebar />
                      </div>
                      
                      {/* Dashboard chiếm phần còn lại */}
                      <div style={{ flexGrow: 1, padding: "20px", overflowY: "auto" }}>
                        <Profile />
                      </div>
                    </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
