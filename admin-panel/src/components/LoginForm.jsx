import React, { useState } from "react";
import { Label, TextInput, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Import UserContext
import axios from "axios";
import { loginUser } from "../services/api";
import { getBaseUrl } from "../utils/getBaseUrl";

const LoginForm = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(""); // State lưu email
  const [password, setPassword] = useState(""); // State lưu mật khẩu
  const [error, setError] = useState(""); // State lưu lỗi đăng nhập
  const navigate = useNavigate(); // Dùng để chuyển hướng
  const { setUser } = useUser(); // Lấy hàm setUser từ UserContext

  // Hàm xử lý đăng nhập
  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn hành vi mặc định của form
    try {
      // Gửi yêu cầu đăng nhập
      const res = await loginUser(email, password);
  
      // Nếu đăng nhập thành công
      if (res.data.success) {
        const token = res.data.token;
  
        // Lưu token vào localStorage
        localStorage.setItem("token", token);
  
        //console.log("Login response:", res.data);
  
        // Gọi API để lấy thông tin người dùng
        try {
          const userRes = await axios.get(`${getBaseUrl()}/api/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          console.log("User info response:", userRes.data);
  
          // Cập nhật thông tin người dùng trong Context
          setUser({
            username: userRes.data.username || "Admin",
            avatar: userRes.data.avatar || "",
            email: userRes.data.email || "",
            role: userRes.data.role || "user",
            registrationDate: userRes.data.registrationDate || "N/A",
          });
  
          // Cập nhật trạng thái đăng nhập
          setIsAuthenticated(true);
  
          // Chuyển hướng đến trang dashboard
          navigate("/dashboard", { replace: true });
        } catch (userError) {
          console.error("Failed to fetch user info:", userError);
          setError("Failed to fetch user info. Try again.");
        }
      } else {
        setError("Login failed. Invalid credentials.");
      }
    } catch (err) {
      // Xử lý lỗi đăng nhập
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };
  

  return (
    <div
      className="flex h-screen bg-cover bg-center bg-black"
      style={{
        backgroundImage: "url('/images/background_img.jpg')", // Đường dẫn ảnh từ thư mục public
      }}
    >
      {/* Form container */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-8 bg-red shadow-md bg-opacity-90">
        {/* Logo */}
        <div className="flex items-center mb-8 text-3xl font-bold text-gray-800">
          {/* <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-teal-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 9l-7 7-7-7"></path>
          </svg> */}
          ADMIN DASHBOARD
        </div>

        <h2 className="text-2xl font-semibold mb-6">Log in</h2>

        {/* Hiển thị lỗi */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full max-w-md">
          {/* Email Input */}
          <div className="mb-4">
            <Label htmlFor="email" value="Email address" />
            <TextInput
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <Label htmlFor="password" value="Password" />
            <TextInput
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-2"
            />
          </div>

          {/* Login Button */}
          <Button
            type="submit" // Đặt type là submit
            color="blue"
            className="w-full max-w-md mb-4"
          >
            LOGIN
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
