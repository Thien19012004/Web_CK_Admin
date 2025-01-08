import React from "react";
import "../styles/custom-modal.css";

const UserDetailModal = ({ showModal, onClose, selectedUser }) => {
  if (!showModal) return null; // Không hiển thị modal nếu showModal là false

  return (
    <>
      {/* Overlay */}
      <div
        className="modal-overlay-custom"
        onClick={onClose} // Đóng khi click ra ngoài
      ></div>

      {/* Nội dung modal */}
      <div className="modal-container-custom">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Nội dung chi tiết người dùng */}
        {selectedUser && (
          <div className="space-y-4">
            {/* Ảnh đại diện */}
              <div className="flex justify-center items-center">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center">
                  <img
                    src={
                      selectedUser.avatar || "/default-avatar.png" // Avatar mặc định
                    }
                    alt="User Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            {/* Thông tin người dùng */}
            <div className="space-y-2">
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {selectedUser.role}
              </p>
              <p>
                <strong>Status:</strong> {selectedUser.status}
              </p>
              <p>
                <strong>Registered:</strong>{" "}
                {new Date(selectedUser.registrationDate).toLocaleString()}
              </p>
            </div>
          </div>
        )}

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

export default UserDetailModal;
