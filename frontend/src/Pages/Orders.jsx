import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const statusColor = (status) => {
  switch (status) {
    case "Paid":
      return { bg: "#0a2a0a", color: "#4ade80", border: "#1a4a1a" };
    case "Pending":
      return { bg: "#2a2000", color: "#facc15", border: "#3a3000" };
    case "Shipped":
      return { bg: "#001a2a", color: "#60a5fa", border: "#002a3a" };
    case "Delivered":
      return { bg: "#0a2a0a", color: "#b5f542", border: "#1a4a1a" };
    case "Cancelled":
      return { bg: "#2a0000", color: "#f87171", border: "#4a0000" };
    default:
      return { bg: "#1a1a1a", color: "#888", border: "#222" };
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
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

  useEffect(() => {
    const userId = getUserId();
    if (!userId) {
      navigate("/login");
      return;
    }
    axios
      .get(`https://crickart-mchl.onrender.com/order/my-orders/${userId}`)
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

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
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          Loading...
        </p>
      </div>
    );

  if (orders.length === 0)
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
          No orders yet
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
          My Orders <span style={{ color: "#b5f542" }}>({orders.length})</span>
        </h1>
        <p
          style={{
            fontSize: "11px",
            color: "#444",
            letterSpacing: "1px",
            textTransform: "uppercase",
            marginTop: "4px",
          }}
        >
          Your order history
        </p>
      </div>

      <div
        style={{
          padding: "24px 20px 60px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {orders.map((order) => {
          const s = statusColor(order.status);
          return (
            <div
              key={order._id}
              style={{
                background: "#111",
                borderRadius: "2px",
                overflow: "hidden",
                border: "1px solid #1a1a1a",
              }}
            >
              {/* Order Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid #1a1a1a",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Order ID
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      fontFamily: "monospace",
                    }}
                  >
                    #{order._id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div style={{ textAlign: "center" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    Date
                  </p>
                  <p style={{ fontSize: "12px", color: "#888" }}>
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Status Badge */}
                <span
                  style={{
                    background: s.bg,
                    color: s.color,
                    border: `1px solid ${s.border}`,
                    fontSize: "10px",
                    fontWeight: "500",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: "2px",
                  }}
                >
                  {order.status}
                </span>
              </div>

              {/* Products */}
              <div
                style={{
                  padding: "16px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {order.products.map(
                  ({ product, quantity }) =>
                    product && (
                      <div
                        key={product._id}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                        }}
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <div
                          style={{
                            width: "56px",
                            height: "56px",
                            background: "#1a1a1a",
                            borderRadius: "2px",
                            overflow: "hidden",
                            flexShrink: 0,
                            cursor: "pointer",
                          }}
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            onError={(e) => {
                              e.target.src =
                                "https://placehold.co/56x56/1a1a1a/333?text=?";
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#e0ddd6",
                              marginBottom: "3px",
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
                            }}
                          >
                            {product.category?.name} · Qty: {quantity}
                          </p>
                        </div>
                        <span
                          style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "18px",
                            color: "#b5f542",
                            flexShrink: 0,
                          }}
                        >
                          ₹{product.price * quantity}
                        </span>
                      </div>
                    ),
                )}
              </div>

              {/* Order Footer */}
              <div
                style={{
                  borderTop: "1px solid #1a1a1a",
                  padding: "14px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {/* Address */}
                <div>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "3px",
                    }}
                  >
                    Delivery To
                  </p>
                  <p style={{ fontSize: "12px", color: "#777" }}>
                    {order.address?.fullName}, {order.address?.city},{" "}
                    {order.address?.pincode}
                  </p>
                </div>

                {/* Total */}
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: "10px",
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: "3px",
                    }}
                  >
                    Total
                  </p>
                  <span
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "24px",
                      color: "#b5f542",
                    }}
                  >
                    ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
