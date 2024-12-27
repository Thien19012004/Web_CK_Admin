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
} = require('../controllers/productController');

// Routes
router.get('/', getProducts);              // Lấy danh sách sản phẩm
router.post('/', createProduct);           // Thêm sản phẩm mới
router.put('/:id', updateProduct);         // Cập nhật sản phẩm
router.delete('/:id', deleteProduct);      // Xóa sản phẩm


router.post('/upload', upload.single('image'), uploadImage); // Upload ảnh lên Cloudinary


// Routes cho hình ảnh
router.get("/:id/images", getProductImages); // Lấy tất cả ảnh của sản phẩm

// router.get('/test', async (req, res) => {
//     try {
//       const products = await Product.find(); // Kiểm tra xem có thể lấy dữ liệu từ DB không
//       res.status(200).json({
//         success: true,
//         message: "Database connected successfully!",
//         dataCount: products.length, // Trả về số lượng sản phẩm hiện có
//       });
//     } catch (error) {
//       res.status(500).json({
//         success: false,
//         message: "Database connection failed!",
//         error: error.message,
//       });
//     }
//   });

// API thêm sản phẩm với upload ảnh
// router.post('/products', upload.single('img'), async (req, res) => {
//   try {
//     const { name, price, desc, gender, category, sizes, status } = req.body;
//     const imageUrl = req.file.path; // Đường dẫn ảnh từ Cloudinary

//     const product = new Product({
//       name,
//       img: [imageUrl],
//       price,
//       desc,
//       gender,
//       category,
//       sizes,
//       status,
//     });

//     const newProduct = await product.save();
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });


router.put('/:id/update-images', upload.single('image'), updateProductImg); // Đúng phương thức PUT

// router.put("/products/:id/update-images", async (req, res) => {
//   const { images } = req.body; // Lấy danh sách ảnh từ request
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     product.img = images; // Cập nhật danh sách ảnh
//     const updatedProduct = await product.save();
//     res.json(updatedProduct);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;