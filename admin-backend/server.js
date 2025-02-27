const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require("./routes/auth"); // Import route auth
const profileRoutes = require('./routes/profileRoutes'); // Thêm profile route
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();
connectDB();

const app = express();

// Middleware
// Cấu hình CORS
app.use(cors({
    origin: ['http://localhost:8080', 'https://admin.lptdevops.website'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use("/api/auth", authRoutes); // Gắn auth routes vào /api/auth
app.use('/api/profile', profileRoutes); // Đăng ký route profile
app.use('/orders', orderRoutes);


// Khởi động server
const PORT = process.env.PORT || 1901;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
