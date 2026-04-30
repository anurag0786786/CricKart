const Cart = require("../models/cartModel");

const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        products: [{ product: productId, quantity: 1 }],
      });
    } else {
      const index = cart.products.findIndex(
        (p) => String(p.product) === productId,
      );
      if (index > -1) {
        cart.products[index].quantity += 1;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }
    }
    await cart.save();
    res.json({ msg: "Added To Cart", cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ user: userId }).populate(
      "products.product",
    );
    res.json(cart);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ user: userId });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId,
    );

    await cart.save();
    res.json({ msg: "removed", cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const increaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    const item = cart.products.find((p) => p.product.toString() === productId);

    if (item) {
      item.quantity += 1;
    }

    await cart.save();
    res.json({ msg: "Quantity Increased", cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
const decreaseQuantity = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    const item = cart.products.find((p) => p.product.toString() === productId);

    if (item && item.quantity > 1) {
      item.quantity -= 1;
    } else {
      // agar 1 hai to remove kar de
      cart.products = cart.products.filter(
        (p) => p.product.toString() !== productId,
      );
    }

    await cart.save();
    res.json({ msg: "Quantity Decreased", cart });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addToCart,
  getCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
};
