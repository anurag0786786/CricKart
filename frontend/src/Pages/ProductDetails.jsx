import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const getUserId = () => {
    if (!token) return null;
    try {
      return JSON.parse(atob(token.split(".")[1])).id;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    axios
      .get(`https://crickart-mchl.onrender.com/product/${id}`)
      .then((res) => setProduct(res.data.product))
      .catch(() => toast.error("Product not found"));
  }, [id]);

  const handleAddToCart = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    try {
      await axios.post("https://crickart-mchl.onrender.com/cart/add", {
        userId,
        productId: product._id,
      });
      toast.success("Added to cart! 🛒");
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  const handleBuyNow = async () => {
    const userId = getUserId();
    if (!userId) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    try {
      await axios.post("https://crickart-mchl.onrender.com/cart/add", {
        userId,
        productId: product._id,
      });
      navigate("/cart");
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (!product)
    return (
      <div
        style={{
          background: "#0d0d0d",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "56px",
        }}
      >
        <p
          style={{
            color: "#444",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          Loading...
        </p>
      </div>
    );

  return (
    <div
      style={{
        background: "#0d0d0d",
        minHeight: "100vh",
        color: "#f0ede6",
        fontFamily: "'DM Sans', sans-serif",
        paddingTop: "56px",
      }}
    >
      {/* Back */}
      <div style={{ padding: "16px 24px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: "#555",
            fontSize: "11px",
            letterSpacing: "1px",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Layout */}
      <div
        className="pd-layout"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* Left — Image */}
        <div
          className="pd-image"
          style={{ width: "100%", background: "#111", overflow: "hidden" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              display: "block",
              maxHeight: "420px",
            }}
            onError={(e) => {
              e.target.src = "https://placehold.co/600x600/1a1a1a/333?text=?";
            }}
          />
        </div>

        {/* Right — Details */}
        <div
          className="pd-details"
          style={{ width: "100%", padding: "28px 24px 48px" }}
        >
          <span
            style={{
              fontSize: "10px",
              color: "#555",
              textTransform: "uppercase",
              letterSpacing: "2px",
            }}
          >
            {product.category?.name}
          </span>

          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(36px, 6vw, 56px)",
              letterSpacing: "2px",
              lineHeight: 1.1,
              marginTop: "8px",
              color: "#f0ede6",
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              margin: "20px 0 0",
            }}
          >
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "40px",
                color: "#b5f542",
                letterSpacing: "1px",
              }}
            >
              ₹{product.price}
            </span>
            <span
              style={{
                fontSize: "10px",
                background: "#1a1a1a",
                color: "#555",
                padding: "4px 10px",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              In Stock
            </span>
          </div>

          <div
            style={{ height: "1px", background: "#1a1a1a", margin: "24px 0" }}
          />

          <p
            style={{
              fontSize: "14px",
              color: "#666",
              lineHeight: "1.9",
              letterSpacing: "0.3px",
            }}
          >
            {product.description}
          </p>

          <div
            style={{ height: "1px", background: "#1a1a1a", margin: "28px 0" }}
          />

          {/* Buttons */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <button
              onClick={handleBuyNow}
              style={{
                width: "100%",
                padding: "16px",
                background: "#b5f542",
                color: "#0d0d0d",
                border: "none",
                fontSize: "12px",
                fontWeight: "500",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              Buy Now
            </button>
            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                padding: "14px",
                background: "transparent",
                color: "#888",
                border: "1px solid #222",
                fontSize: "12px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                borderRadius: "2px",
              }}
            >
              Add to Cart
            </button>
          </div>

          {/* Meta */}
          <div
            style={{
              marginTop: "36px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {[
              { label: "Category", value: product.category?.name },
              { label: "Availability", value: "In Stock" },
              { label: "Delivery", value: "3–5 Business Days" },
              { label: "Returns", value: "7 Day Easy Return" },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "12px 0",
                  borderBottom: "1px solid #151515",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    color: "#444",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                  }}
                >
                  {label}
                </span>
                <span style={{ fontSize: "12px", color: "#777" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .pd-layout { flex-direction: row !important; min-height: calc(100vh - 56px); }
          .pd-image { width: 50% !important; position: sticky !important; top: 56px; height: calc(100vh - 56px) !important; max-height: none !important; }
          .pd-image img { max-height: none !important; height: 100% !important; object-fit: cover !important; }
          .pd-details { width: 50% !important; padding: 48px 48px 80px !important; overflow-y: auto; }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
