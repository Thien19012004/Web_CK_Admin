const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const User = require("./models/User"); // Import model User
require("dotenv").config(); // Để đọc biến môi trường

// Kết nối MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Đọc dữ liệu từ file admin.json
const adminData = JSON.parse(fs.readFileSync("admin.json", "utf-8"));

// Thêm admin vào database
const seedAdmin = async () => {
  try {
    // Kiểm tra xem admin đã tồn tại chưa
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin already exists!");
      process.exit(0);
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(adminData.password, 10);

    // Tạo admin mới
    const admin = new User({
      username: adminData.username,
      email: adminData.email,
      password: hashedPassword,
      avatar: adminData.avatar,
      role: adminData.role,
      isActivated: adminData.isActivated,
      status: adminData.status,
    });

    // Lưu admin vào database
    await admin.save();
    console.log("Admin added successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error adding admin:", error);
    process.exit(1);
  }
};

seedAdmin();
