const Order = require('../models/Order');

// Get all orders (with sorting and filtering)
exports.getAllOrders = async (req, res) => {
    try {
        const { status } = req.query; // Filter by status (if provided)
        const query = status ? { status } : {}; // Build query object

        const orders = await Order.find(query)
            .sort({ date: -1 }) // Sort by creation date (newest first)
            .populate('userId', 'username email') // Populate user details
            .populate('products.productId', 'name img'); // Populate product details

        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id)
            .populate('userId', 'username email')
            .populate('products.productId', 'name img');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // New status

        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true } // Return updated order
        );

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (err) {
        console.error('Error updating order status:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSalesData = async (req, res) => {
    try {
      const { timeframe = "week" } = req.query; // Tham số để chọn khoảng thời gian (week, month, year)
      const now = new Date();
      let startDate, groupBy, categories;
  
      if (timeframe === "week") {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        startDate = startOfWeek;
        groupBy = { $dayOfWeek: "$date" }; // Nhóm theo ngày trong tuần
        categories = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      } else if (timeframe === "month") {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = startOfMonth;
        groupBy = { $dayOfMonth: "$date" }; // Nhóm theo ngày trong tháng
        categories = Array.from(
          { length: new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() },
          (_, i) => `${i + 1}`
        );
      } else if (timeframe === "year") {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        startDate = startOfYear;
        groupBy = { $month: "$date" }; // Nhóm theo tháng
        categories = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
      } else {
        return res.status(400).json({ message: "Invalid timeframe" });
      }
  
      // Lấy dữ liệu đơn hàng theo khoảng thời gian
      const orders = await Order.aggregate([
        { $match: { date: { $gte: startDate } } }, // Lọc đơn hàng từ ngày bắt đầu
        { $unwind: "$products" }, // Tách sản phẩm trong mỗi đơn hàng
        {
          $group: {
            _id: groupBy, // Nhóm theo ngày/tháng
            totalSales: { $sum: { $multiply: ["$products.price", "$products.quantity"] } }, // Tổng doanh thu
          },
        },
        { $sort: { _id: 1 } }, // Sắp xếp theo ngày/tháng
      ]);
  
      // Chuyển dữ liệu thành đối tượng map để tìm kiếm dễ hơn
      const salesMap = {};
      orders.forEach((order) => {
        salesMap[order._id] = order.totalSales || 0; // Gán doanh thu vào từng ngày/tháng
      });
  
      // Gán doanh thu cho từng ngày/tháng với giá trị mặc định
      const sales = categories.map((_, index) => salesMap[index + 1] || 0);
  
      // Tính tổng doanh thu
      const totalSales = sales.reduce((acc, value) => acc + value, 0);
  
      // Trả về dữ liệu
      res.status(200).json({
        totalSales,
        categories,
        sales,
      });
    } catch (err) {
      console.error("Error fetching sales data:", err);
      res.status(500).json({ message: "Failed to fetch sales data" });
    }
  };
  
    
  exports.getTopProductsByRevenue = async (req, res) => {
    try {
      const { timeframe = "week" } = req.query; // Lấy khoảng thời gian từ query
      const now = new Date();
      let startDate;
  
      if (timeframe === "day") {
        startDate = new Date(now.setHours(0, 0, 0, 0));
      } else if (timeframe === "week") {
        const dayOfWeek = now.getDay();
        startDate = new Date(now.setDate(now.getDate() - dayOfWeek));
      } else if (timeframe === "month") {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
  
      const products = await Order.aggregate([
        {
          $match: { date: { $gte: startDate } }, // Lọc đơn hàng trong khoảng thời gian
        },
        { $unwind: "$products" }, // Tách các sản phẩm trong mỗi đơn hàng
        {
          $group: {
            _id: "$products.productId",
            totalRevenue: { $sum: { $multiply: ["$products.price", "$products.quantity"] } },
            totalPurchase: { $sum: "$products.quantity" },
          },
        },
        {
          $lookup: {
            from: "products", // Tên collection products
            localField: "_id",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" }, // Tách thông tin sản phẩm
        {
          $project: {
            productName: "$productDetails.name",
            totalRevenue: 1,
            totalPurchase: 1,
          },
        },
        { $sort: { totalRevenue: -1 } }, // Sắp xếp theo doanh thu
        { $limit: 10 }, // Giới hạn 10 sản phẩm
      ]);
  
      res.status(200).json(products);
    } catch (err) {
      console.error("Error fetching top products by revenue:", err);
      res.status(500).json({ message: "Failed to fetch top products by revenue" });
    }
  };
  
  