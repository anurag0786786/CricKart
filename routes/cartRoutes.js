const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCart);
router.post("/remove", removeFromCart);
router.post("/increase", increaseQuantity);
router.post("/decrease", decreaseQuantity);

module.exports = router;
