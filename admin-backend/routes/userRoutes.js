const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
} = require('../controllers/userController.js');

// Lấy danh sách người dùng
router.get('/', getUsers);

// Xem chi tiết người dùng
router.get('/:id', getUserById);

// Cập nhật trạng thái người dùng
router.put('/:id/status', updateUserStatus);

// Xóa người dùng
router.delete('/:id', deleteUser);

module.exports = router;
