import React, { useEffect, useState } from "react";
import { Navbar, Dropdown } from "flowbite-react";
import axios from "axios";
const CustomNavbar = () => {
  const [user, setUser] = useState({ username: "Admin", avatar: null });

//   useEffect(() => {
//     const fetchUserInfo = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (token) {
//           const res = await axios.get('http://localhost:5000/profile', {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             withCredentials: true, // Nếu server yêu cầu cookie
//           });
  
//           setUser({
//             username: res.data.username || '',
//             avatar: res.data.avatar || 'https://via.placeholder.com/40?text=Avatar', // Avatar mặc định nếu không có
//             email: res.data.email || '',
//             role: res.data.role || 'user',
//             registrationDate: res.data.registrationDate || 'N/A',
//           });
//         }
//       } catch (error) {
//         console.error('Error fetching user info:', error);
//       }
//     };
  
//     fetchUserInfo();
//   }, []);
  

  const handleLogout = () => {
    localStorage.removeItem("token"); // Xóa token để logout
    window.location.href = "/login"; // Chuyển hướng đến trang login
  };

  const handleEditProfile = () => {
    window.location.href = "/profile"; // Chuyển đến trang chỉnh sửa profile
  };

  return (
    <Navbar fluid className="shadow-lg bg-white fixed top-0 left-0 w-full z-50">
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Navbar.Brand href="/">
            <img
              alt="Logo"
              src="/images/logo.svg"
              className="mr-3 h-6 sm:h-8"
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold text-gray-800">
              AdminPanel
            </span>
          </Navbar.Brand>

          {/* Admin Dropdown */}
          <div className="flex items-center gap-3">
            {/* <img
              src={
                "https://via.placeholder.com/40?text=Avatar" // Placeholder nếu không có ảnh
              }
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            /> */}
            <Dropdown label={`Admin`} inline>
              <Dropdown.Item onClick={handleEditProfile}>Edit Profile</Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
