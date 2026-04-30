import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./Pages/Product";
import { Toaster } from "react-hot-toast";
import Navbar from "./Components/Navbar";
import Category from "./Pages/Category";
import Home from "./Pages/Home";
import Auth from "./Pages/Auth";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import { Navigate } from "react-router-dom";
import { isAdmin, isLoggedIn } from "./utils/auth";
import AdminOrders from "./Pages/AdminOrders";
import Profile from "./Pages/Profile";

const App = () => {
  const ProtectedRoute = ({ children }) => {
    return isLoggedIn() ? children : <Navigate to="/login" />;
  };
  // Admin protected route
  const AdminRoute = ({ children }) => {
    const user = isAdmin();
    if (!isLoggedIn()) return <Navigate to="/login" />;
    if (!user) return <Navigate to="/" />;
    return children;
  };
  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Navbar />
        <div style={{ paddingTop: "56px" }}></div>
        <Routes>
          <Route>
            <Route path="/" element={<Home />} />

            <Route path="/login" element={<Auth />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin routes */}
            <Route
              path="/product"
              element={
                <AdminRoute>
                  <Product />
                </AdminRoute>
              }
            />
            <Route
              path="/category"
              element={
                <AdminRoute>
                  <Category />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
