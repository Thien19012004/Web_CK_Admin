const express = require('express');
const multer = require('multer');
const { getProfile, updateProfile } = require('../controllers/profileController');
const auth = require('../middleware/auth'); // Middleware xác thực
const { uploadAvatar } = require('../config/cloudinaryConfig'); // Import uploadAvatar

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Upload file tạm

// Định tuyến
router.get('/', auth, getProfile); // GET thông tin cá nhân
router.put('/', auth, uploadAvatar.single('avatar'), updateProfile);// PUT cập nhật thông tin

module.exports = router;
