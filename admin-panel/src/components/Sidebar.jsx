import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import {
  HiChartPie,
  HiShoppingBag,
  HiUsers,
  HiClipboard,
  HiPencil,
  HiInformationCircle,
} from "react-icons/hi";
import { NavLink } from "react-router-dom";

const CustomSidebar = () => {
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setCurrentPage(window.location.pathname); // Lấy đường dẫn hiện tại
  }, []);

  return (
    <Sidebar aria-label="Custom Sidebar">
      <div className="flex h-full flex-col justify-between py-2">
        <div>
          <Sidebar.Items>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                as={NavLink}
                to="/"
                icon={HiChartPie}
                className={({ isActive }) =>
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                as={NavLink}
                to="/products"
                icon={HiShoppingBag}
                className={({ isActive }) =>
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Products
              </Sidebar.Item>
              <Sidebar.Item
                as={NavLink}
                to="/users"
                icon={HiUsers}
                className={({ isActive }) =>
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Users
              </Sidebar.Item>
              <Sidebar.Item
                as={NavLink}
                to="/orders"
                icon={HiClipboard}
                className={({ isActive }) =>
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Orders
              </Sidebar.Item>
              <Sidebar.Item
                as={NavLink}
                to="/profile"
                icon={HiPencil}
                className={({ isActive }) =>
                  isActive ? "bg-gray-100 dark:bg-gray-700" : ""
                }
              >
                Profile
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              {/* <Sidebar.Item
                as="a"
                href="https://github.com"
                icon={HiInformationCircle}
                target="_blank"
              >
                Help
              </Sidebar.Item> */}
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
