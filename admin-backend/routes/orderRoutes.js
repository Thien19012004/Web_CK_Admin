const express = require('express');
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
} = require('../controllers/orderController');
const auth = require('../middleware/auth');
const { getSalesData } = require("../controllers/orderController");
const { getTopProductsByRevenue } = require("../controllers/orderController");

// Get all orders (with sorting and filtering)
router.get('/', auth, getAllOrders);

// Get order details by ID
router.get('/:id', auth, getOrderById);

// Update order status
router.put('/:id/status', auth, updateOrderStatus);
router.get("/report/sales-data", auth, getSalesData);
router.get('/report/top-products',auth, getTopProductsByRevenue);
module.exports = router;
