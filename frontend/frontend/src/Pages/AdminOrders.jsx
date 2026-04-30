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

const statuses = ["Pending", "Paid", "Shipped", "Delivered", "Cancelled"];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://crickart-mchl.onrender.com/order/all")
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`https://crickart-mchl.onrender.com/order/status/${orderId}`, {
        status: newStatus,
      });
      setOrders(
        orders.map((o) =>
          o._id === orderId ? { ...o, status: newStatus } : o,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

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
          All Orders <span style={{ color: "#b5f542" }}>({orders.length})</span>
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
          Manage order statuses
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
        {orders.length === 0 ? (
          <p
            style={{
              color: "#333",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              textAlign: "center",
              padding: "60px",
            }}
          >
            No orders yet
          </p>
        ) : (
          orders.map((order) => {
            const s = statusColor(order.status);
            return (
              <div
                key={order._id}
                style={{
                  background: "#111",
                  borderRadius: "2px",
                  border: "1px solid #1a1a1a",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "16px 20px",
                    borderBottom: "1px solid #1a1a1a",
                    flexWrap: "wrap",
                    gap: "12px",
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
                      Customer
                    </p>
                    <p style={{ fontSize: "12px", color: "#888" }}>
                      {order.address?.fullName || "N/A"}
                    </p>
                  </div>

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

                  {/* Status Dropdown */}
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
                      Status
                    </p>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      style={{
                        background: s.bg,
                        color: s.color,
                        border: `1px solid ${s.border}`,
                        fontSize: "11px",
                        letterSpacing: "1px",
                        textTransform: "uppercase",
                        padding: "6px 12px",
                        borderRadius: "2px",
                        cursor: "pointer",
                        outline: "none",
                      }}
                    >
                      {statuses.map((st) => (
                        <option
                          key={st}
                          value={st}
                          style={{ background: "#111", color: "#f0ede6" }}
                        >
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Products */}
                <div
                  style={{
                    padding: "16px 20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
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
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          <div
                            style={{
                              width: "48px",
                              height: "48px",
                              background: "#1a1a1a",
                              borderRadius: "2px",
                              overflow: "hidden",
                              flexShrink: 0,
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
                                  "https://placehold.co/48x48/1a1a1a/333?text=?";
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
                              Qty: {quantity}
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

                {/* Footer */}
                <div
                  style={{
                    borderTop: "1px solid #1a1a1a",
                    padding: "14px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
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
          })
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
