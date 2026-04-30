const mongoose = require("mongoose");
const Category = require("../models/categoryModel");

const addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const exist = await Category.findOne({ name });
    if (exist) {
      return res.status(400).json({
        msg: "category already exists",
      });
    }
    const category = await Category.create({ name });
    return res.status(200).json({
      msg: "category Added Successfully",
      category,
    });
  } catch (err) {
    return res.status(500).json({ msg: "server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    return res.status(500).json({
      msg: "server error",
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true },
    );

    if (!category) {
      return res.status(404).json({
        msg: "category not found",
      });
    }
    res.json({
      msg: "category updated",
      category,
    });
  } catch (err) {
    res.status(500).json({
      msg: "server error",
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({
        msg: "category not found",
      });
    }
    res.json({
      msg: "category Deleted Succesfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "server error",
    });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
