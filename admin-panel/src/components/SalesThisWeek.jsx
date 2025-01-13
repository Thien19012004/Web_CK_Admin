import React, { useState, useEffect } from "react";
import { Dropdown } from "flowbite-react";
import SalesChart from "./SalesChart";
import { getBaseUrl } from "../utils/getBaseUrl";
const SalesThisWeek = () => {
  const [salesData, setSalesData] = useState([]); // Doanh thu
  const [categories, setCategories] = useState([]); // Danh mục (ngày/tháng)
  const [totalSales, setTotalSales] = useState(0); // Tổng doanh thu
  const [timeframe, setTimeframe] = useState("week"); // Khoảng thời gian
  const [percentChange, setPercentChange] = useState(0); // Thay đổi phần trăm

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log(getBaseUrl())
        const res = await fetch(
          `${getBaseUrl()}/orders/report/sales-data?timeframe=${timeframe}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setSalesData(data.sales);
        setCategories(data.categories);
        setTotalSales(data.totalSales);

        // Tính phần trăm thay đổi (giả định có data cũ để tính toán)
        if (data.sales.length > 1) {
          const previousSales = data.sales[data.sales.length - 2] || 0;
          const currentSales = data.sales[data.sales.length - 1] || 0;
          setPercentChange(
            previousSales === 0
              ? 0
              : ((currentSales - previousSales) / previousSales) * 100
          );
        }
      } catch (err) {
        console.error("Error fetching sales data:", err);
      }
    };

    fetchSalesData();
  }, [timeframe]);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="shrink-0">
          <span className="text-2xl font-bold leading-none text-gray-900 dark:text-white sm:text-3xl">
            ${totalSales.toLocaleString()}
          </span>
          <h3 className="text-base font-normal text-gray-600 dark:text-gray-400">
            Sales ({timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})
          </h3>
        </div>
        {/* <div
          className={`flex flex-1 items-center justify-end text-base font-bold ${
            percentChange >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {percentChange >= 0 ? "+" : ""}
          {percentChange.toFixed(2)}%
        </div> */}
      </div>
      <SalesChart salesData={salesData} categories={categories} />
      <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
        <Dropdown
          inline
          label={`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`}
        >
          <Dropdown.Item onClick={() => setTimeframe("week")}>Week</Dropdown.Item>
          <Dropdown.Item onClick={() => setTimeframe("month")}>Month</Dropdown.Item>
          <Dropdown.Item onClick={() => setTimeframe("year")}>Year</Dropdown.Item>
        </Dropdown>
      </div>
    </div>
  );
};

export default SalesThisWeek;
