import React from "react";
import { Navbar, Dropdown } from "flowbite-react";
import { NavLink } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const CustomNavbar = () => {
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser({
      username: "Admin",
      avatar: "",
    });
    window.location.href = "/login";
  };

  return (
    <Navbar fluid className="shadow-lg bg-white fixed top-0 left-0 w-full z-50">
      <div className="w-full p-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Navbar.Brand as={NavLink} to="/">
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
            <img
              src={user.avatar || "/images/default-avatar.png"} // Avatar mặc định nếu không có
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <Dropdown label={user.username} inline>
              <Dropdown.Item as={NavLink} to="/profile">
                Edit Profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </div>
    </Navbar>
  );
};

export default CustomNavbar;
