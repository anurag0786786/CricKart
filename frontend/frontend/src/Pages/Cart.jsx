import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
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

  const userId = getUserId();

  const fetchCart = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    try {
      const res = await axios.get(`https://crickart-mchl.onrender.com/cart/${userId}`);
      setCart(res.data);
    } catch {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleIncrease = async (productId) => {
    await axios.post("https://crickart-mchl.onrender.com/cart/increase", {
      userId,
      productId,
    });
    fetchCart();
  };

  const handleDecrease = async (productId) => {
    await axios.post("https://crickart-mchl.onrender.com/cart/decrease", {
      userId,
      productId,
    });
    fetchCart();
  };

  const handleRemove = async (productId) => {
    await axios.post("https://crickart-mchl.onrender.com/cart/remove", {
      userId,
      productId,
    });
    toast.success("Removed from cart");
    fetchCart();
  };

  const total =
    cart?.products?.reduce((sum, p) => sum + p.product.price * p.quantity, 0) ||
    0;

  if (loading)
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
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Loading...
        </p>
      </div>
    );

  if (!cart || cart.products?.length === 0)
    return (
      <div
        style={{
          background: "#0d0d0d",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "56px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <p
          style={{
            color: "#333",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Your cart is empty
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            background: "#b5f542",
            color: "#0d0d0d",
            border: "none",
            padding: "10px 24px",
            fontSize: "11px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            cursor: "pointer",
            borderRadius: "2px",
          }}
        >
          Shop Now
        </button>
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
      <div style={{ padding: "24px 20px 0" }}>
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "40px",
            letterSpacing: "2px",
          }}
        >
          Your Cart{" "}
          <span style={{ color: "#b5f542" }}>({cart.products.length})</span>
        </h1>
      </div>

      <div
        className="cart-layout"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0",
          padding: "20px",
        }}
      >
        {/* Items */}
        <div className="cart-items" style={{ flex: 1 }}>
          {cart.products.map(({ product, quantity }) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                gap: "16px",
                padding: "16px 0",
                borderBottom: "1px solid #151515",
                alignItems: "center",
              }}
            >
              {/* Image */}
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  background: "#111",
                  flexShrink: 0,
                  overflow: "hidden",
                  borderRadius: "2px",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/80x80/1a1a1a/333?text=?";
                  }}
                />
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#e0ddd6",
                    marginBottom: "4px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {product.name}
                </p>
                <p
                  style={{
                    fontSize: "10px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "10px",
                  }}
                >
                  {product.category?.name}
                </p>

                {/* Quantity controls */}
                <div
                  style={{ display: "flex", alignItems: "center", gap: "12px" }}
                >
                  <button
                    onClick={() => handleDecrease(product._id)}
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "#1a1a1a",
                      border: "1px solid #222",
                      color: "#888",
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "2px",
                    }}
                  >
                    −
                  </button>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleIncrease(product._id)}
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "#1a1a1a",
                      border: "1px solid #222",
                      color: "#888",
                      fontSize: "16px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "2px",
                    }}
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    style={{
                      marginLeft: "8px",
                      background: "none",
                      border: "none",
                      color: "#ff4444",
                      fontSize: "11px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Price */}
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "22px",
                    color: "#b5f542",
                  }}
                >
                  ₹{product.price * quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div
          className="cart-summary"
          style={{
            background: "#111",
            padding: "24px",
            marginTop: "20px",
            borderRadius: "2px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "24px",
              letterSpacing: "1px",
              marginBottom: "20px",
            }}
          >
            Order Summary
          </h2>

          {cart.products.map(({ product, quantity }) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <span
                style={{
                  fontSize: "12px",
                  color: "#555",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: "60%",
                }}
              >
                {product.name} × {quantity}
              </span>
              <span style={{ fontSize: "12px", color: "#888" }}>
                ₹{product.price * quantity}
              </span>
            </div>
          ))}

          <div
            style={{ height: "1px", background: "#1a1a1a", margin: "16px 0" }}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "24px",
            }}
          >
            <span
              style={{
                fontSize: "13px",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Total
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "28px",
                color: "#b5f542",
              }}
            >
              ₹{total}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
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
            Checkout
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .cart-layout { flex-direction: row !important; align-items: flex-start !important; gap: 32px !important; padding: 24px 40px !important; }
          .cart-items { flex: 1; }
          .cart-summary { width: 340px !important; margin-top: 0 !important; position: sticky; top: 76px; }
        }
      `}</style>
    </div>
  );
};

export default Cart;
