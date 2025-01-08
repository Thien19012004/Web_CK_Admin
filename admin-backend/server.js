const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth"); // Import route auth
const profileRoutes = require('./routes/profileRoutes'); // Thêm profile route

dotenv.config();
connectDB();

const app = express();

// Middleware
// Cấu hình CORS
app.use(
    cors({
        origin: 'http://localhost:5173', // Chỉ định origin cụ thể được phép truy cập
        credentials: true // Cho phép gửi cookie và thông tin xác thực
    })
);
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/auth", authRoutes); // Gắn auth routes vào /api/auth
app.use('/profile', profileRoutes); // Đăng ký route profile


// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
