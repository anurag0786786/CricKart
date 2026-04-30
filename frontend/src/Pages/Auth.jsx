import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      if (!isLogin) {
        // Register first
        await axios.post("https://crickart-mchl.onrender.com/auth/register", {
          name: form.name,
          email: form.email,
          password: form.password,
        });
        toast.success("Account created! Logging you in...");
      }

      // Then login
      const res = await axios.post("https://crickart-mchl.onrender.com/auth/login", {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem("token", res.data.token);
      toast.success(isLogin ? "Welcome back!" : "Registration successful!");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%",
    background: "#111",
    border: "1px solid #1e1e1e",
    borderRadius: "4px",
    padding: "12px 14px",
    color: "#f0ede6",
    fontSize: "14px",
    outline: "none",
  };

  const labelStyle = {
    fontSize: "11px",
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
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px" }}>
        {/* Logo */}
        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "52px",
            letterSpacing: "3px",
            color: "#f0ede6",
            textAlign: "center",
            marginBottom: "4px",
          }}
        >
          Cric<span style={{ color: "#b5f542" }}>Kart</span>
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "#444",
            fontSize: "12px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          {isLogin ? "Welcome back" : "Create your account"}
        </p>

        {/* Toggle */}
        <div
          style={{
            display: "flex",
            background: "#111",
            border: "1px solid #1e1e1e",
            borderRadius: "4px",
            marginBottom: "28px",
            padding: "4px",
          }}
        >
          {["Login", "Register"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setIsLogin(tab === "Login");
                setForm({ name: "", email: "", password: "" });
              }}
              style={{
                flex: 1,
                padding: "8px",
                fontSize: "12px",
                letterSpacing: "1px",
                textTransform: "uppercase",
                border: "none",
                cursor: "pointer",
                borderRadius: "2px",
                transition: "all 0.2s",
                background:
                  (tab === "Login") === isLogin ? "#b5f542" : "transparent",
                color: (tab === "Login") === isLogin ? "#0d0d0d" : "#555",
                fontWeight: (tab === "Login") === isLogin ? "500" : "400",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {!isLogin && (
            <div>
              <label style={labelStyle}>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={inputStyle}
              />
            </div>
          )}
          <div>
            <label style={labelStyle}>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              marginTop: "8px",
              width: "100%",
              padding: "13px",
              background: loading ? "#8fb832" : "#b5f542",
              color: "#0d0d0d",
              border: "none",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "500",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </div>

        <p
          style={{
            textAlign: "center",
            marginTop: "24px",
            fontSize: "13px",
            color: "#444",
          }}
        >
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setForm({ name: "", email: "", password: "" });
            }}
            style={{ color: "#b5f542", cursor: "pointer" }}
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
