import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailModal from "../components/OrderDetailModal"; // Import modal
import { getBaseUrl } from "../utils/getBaseUrl";
import { Button } from "flowbite-react";
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // Chọn đơn hàng để xem chi tiết
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Tổng số trang
  const [limit] = useState(5); // Số lượng đơn hàng trên mỗi trang

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${getBaseUrl()}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            status: filterStatus,
            page: currentPage,
            limit,
          },
        });
        setOrders(res.data.orders);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [filterStatus, currentPage, limit]);

  // Hiển thị modal
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${getBaseUrl()}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật trạng thái trong danh sách đơn hàng
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated successfully!");
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Failed to update order status.");
    }
  };

  const handleUpdateStatus = async (orderId) => {
    await handleStatusChange(orderId, "Delivered");
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-6 mt-11">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Filter by status */}
      <select
        className="mb-4 p-2 border rounded"
        value={filterStatus}
        onChange={(e) => {
          setFilterStatus(e.target.value);
          setCurrentPage(1); // Reset về trang đầu khi thay đổi bộ lọc
        }}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Canceled</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>

      {/* Orders Table */}
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">User</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Order Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>
              <td className="border p-2">{order.userId?.username}</td>
              <td className="border p-2">${order.total.toFixed(2)}</td>
              <td className="border p-2">
                {new Date(order.date).toLocaleString()}
              </td>
              <td className="border p-2">
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`px-2 py-1 rounded text-white ${
                    order.status === "Delivered"
                      ? "bg-green-600 text-green-300"
                      : order.status === "Canceled"
                      ? "bg-red-900 text-red-500"
                      : order.status === "Shipped"
                      ? "bg-yellow-500"
                      : order.status === "Pending"
                      ? "bg-blue-900 text-blue-500"
                      : "bg-red-900"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Canceled</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleViewDetail(order)}
                  className="text-blue-500"
                >
                  View
                </button>
                {order.status !== "Delivered" && (
                  <button
                    onClick={() => handleUpdateStatus(order._id)}
                    className="text-green-500"
                  >
                    Mark as Delivered
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        {/* Hiển thị số trang */}
  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
    <button
    key={page}
    onClick={() => handlePageChange(page)}
    className={`px-4 py-2 ${
      currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"
    } rounded`}
  >
    {page}
  </button>
  ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <OrderDetailModal
        showModal={showModal}
        onClose={handleCloseModal}
        selectedOrder={selectedOrder}
      />
    </div>
  );
};

export default Orders;
