const express = require("express");
const router = express.Router();

const {
  checkout,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
router.post("/checkout", checkout);
router.get("/my-orders/:userId", getMyOrders);
router.put("/status/:id", updateOrderStatus);
router.get("/all", getAllOrders);

module.exports = router;
