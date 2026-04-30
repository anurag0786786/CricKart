import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
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

  const userId = getUserId();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    Promise.all([
      axios.get(`https://crickart-mchl.onrender.com/auth/profile/${userId}`),
      axios.get(`https://crickart-mchl.onrender.com/order/my-orders/${userId}`),
    ])
      .then(([userRes, orderRes]) => {
        setUser(userRes.data.user);
        setOrders(orderRes.data.orders || []);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    navigate("/login");
  };

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const statusColor = (status) => {
    switch (status) {
      case "Paid":
        return { color: "#4ade80", bg: "#0a2a0a", border: "#1a4a1a" };
      case "Pending":
        return { color: "#facc15", bg: "#2a2000", border: "#3a3000" };
      case "Shipped":
        return { color: "#60a5fa", bg: "#001a2a", border: "#002a3a" };
      case "Delivered":
        return { color: "#b5f542", bg: "#0a2a0a", border: "#1a4a1a" };
      case "Cancelled":
        return { color: "#f87171", bg: "#2a0000", border: "#4a0000" };
      default:
        return { color: "#888", bg: "#1a1a1a", border: "#222" };
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
          My Profile
        </h1>
      </div>

      <div
        className="profile-layout"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          padding: "20px 20px 60px",
        }}
      >
        {/* Left — User Info */}
        <div
          className="profile-left"
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          {/* Avatar + Info */}
          <div
            style={{
              background: "#111",
              border: "1px solid #1a1a1a",
              borderRadius: "2px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "#1a1a1a",
                  border: "2px solid #b5f542",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "28px",
                  color: "#b5f542",
                  flexShrink: 0,
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "28px",
                    letterSpacing: "1px",
                    margin: 0,
                  }}
                >
                  {user?.name}
                </h2>
                <p
                  style={{ fontSize: "12px", color: "#555", marginTop: "2px" }}
                >
                  {user?.email}
                </p>
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    padding: "3px 8px",
                    borderRadius: "2px",
                    marginTop: "6px",
                    display: "inline-block",
                    background: user?.role === "admin" ? "#1a1a0a" : "#0a1a2a",
                    color: user?.role === "admin" ? "#b5f542" : "#60a5fa",
                    border: `1px solid ${user?.role === "admin" ? "#2a2a0a" : "#0a2a3a"}`,
                  }}
                >
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
              }}
            >
              {[
                { label: "Orders", value: orders.length },
                { label: "Spent", value: `₹${totalSpent}` },
                {
                  label: "Member Since",
                  value: new Date(user?.createdAt).getFullYear(),
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  style={{
                    background: "#1a1a1a",
                    padding: "14px 12px",
                    borderRadius: "2px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "22px",
                      color: "#b5f542",
                    }}
                  >
                    {value}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#555",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginTop: "2px",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "14px",
              background: "transparent",
              color: "#f87171",
              border: "1px solid #2a0000",
              borderRadius: "2px",
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {/* Right — Order History */}
        <div className="profile-right">
          <p
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}
          >
            Order History
          </p>

          {orders.length === 0 ? (
            <div
              style={{
                background: "#111",
                border: "1px solid #1a1a1a",
                borderRadius: "2px",
                padding: "40px",
                textAlign: "center",
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
                  marginTop: "16px",
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
          ) : (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              {orders.map((order) => {
                const s = statusColor(order.status);
                return (
                  <div
                    key={order._id}
                    style={{
                      background: "#111",
                      border: "1px solid #1a1a1a",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Order Header */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "12px 16px",
                        borderBottom: "1px solid #151515",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "9px",
                            color: "#555",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "3px",
                          }}
                        >
                          Order
                        </p>
                        <p
                          style={{
                            fontSize: "11px",
                            color: "#777",
                            fontFamily: "monospace",
                          }}
                        >
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div style={{ textAlign: "center" }}>
                        <p
                          style={{
                            fontSize: "9px",
                            color: "#555",
                            letterSpacing: "1px",
                            textTransform: "uppercase",
                            marginBottom: "3px",
                          }}
                        >
                          Date
                        </p>
                        <p style={{ fontSize: "11px", color: "#777" }}>
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <span
                        style={{
                          background: s.bg,
                          color: s.color,
                          border: `1px solid ${s.border}`,
                          fontSize: "9px",
                          letterSpacing: "1px",
                          textTransform: "uppercase",
                          padding: "4px 10px",
                          borderRadius: "2px",
                        }}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Products */}
                    <div
                      style={{
                        padding: "12px 16px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      {order.products.map(
                        ({ product, quantity }) =>
                          product && (
                            <div
                              key={product._id}
                              style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "center",
                                cursor: "pointer",
                              }}
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              <div
                                style={{
                                  width: "44px",
                                  height: "44px",
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
                                      "https://placehold.co/44x44/1a1a1a/333?text=?";
                                  }}
                                />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <p
                                  style={{
                                    fontSize: "12px",
                                    color: "#e0ddd6",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {product.name}
                                </p>
                                <p style={{ fontSize: "10px", color: "#555" }}>
                                  × {quantity}
                                </p>
                              </div>
                              <span
                                style={{
                                  fontFamily: "'Bebas Neue', sans-serif",
                                  fontSize: "16px",
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
                        borderTop: "1px solid #151515",
                        padding: "10px 16px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#555",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Total
                      </span>
                      <span
                        style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: "20px",
                          color: "#b5f542",
                        }}
                      >
                        ₹{order.totalAmount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .profile-layout { flex-direction: row !important; align-items: flex-start !important; padding: 32px 40px 80px !important; gap: 32px !important; }
          .profile-left { width: 320px !important; position: sticky; top: 76px; }
          .profile-right { flex: 1; }
        }
      `}</style>
    </div>
  );
};

export default Profile;
 