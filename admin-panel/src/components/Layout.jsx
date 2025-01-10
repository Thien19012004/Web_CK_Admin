import React from "react";
import Sidebar from "./Sidebar";
import CustomNavbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
    return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <div className="z-10">
          <Sidebar />
        </div>
        {/* Content */}
        <div className="flex flex-col flex-grow">
          {/* Navbar */}
          <div className="z-20">
            <CustomNavbar />
          </div>
          {/* Dynamic Content */}
          <div className="p-4 flex-grow overflow-auto bg-gray-100 mt-10">
            <Outlet />
          </div>
        </div>
      </div>
    );
  };

export default Layout;
