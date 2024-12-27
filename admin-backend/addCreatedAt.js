const mongoose = require('mongoose');
const Product = require('./models/Product'); // Đường dẫn đến model Product
const connectDB = require('./config/db'); // Kết nối database

// Kết nối database
connectDB();

const addCreatedAt = async () => {
  try {
    const result = await Product.updateMany(
      { createdAt: { $exists: false } }, // Điều kiện: Chỉ cập nhật nếu không có 'createdAt'
      {
        $set: {
          createdAt: new Date(), // Thêm createdAt mặc định là thời gian hiện tại
        },
      }
    );

    console.log(`${result.modifiedCount} documents updated successfully!`);
    process.exit();
  } catch (error) {
    console.error('Error adding createdAt:', error);
    process.exit(1);
  }
};

addCreatedAt();
