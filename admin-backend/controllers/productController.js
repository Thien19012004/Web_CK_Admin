const Product = require('../models/Product');

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Lấy tất cả sản phẩm
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo sản phẩm mới
const createProduct = async (req, res) => {
  const { name, img, price, desc, gender, category, sizes, status } = req.body;

  try {
    const product = new Product({
      name,
      img,
      price,
      desc,
      gender,
      category,
      sizes,
      status // Thêm trạng thái sản phẩm
    });

    const newProduct = await product.save(); // Lưu sản phẩm mới
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Cập nhật sản phẩm
const updateProduct = async (req, res) => {
  const { name, img, price, desc, gender, category, sizes, status } = req.body;

  try {
    // Tìm sản phẩm cần cập nhật
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cập nhật thông tin sản phẩm
    product.name = name || product.name;
    product.img = img || product.img;
    product.price = price || product.price;
    product.desc = desc || product.desc;
    product.gender = gender || product.gender;
    product.category = category || product.category;
    product.sizes = sizes || product.sizes;
    product.status = status || product.status; // Cập nhật trạng thái

    const updatedProduct = await product.save(); // Lưu thay đổi
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Xóa sản phẩm
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne(); // Xóa sản phẩm
    res.json({ message: "Product removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết một sản phẩm
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tìm sản phẩm theo trạng thái
const getProductsByStatus = async (req, res) => {
  try {
    const { status } = req.query; // Lấy tham số trạng thái từ query
    const products = await Product.find({ status }); // Tìm sản phẩm có trạng thái tương ứng
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductsByStatus, // Thêm hàm lọc theo trạng thái
};
