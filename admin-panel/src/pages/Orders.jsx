import React, { useState, useEffect } from "react";
import axios from "axios";
import OrderDetailModal from "../components/OrderDetailModal"; // Import modal

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null); // Chọn đơn hàng để xem chi tiết
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/orders", {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: filterStatus },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  },[filterStatus]);

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
        `http://localhost:5000/orders/${orderId}/status`,
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
  

  return (
    <div className="p-6 mt-11">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      {/* Filter by status */}
      <select
        className="mb-4 p-2 border rounded"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
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
    <th className="border p-2">Order Date</th> {/* Thêm cột */}
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
      <td className="border p-2">{new Date(order.date).toLocaleString()}</td> {/* Hiển thị thời gian */}
      <td className="border p-2">
  <select
    value={order.status}
    onChange={(e) => handleStatusChange(order._id, e.target.value)}
    className={`px-2 py-1 rounded text-white ${
      order.status === "Delivered"
        ? "bg-green-500"
        : order.status === "Processing"
        ? "bg-yellow-500"
        : "bg-gray-500"
    }`}
  >
    <option value="Pending">Pending</option>
    <option value="Processing">Processing</option>
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
