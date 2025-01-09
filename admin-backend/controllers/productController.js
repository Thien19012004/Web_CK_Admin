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
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Lấy danh sách ảnh từ body
    const { images } = req.body;
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ message: "Invalid images data" });
    }

    // Ghi đè danh sách ảnh mới
    product.img = images;

    // Lưu lại sản phẩm vào database
    const updatedProduct = await product.save();
    console.log("Saved product images:", updatedProduct.img); // Log danh sách ảnh đã lưu
    res.json(updatedProduct); // Trả về dữ liệu cập nhật
  } catch (error) {
    console.error("Error updating images:", error);
    res.status(500).json({ message: "Failed to update images" });
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
    const product = await Product.findById(req.params.id); // Tìm sản phẩm
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product.img); // Trả về danh sách ảnh
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images" });
  }
};

const filterProducts = async (req, res) => {
  try {
    const { size, category, gender } = req.query; // Lấy dữ liệu lọc từ query string

    // Tạo điều kiện lọc động
    const filter = {};

    if (size) {
      filter.sizes = size; // Lọc theo size (exact match)
    }
    if (category) {
      filter.category = category; // Lọc theo category (exact match)
    }
    if (gender) {
      filter.gender = gender; // Lọc theo gender (exact match)
    }

    const products = await Product.find(filter); // Tìm sản phẩm theo điều kiện lọc
    res.json(products); // Trả về danh sách sản phẩm đã lọc
  } catch (error) {
    console.error("Error filtering products:", error);
    res.status(500).json({ message: "Failed to filter products" });
  }
};

// Hàm sắp xếp sản phẩm
const sortProducts = async (req, res) => {
  try {
    const { sortBy, order } = req.query; // Lấy thông tin sortBy và order từ query string

    // Kiểm tra tham số hợp lệ
    const validSortBy = ["createdAt", "price", ];
    if (!validSortBy.includes(sortBy)) {
      return res.status(400).json({ message: "Invalid sort field" });
    }

    const sortOrder = order === "desc" ? -1 : 1; // Sắp xếp tăng dần (asc) hoặc giảm dần (desc)

    // Lấy danh sách sản phẩm đã sắp xếp
    const products = await Product.find().sort({ [sortBy]: sortOrder });

    res.json(products); // Trả về danh sách đã sắp xếp
  } catch (error) {
    console.error("Error sorting products:", error);
    res.status(500).json({ message: "Failed to sort products" });
  }
};

// API lấy danh sách sản phẩm với Filter, Sort và Paging
const getPagedProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy,
      order,
      size,
      category,
      gender,
    } = req.query;

    let filter = {};

    // Bộ lọc
    if (size) filter.sizes = size;
    if (category) filter.category = category;
    if (gender) filter.gender = gender;

    const skip = (page - 1) * limit;

    // Xử lý sắp xếp
    let sort = {};
    if (sortBy && order) {
      sort[sortBy] = order === "desc" ? -1 : 1;
    }

    // Sử dụng aggregation để tính toán `totalPurchase`
    const products = await Product.aggregate([
      // Áp dụng bộ lọc
      { $match: filter },

      // Lookup để lấy dữ liệu đơn hàng liên quan
      {
        $lookup: {
          from: "orders", // Collection orders
          localField: "_id", // ID sản phẩm
          foreignField: "products.productId", // Liên kết qua productId trong đơn hàng
          as: "orders",
        },
      },

      // Tính toán `totalPurchase` (tổng số lượng sản phẩm đã bán)
      {
        $addFields: {
          totalPurchase: {
            $sum: {
              $map: {
                input: "$orders", // Lặp qua tất cả các đơn hàng
                as: "order",
                in: {
                  $sum: {
                    $map: {
                      input: "$$order.products", // Lặp qua các sản phẩm trong đơn hàng
                      as: "product",
                      in: {
                        $cond: [
                          { $eq: ["$$product.productId", "$_id"] }, // Nếu productId khớp với sản phẩm hiện tại
                          "$$product.quantity", // Lấy quantity
                          0, // Không khớp thì trả về 0
                        ],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // Sắp xếp theo yêu cầu
      ...(sortBy && order
        ? [{ $sort: { [sortBy]: order === "desc" ? -1 : 1 } }]
        : []),

      // Phân trang
      { $skip: skip },
      { $limit: Number(limit) },
    ]);

    // Tính tổng số sản phẩm
    const total = await Product.countDocuments(filter);

    // Gửi dữ liệu về client
    res.status(200).json({
      data: products,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};


// Xác thực dữ liệu đầu vào
const validateProductInput = (data) => {
  const errors = {};

  if (!data.name || data.name.trim() === "") {
    errors.name = "Product name is required";
  }
  if (!data.price || isNaN(data.price) || data.price <= 0) {
    errors.price = "Price must be a positive number";
  }
  if (!data.desc || data.desc.trim() === "") {
    errors.desc = "Description is required";
  }
  if (!data.gender || !["MEN", "WOMEN", "UNISEX"].includes(data.gender)) {
    errors.gender = "Gender must be 'MEN', 'WOMEN', or 'UNISEX'";
  }
  if (!data.category || data.category.trim() === "") {
    errors.category = "Category is required";
  }
  if (!data.sizes || !Array.isArray(data.sizes) || data.sizes.length === 0) {
    errors.sizes = "At least one size is required";
  }
  if (!data.status || !["In Stock", "Out Of Stock"].includes(data.status)) {
    errors.status = "Status must be 'In Stock' or 'Out Of Stock'";
  }

  return errors;
};

// Tạo sản phẩm
const createProduct = async (req, res) => {
  try {
    const { name, price, desc, gender, category, sizes, status, img } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !desc || !gender || !category || !sizes || !status || !img.length) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Tạo sản phẩm
    const product = new Product({
      name,
      price,
      desc,
      gender,
      category,
      sizes: JSON.parse(sizes), // Chuyển sizes từ JSON thành mảng
      status,
      img, // URL ảnh đã upload trước đó
    });

    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Failed to create product:", error);
    res.status(500).json({ message: "Failed to create product" });
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
  getProductImages,
  filterProducts, // Thêm hàm lọc sản phẩm theo thông tin
  sortProducts, // Thêm hàm sắp xếp sản phẩm
  getPagedProducts, // Thêm hàm lấy danh sách sản phẩm với phân trang
  createProduct, // Thêm hàm tạo sản phẩm
  validateProductInput, // Thêm hàm xác thực dữ liệu đầu vào
};
