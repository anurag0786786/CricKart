import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    houseNo: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
  });
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
    axios
      .get(`https://crickart-mchl.onrender.com/cart/${userId}`)
      .then((res) => setCart(res.data))
      .catch(() => toast.error("Failed to load cart"));
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const total =
    cart?.products?.reduce((sum, p) => sum + p.product.price * p.quantity, 0) ||
    0;

  const handlePayment = async () => {
    const { fullName, phone, houseNo, area, city, state, pincode } = form;
    if (
      !fullName ||
      !phone ||
      !houseNo ||
      !area ||
      !city ||
      !state ||
      !pincode
    ) {
      toast.error("Please fill all address fields");
      return;
    }
    if (!cart || cart.products?.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      // Step 1 — Razorpay order create
      const { data } = await axios.post(
        "https://crickart-mchl.onrender.com/payment/create-order",
        {
          amount: total,
        },
      );

      // Step 2 — Razorpay checkout open
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "CricKart",
        description: "Cricket Gear Order",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            // Step 3 — verify payment
            await axios.post("https://crickart-mchl.onrender.com/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
              address: form,
            });
            toast.success("Order placed! 🏏");
            navigate("/");
          } catch {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: form.fullName,
          contact: form.phone,
        },
        theme: { color: "#b5f542" },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #1e1e1e",
    padding: "12px 14px",
    color: "#f0ede6",
    fontSize: "13px",
    outline: "none",
    borderRadius: "2px",
    boxSizing: "border-box",
  };

  const labelStyle = {
    fontSize: "10px",
    color: "#555",
    letterSpacing: "1px",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  };

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
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "40px",
            letterSpacing: "2px",
            marginTop: "12px",
          }}
        >
          Checkout
        </h1>
      </div>

      <div
        className="checkout-layout"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          padding: "24px 20px 60px",
        }}
      >
        {/* Address Form */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Delivery Address
          </p>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "14px" }}
          >
            <div
              className="form-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>Full Name</label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Anurag Singh"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="9876543210"
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>House No / Flat</label>
              <input
                name="houseNo"
                value={form.houseNo}
                onChange={handleChange}
                placeholder="B-42, 2nd Floor"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Area / Street</label>
              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                placeholder="Sector 17, Near Metro"
                style={inputStyle}
              />
            </div>

            <div
              className="form-row"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div>
                <label style={labelStyle}>City</label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="Chandigarh"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  placeholder="Punjab"
                  style={inputStyle}
                />
              </div>
            </div>

            <div style={{ width: "50%" }}>
              <label style={labelStyle}>Pincode</label>
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="160017"
                style={inputStyle}
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div
          className="checkout-summary"
          style={{ background: "#111", padding: "24px", borderRadius: "2px" }}
        >
          <p
            style={{
              fontSize: "11px",
              color: "#555",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "20px",
            }}
          >
            Order Summary
          </p>

          {cart?.products?.map(({ product, quantity }) => (
            <div
              key={product._id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", gap: "12px", alignItems: "center" }}
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
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "#e0ddd6",
                      marginBottom: "2px",
                    }}
                  >
                    {product.name}
                  </p>
                  <p style={{ fontSize: "10px", color: "#555" }}>
                    × {quantity}
                  </p>
                </div>
              </div>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "18px",
                  color: "#b5f542",
                }}
              >
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
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Subtotal
            </span>
            <span style={{ fontSize: "13px", color: "#888" }}>₹{total}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                color: "#555",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Delivery
            </span>
            <span style={{ fontSize: "13px", color: "#4ade80" }}>Free</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "28px",
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
                fontSize: "32px",
                color: "#b5f542",
              }}
            >
              ₹{total}
            </span>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#8fb832" : "#b5f542",
              color: "#0d0d0d",
              border: "none",
              borderRadius: "2px",
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Processing..." : `Pay ₹${total}`}
          </button>

          <p
            style={{
              textAlign: "center",
              fontSize: "10px",
              color: "#333",
              marginTop: "12px",
              letterSpacing: "1px",
            }}
          >
            Secured by Razorpay
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .checkout-layout { flex-direction: row !important; align-items: flex-start !important; padding: 32px 40px 80px !important; gap: 40px !important; }
          .checkout-summary { width: 380px !important; position: sticky; top: 76px; }
        }
        @media (max-width: 480px) {
          .form-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default Checkout;
