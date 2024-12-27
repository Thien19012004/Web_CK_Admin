const mongoose = require('mongoose');
const Product = require('./models/Product'); // Đảm bảo đường dẫn đúng đến model
const connectDB = require('./config/db');

// Kết nối database
connectDB();

// Hàm cập nhật các trường mới
const updateFields = async () => {
  try {
    const result = await Product.updateMany(
      {}, // Cập nhật tất cả các bản ghi
      {
        $set: {
          createdAt: new Date(), // Thêm createdAt mặc định là thời gian hiện tại
        },
      }
    );

    console.log(`${result.modifiedCount} documents updated successfully!`);
    process.exit();
  } catch (error) {
    console.error('Error updating fields:', error);
    process.exit(1);
  }
};

updateFields();
