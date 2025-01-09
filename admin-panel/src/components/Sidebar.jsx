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
                href="/"
                icon={HiChartPie}
                className={currentPage === "/" ? "bg-gray-100 dark:bg-gray-700" : ""}
              >
                Dashboard
              </Sidebar.Item>
              <Sidebar.Item
                href="/products"
                icon={HiShoppingBag}
                className={currentPage === "/products" ? "bg-gray-100 dark:bg-gray-700" : ""}
              >
                Products
              </Sidebar.Item>
              <Sidebar.Item
                href="/users"
                icon={HiUsers}
                className={currentPage === "/users" ? "bg-gray-100 dark:bg-gray-700" : ""}
              >
                Users
              </Sidebar.Item>
              <Sidebar.Item
                href="/orders"
                icon={HiClipboard}
                className={currentPage === "/order" ? "bg-gray-100 dark:bg-gray-700" : ""}
              >
                Orders
              </Sidebar.Item>
              <Sidebar.Item
                href="/profile"
                icon={HiPencil}
                className={currentPage === "/profile" ? "bg-gray-100 dark:bg-gray-700" : ""}
              >
                Profile
              </Sidebar.Item>
            </Sidebar.ItemGroup>
            <Sidebar.ItemGroup>
              <Sidebar.Item
                href="https://github.com"
                icon={HiInformationCircle}
              >
                Help
              </Sidebar.Item>
            </Sidebar.ItemGroup>
          </Sidebar.Items>
        </div>
      </div>
    </Sidebar>
  );
};

export default CustomSidebar;
