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

  const [filters, setFilters] = useState({ name: "", email: "" });
  const [sort, setSort] = useState({ field: "username", order: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [currentUserId, setCurrentUserId] = useState(""); // ID của người dùng hiện tại


  // Tải danh sách người dùng
  const loadUsers = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: 2,
        ...(filters.name && { name: filters.name }), // Lọc theo tên
        ...(filters.email && { email: filters.email }), // Lọc theo email
        ...(sort.field && { sortField: sort.field }), // Sắp xếp theo trường
        ...(sort.order && { sortOrder: sort.order }), // Thứ tự sắp xếp
      }).toString();
  
      const { data } = await fetchUsers(query);
  
      // Cập nhật dữ liệu
      setUsers(data.users || []);
      setCurrentPage(data.currentPage || 1);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Giả sử token lưu trong localStorage và chứa ID của người dùng
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã token để lấy thông tin
    setCurrentUserId(payload.id); // Lưu ID của người dùng hiện tại
  }
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

     // Kiểm tra nếu user hiện tại trùng với user đang đăng nhập
  if (user._id === currentUserId) {
    alert("Bạn không thể ban chính mình!");
    return;
  }

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
    // Kiểm tra nếu user hiện tại trùng với user đang đăng nhập
  if (user._id === currentUserId) {
    alert("Bạn không thể xóa chính mình!");
    return;
  }
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

  // **Chuyển trang**
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadUsers(page);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      <div className="flex gap-4 mb-4">
  {/* Filter by Name */}
  <input
    type="text"
    placeholder="Filter by name"
    value={filters.name}
    onChange={(e) => setFilters({ ...filters, name: e.target.value })}
    className="border p-2 rounded"
  />

  {/* Filter by Email */}
  <input
    type="text"
    placeholder="Filter by email"
    value={filters.email}
    onChange={(e) => setFilters({ ...filters, email: e.target.value })}
    className="border p-2 rounded"
  />
  <Button color =  "blue" onClick={() => loadUsers(1)}>Apply Filters</Button>
</div>

<div className="flex gap-4 mb-4">
  <select
    value={sort.field}
    onChange={(e) => setSort({ ...sort, field: e.target.value })}
    className="border p-2 rounded"
  >
    <option value="username">Sort by Name</option>
    <option value="email">Sort by Email</option>
    <option value="registrationDate">Sort by Registration Date</option>
  </select>

  <select
    value={sort.order}
    onChange={(e) => setSort({ ...sort, order: e.target.value })}
    className="border p-2 rounded"
  >
    <option value="asc">Ascending</option>
    <option value="desc">Descending</option>
  </select>
  <Button color = "blue" onClick={() => loadUsers(1)}>Sort</Button>
</div>

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

      {/* Kiểm tra nếu không phải tài khoản đang đăng nhập thì hiển thị nút Ban/Unban và Delete */}
      {user._id !== currentUserId && (
        <>
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
        </>
      )}
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
      <div className="flex justify-center mt-6">
  <Button color = "blue" onClick={() => loadUsers(currentPage - 1)} disabled={currentPage === 1} className="mx-1">
    Prev
  </Button>
  {Array.from({ length: totalPages }, (_, index) => (
    <Button
      key={index}
      onClick={() => loadUsers(index + 1)}
      className={currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}
    >
      {index + 1}
    </Button>
  ))}
  <Button color = "blue" onClick={() => loadUsers(currentPage + 1)} disabled={currentPage === totalPages} className="mx-1">
    Next
  </Button>
</div>

    </div>

    
  );
};

export default Users;
