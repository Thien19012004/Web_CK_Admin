import React from "react";
import Chart from "react-apexcharts"; // Nếu chưa cài đặt: npm install react-apexcharts apexcharts

const SalesChart = ({ salesData, categories }) => {
  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
    },
    xaxis: {
      categories,
    },
    yaxis: {
      labels: {
        formatter: (value) => `$${value}`,
      },
    },
    stroke: { curve: "smooth" },
  };

  const series = [{ name: "Revenue", data: salesData }];

  return <Chart options={options} series={series} type="area" height={300} />;
};

export default SalesChart;
