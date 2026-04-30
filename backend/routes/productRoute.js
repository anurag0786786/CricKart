const express = require("express");
const {
  addProduct,
  getProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const upload = require("../middleware/upload");
const router = express.Router();

router.post("/add", upload.single("image"), addProduct);
router.get("/", getProduct);
router.get("/:id", getProductById); // 👈 yeh naya route
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
