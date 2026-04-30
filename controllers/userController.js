const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({
        message: "User already exist",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User creted Successfully",
    });
  } catch (err) {
    res.status(500).json({
      msg: "server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "User not found",
      });
    }
    const checkPass = await bcrypt.compare(password, user.password);
    if (!checkPass) {
      return res.status(400).json({
        msg: "wrong password",
      });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, // 👈 name add karo
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
    });
    res.json({
      msg: "user logged in succesfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ msg: "server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

module.exports = { registerUser, loginUser, getProfile };
