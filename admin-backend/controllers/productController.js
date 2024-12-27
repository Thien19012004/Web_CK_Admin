const Product = require('../models/Product');
const { cloudinary } = require("../config/cloudinaryConfig");

// Lấy tất cả sản phẩm
const getProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Lấy tất cả sản phẩm
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    const file = req.file; // Lấy dữ liệu từ FormData
    if (!file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    // Upload ảnh lên Cloudinary
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "products", // Thư mục trên Cloudinary
      public_id: `product_${Date.now()}`, // Đặt tên ảnh với timestamp
      transformation: [
        { width: 500, height: 500, crop: "limit" }, // Giới hạn kích thước ảnh
        { fetch_format: "auto", quality: "auto" }, // Tối ưu ảnh
      ],
    });

    res.status(200).json({ imageUrl: result.secure_url }); // Trả về URL ảnh
  } catch (error) {
    console.error("Upload failed:", error.message);
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
  //console.log("Received Data:", req.body); // Log dữ liệu nhận được
  const { name, img, price, salePrice, desc, gender, category, sizes, status } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Cập nhật các trường
    product.name = name || product.name;
    product.img = img || product.img;
    product.price = price || product.price;
    product.salePrice = salePrice || product.salePrice;
    product.desc = desc || product.desc;
    product.gender = gender || product.gender;
    product.category = category || product.category;
    product.sizes = sizes || product.sizes;
    product.status = status || product.status;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error("Failed to update product:", error.message); // Log lỗi
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật ảnh cho sản phẩm
const updateProductImg = async (req, res) => {
  console.log("Request received for ID:", req.params.id); // Log ID sản phẩm
  console.log("Request method:", req.method); // Log phương thức (PUT)
  console.log("Request body:", req.body); // Log dữ liệu body
  console.log("Request file:", req.file); // Log file upload nếu có

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // // Nếu có file tải lên, thêm ảnh vào Cloudinary
    // if (req.file) {
    //   const result = await cloudinary.uploader.upload(req.file.path, {
    //     folder: "products",
    //   });
    //   product.img.push(result.secure_url);
    // }

    // Nếu có danh sách ảnh từ body
    if (req.body.images) {
      const newImages = JSON.parse(req.body.images); // Chuyển chuỗi JSON thành mảng
      product.img = [...product.img, ...newImages]; // Thêm ảnh mới
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct); // Trả về dữ liệu sản phẩm đã cập nhật
  } catch (error) {
    console.error("Error updating images:", error);
    res.status(400).json({ message: error.message }); // Trả về lỗi 400 nếu có vấn đề
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

// Lấy ảnh của sản phẩm
const getProductImages = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ images: product.img });
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
  uploadImage,
  updateProductImg, // Thêm hàm cập nhật ảnh
  getProductImages
};
