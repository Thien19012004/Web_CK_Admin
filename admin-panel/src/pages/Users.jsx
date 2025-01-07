import React, { useState, useEffect } from "react";
import { fetchUsers, deleteUser, updateUserStatus } from "../services/api";
import { Table, Button } from "flowbite-react";
import UserDetailModal from "../components/UserDetailModal";
import ModalConfirm from "../components/ModalConfirm"; // Modal xác nhận

const Users = () => {
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [loading, setLoading] = useState(false); // Trạng thái loading

  // Modal Chi Tiết Người Dùng
  const [selectedUser, setSelectedUser] = useState(null); // Người dùng được chọn
  const [showDetailModal, setShowDetailModal] = useState(false); // Trạng thái mở modal chi tiết

  // Modal Xác Nhận
  const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal xác nhận
  const [confirmTitle, setConfirmTitle] = useState(""); // Tiêu đề modal
  const [confirmMessage, setConfirmMessage] = useState(""); // Nội dung
  const [confirmAction, setConfirmAction] = useState(() => {}); // Hành động xác nhận

  // Tải danh sách người dùng
  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await fetchUsers(); // Gọi API
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(); // Tải dữ liệu khi component mount
  }, []);

  // **Xác nhận hành động**
  const handleConfirm = () => {
    confirmAction(); // Thực thi hành động đã lưu
    setShowConfirmModal(false); // Đóng modal
  };

  // **Ban/Unban người dùng**
  const handleToggleBan = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";

    try {
      await updateUserStatus(user._id, newStatus); // Cập nhật trạng thái
      loadUsers(); // Cập nhật danh sách sau khi thay đổi
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  // **Mở Modal Xác Nhận Ban/Unban**
  const openBanConfirmModal = (user) => {
    const action = () => handleToggleBan(user); // Hành động xác nhận
    const message = `Are you sure you want to ${
      user.status === "active" ? "ban" : "unban"
    } this user?`;

    setConfirmTitle(user.status === "active" ? "Confirm Ban" : "Confirm Unban");
    setConfirmMessage(message);
    setConfirmAction(() => action); // Đặt hành động
    setShowConfirmModal(true); // Hiển thị modal
  };

  // **Xóa người dùng**
  const handleDelete = async (user) => {
    try {
      await deleteUser(user._id); // Gọi API xóa người dùng
      loadUsers(); // Cập nhật danh sách
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  // **Mở Modal Xác Nhận Xóa**
  const openDeleteConfirmModal = (user) => {
    const action = () => handleDelete(user); // Hành động xác nhận
    const message = `Are you sure you want to delete this user (${user.username})?`;

    setConfirmTitle("Confirm Delete");
    setConfirmMessage(message);
    setConfirmAction(() => action); // Đặt hành động
    setShowConfirmModal(true); // Hiển thị modal
  };

  // **Xem chi tiết người dùng**
  const handleViewDetail = (user) => {
    setSelectedUser(user); // Chọn người dùng
    setShowDetailModal(true); // Hiển thị modal chi tiết
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Bảng danh sách người dùng */}
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Username</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Role</Table.HeadCell>
          <Table.HeadCell>Status</Table.HeadCell>
          <Table.HeadCell>Actions</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user) => (
            <Table.Row key={user._id}>
              <Table.Cell>{user.username}</Table.Cell>
              <Table.Cell>{user.email || "N/A"}</Table.Cell>
              <Table.Cell>{user.role}</Table.Cell>
              <Table.Cell>
                <span
                  className={`px-2 py-1 rounded text-white ${
                    user.status === "active" ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {user.status}
                </span>
              </Table.Cell>
              <Table.Cell className="flex space-x-2">
                {/* Xem chi tiết */}
                <Button color="blue" onClick={() => handleViewDetail(user)}>
                  View Detail
                </Button>

                {/* Ban/Unban */}
                <Button
                  color={user.status === "active" ? "warning" : "success"}
                  onClick={() => openBanConfirmModal(user)}
                >
                  {user.status === "active" ? "Ban" : "Unban"}
                </Button>

                {/* Xóa */}
                <Button
                  color="failure"
                  onClick={() => openDeleteConfirmModal(user)}
                >
                  Delete
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {/* Modal Chi Tiết Người Dùng */}
      <UserDetailModal
        showModal={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        selectedUser={selectedUser}
      />

      {/* Modal Xác Nhận */}
      <ModalConfirm
        show={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirm}
        title={confirmTitle}
        message={confirmMessage}
      />
    </div>
  );
};

export default Users;
