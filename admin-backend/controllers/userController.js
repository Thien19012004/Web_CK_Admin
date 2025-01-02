const User = require('../models/User');

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Không gửi password
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
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
