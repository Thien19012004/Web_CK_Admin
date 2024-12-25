const express = require('express');
const Product = require('../models/Product');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Routes
router.get('/', getProducts);              // Lấy danh sách sản phẩm
router.post('/', createProduct);           // Thêm sản phẩm mới
router.put('/:id', updateProduct);         // Cập nhật sản phẩm
router.delete('/:id', deleteProduct);      // Xóa sản phẩm
router.get('/test', async (req, res) => {
    try {
      const products = await Product.find(); // Kiểm tra xem có thể lấy dữ liệu từ DB không
      res.status(200).json({
        success: true,
        message: "Database connected successfully!",
        dataCount: products.length, // Trả về số lượng sản phẩm hiện có
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Database connection failed!",
        error: error.message,
      });
    }
  });
  
module.exports = router;
