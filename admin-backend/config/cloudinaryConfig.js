const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tạo bộ nhớ lưu trữ
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'products', // Thư mục lưu trữ trên Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg'], // Định dạng ảnh được phép
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };
