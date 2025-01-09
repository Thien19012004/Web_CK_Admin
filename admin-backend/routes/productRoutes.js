const express = require('express');
const Product = require('../models/Product');
const { upload } = require('../config/cloudinaryConfig');
const router = express.Router();
const {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  updateProductImg,
  getProductImages,
  filterProducts,
  sortProducts,
  getPagedProducts, // API phân trang sản phẩm
} = require('../controllers/productController');

// Routes
router.get('/', getProducts);              // Lấy danh sách sản phẩm

router.get('/filter', filterProducts); // API lọc sản phẩm
//outer.get("/sort", sortProducts); // Route sắp xếp sản phẩm
router.get("/paging", getPagedProducts); // API phân trang sản phẩm


router.post('/', createProduct);           // Thêm sản phẩm mới
router.put('/:id', updateProduct);         // Cập nhật sản phẩm
router.delete('/:id', deleteProduct);      // Xóa sản phẩm


router.post('/upload', upload.single('image'), uploadImage); // Upload ảnh lên Cloudinary


router.post('/', createProduct); // API thêm sản phẩm

// Routes cho hình ảnh
router.get("/:id/images", getProductImages); // Lấy tất cả ảnh của sản phẩm

router.put('/:id/update-images', upload.single('image'), updateProductImg); // Đúng phương thức PUT

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id); // Tìm sản phẩm theo ID
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product); // Trả về sản phẩm
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route thêm sản phẩm với nhiều ảnh
router.post("/products", upload.array("images", 10), createProduct);

module.exports = router;