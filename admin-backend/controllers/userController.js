const User = require('../models/User');

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    // Nhận query từ client
    const page = parseInt(req.query.page) || 1; // Trang hiện tại (mặc định là 1)
    const limit = parseInt(req.query.limit) || 5; // Số lượng bản ghi mỗi trang (mặc định là 5)
    const sortField = req.query.sortField || "username"; // Trường để sắp xếp
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1; // Thứ tự sắp xếp
    const nameFilter = req.query.name || ""; // Lọc theo tên
    const emailFilter = req.query.email || ""; // Lọc theo email

    // Tạo điều kiện lọc
    const filter = {};
    if (nameFilter) {
      filter.username = { $regex: nameFilter, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }
    if (emailFilter) {
      filter.email = { $regex: emailFilter, $options: "i" };
    }

    // Đếm tổng số bản ghi
    const totalUsers = await User.countDocuments(filter);

    // Lấy danh sách theo trang
    const users = await User.find(filter)
      .sort({ [sortField]: sortOrder }) // Sắp xếp
      .skip((page - 1) * limit) // Bỏ qua các bản ghi trước đó
      .limit(limit); // Giới hạn số lượng bản ghi trả về

    // Trả về kết quả
    res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};


// Xem chi tiết người dùng
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // Ẩn password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Cập nhật trạng thái người dùng (active/inactive)
const updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body; // Nhận trạng thái mới từ body
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status' });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
