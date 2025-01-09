import React from "react";
import SalesThisWeek from "../components/SalesThisWeek"; // Import SalesThisWeek component
import TopProductsByRevenue from "../components/TopProductsByRevenue";
const Dashboard = () => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {/* Phần doanh thu trong tuần */}
      <div className="mb-6">
        <SalesThisWeek />
      </div>

      {/* Thêm các thành phần khác trong Dashboard nếu cần */}
      <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <h3 className="text-xl font-bold mb-4">Other Dashboard Statistics</h3>
        
      </div>
      <div className="mb-6">
        <TopProductsByRevenue />
      </div>
    </div>
  );
};

export default Dashboard;
