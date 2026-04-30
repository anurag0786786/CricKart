const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");

const checkout = async (req, res) => {
  try {
    const { userId, address } = req.body;

    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // total calculate
    const total = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    // order create
    const order = await Order.create({
      user: userId,
      products: cart.products,
      totalAmount: total,
      address,
    });

    // cart clear
    cart.products = [];
    await cart.save();

    res.json({
      msg: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ user: userId })
      .populate("products.product")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ msg: "Order not found" });
    res.json({ msg: "Status updated", order });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.product")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { checkout, getMyOrders, updateOrderStatus, getAllOrders };
