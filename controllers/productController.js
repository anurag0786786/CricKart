const mongoose = require("mongoose");
const Proudct = require("../models/productModel");

const addProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!req.file) {
      return res.status(400).json({ msg: "Image is required" });
    }
    const image = req.file.path.replace(/\\/g, "/");
    const exist = await Proudct.findOne({ name, category });
    if (exist) {
      return res.status(400).json({ msg: "Product already exist" });
    }
    const product = await Proudct.create({
      name,
      description,
      price,
      category,
      image,
    });
    res.status(201).json({ msg: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ msg: "server err" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Proudct.find().populate("category");
    res.json({ product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// 👇 naya function
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Proudct.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json({ product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.price) updateData.price = req.body.price;
    if (req.body.category) updateData.category = req.body.category;
    if (req.file) {
      updateData.image = req.file.path.replace(/\\/g, "/");
    }
    const product = await Proudct.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("category");
    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }
    res.json({ msg: "product updated successfully", product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Proudct.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ msg: "product not found" });
    }
    res.json({ msg: "product deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  addProduct,
  getProduct,
  getProductById, 
  updateProduct,
  deleteProduct,
};
