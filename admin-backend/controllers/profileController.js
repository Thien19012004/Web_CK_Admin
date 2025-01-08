const User = require('../models/User');
const { cloudinary } = require("../config/cloudinaryConfig");

// Lấy thông tin cá nhân
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        console.log('Dữ liệu người dùng:', user); // Log dữ liệu lấy từ DB
        res.json(user);
    } catch (err) {
        console.error('Lỗi server:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

// Cập nhật thông tin cá nhân
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('User ID:', userId);

        let avatarUrl = req.body.avatar || ''; // Avatar mặc định

        // Nếu có file ảnh được upload qua middleware uploadAvatar
        if (req.file) {
            console.log('File đã upload:', req.file); // Log file
            avatarUrl = req.file.path; // Middleware đã xử lý Cloudinary, lấy URL trực tiếp
            console.log('Avatar URL:', avatarUrl); // Log URL ảnh mới
        }

        // Cập nhật thông tin người dùng
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                username: req.body.username,
                email: req.body.email,
                avatar: avatarUrl
            },
            { new: true } // Trả về dữ liệu sau khi đã cập nhật
        );

        console.log('Updated User:', updatedUser);
        res.json(updatedUser);
    } catch (err) {
        console.error('Lỗi cập nhật:', err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};

