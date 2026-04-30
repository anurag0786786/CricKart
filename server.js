const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./db/db");
const { connection } = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");
const categoryRoutes = require("./routes/categoryRoutes");
const proudctRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");


const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", proudctRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/payment", paymentRoutes);


const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running on port${PORT}`);
  });
});
