const crypto = require("crypto");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const razorpay = require("../config/razorpay");

const createOrder = async (req, res) => {
  try {
    const { amount } = req.body; // amount in rupees
    const options = {
      amount: amount * 100, // razorpay paise mein leta hai
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json({ orderId: order.id, amount: order.amount });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      address,
    } = req.body;

    // 🔐 signature verify
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ msg: "Payment verification failed" });
    }

    // 🛒 cart fetch
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
    );

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    // 💰 total calculate
    const total = cart.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0,
    );

    // 📦 order create
    const order = await Order.create({
      user: userId,
      products: cart.products,
      totalAmount: total,
      address,
      status: "Paid",
      paymentId: razorpay_payment_id,
    });

    // 🧹 cart clear
    cart.products = [];
    await cart.save();

    res.json({
      msg: "Payment successful & order created",
      order,
    });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { createOrder, verifyPayment };
