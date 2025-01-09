import React from "react";
import "../styles/custom-modal.css";

const OrderDetailModal = ({ showModal, onClose, selectedOrder }) => {
  if (!showModal || !selectedOrder) return null; // Không hiển thị nếu không có dữ liệu

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay-custom" onClick={onClose}></div>

      {/* Nội dung modal */}
      <div className="modal-container-custom">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Nội dung chi tiết đơn hàng */}
        <div className="space-y-4">
          {/* Thông tin chung về đơn hàng */}
          <div className="space-y-2">
            <p>
              <strong>Order ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>User:</strong> {selectedOrder.userId?.username || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.userId?.email || "N/A"}
            </p>
            <p>
              <strong>Total:</strong> ${selectedOrder.total.toFixed(2)}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Payment Status:</strong> {selectedOrder.paymentStatus}
            </p>
            <p>
              <strong>Delivery Method:</strong> {selectedOrder.deliveryMethod}
            </p>
          </div>

          {/* Địa chỉ giao hàng */}
          <div>
            <h3 className="text-lg font-semibold">Delivery Address</h3>
            <p>{selectedOrder.address.street},</p>
            <p>{selectedOrder.address.commune}, {selectedOrder.address.district},</p>
            <p>{selectedOrder.address.province}</p>
          </div>

          {/* Danh sách sản phẩm */}
          <div>
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="list-disc pl-5">
              {selectedOrder.products.map((product, index) => (
                <li key={index}>
                  <strong>{product.productId?.name || "Product"}</strong> - {product.size}, Quantity: {product.quantity}, Price: ${product.price.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Nút đóng */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal;
