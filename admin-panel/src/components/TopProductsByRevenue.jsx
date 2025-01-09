import React, { useState, useEffect } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import { Dropdown } from "flowbite-react";

const TopProductsByRevenue = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [timeframe, setTimeframe] = useState("week"); // Khoảng thời gian
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `http://localhost:5000/orders/report/top-products?timeframe=${timeframe}`,
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

        // Thêm tính toán tổng số lượng mua từ dữ liệu API
        const processedData = data.map((product) => ({
          productName: product.productName,
          totalRevenue: product.totalRevenue,
          totalPurchase: product.totalPurchase,
        }));

        setTopProducts(processedData);
      } catch (err) {
        console.error("Error fetching top products by revenue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, [timeframe]);

  return (
    <div className="rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Top Products by Revenue
        </h3>
        <Dropdown
          inline
          label={`Timeframe: ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}`}
        >
          <Dropdown.Item onClick={() => setTimeframe("day")}>Day</Dropdown.Item>
          <Dropdown.Item onClick={() => setTimeframe("week")}>Week</Dropdown.Item>
          <Dropdown.Item onClick={() => setTimeframe("month")}>Month</Dropdown.Item>
        </Dropdown>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Biểu đồ */}
          <BarChart
            width={600}
            height={300}
            data={topProducts.map((product) => ({
              name: product.productName,
              revenue: product.totalRevenue,
            }))}
          >
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#8884d8" />
          </BarChart>

          {/* Bảng hiển thị */}
          <table className="table-auto w-full mt-6 text-left border-collapse border border-gray-200 dark:border-gray-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Product Name
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Revenue
                </th>
                <th className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                  Total Purchase
                </th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((product) => (
                <tr key={product.productName}>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {product.productName}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    ${product.totalRevenue.toLocaleString()}
                  </td>
                  <td className="border border-gray-200 dark:border-gray-700 px-4 py-2">
                    {product.totalPurchase}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default TopProductsByRevenue;
