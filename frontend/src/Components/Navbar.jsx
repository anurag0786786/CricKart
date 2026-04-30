import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getUser, isAdmin } from "../utils/auth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [cartCount, setCartCount] = useState(0);
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

  const getInitial = () => {
    if (!token) return "U";
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.name?.charAt(0).toUpperCase() || "U"; // id ki jagah name
    } catch {
      return "U";
    }
  };

  const fetchCartCount = async () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:3000/cart/${userId}`);
      const total =
        res.data?.products?.reduce((sum, p) => sum + p.quantity, 0) || 0;
      setCartCount(total);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    fetchCartCount();
    const interval = setInterval(fetchCartCount, 3000);
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out!");
    setMenuOpen(false);
    setCartCount(0);
    navigate("/login");
  };

  const links = [
    { to: "/", label: "Home" },
    ...(isAdmin()
      ? [
          { to: "/category", label: "Category" },
          { to: "/product", label: "Product" },
          { to: "/admin/orders", label: "Orders" },
        ]
      : [{ to: "/orders", label: "Orders" }]),
  ];

  const CartIcon = () => (
    <Link
      to="/cart"
      style={{
        position: "relative",
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#888"
        strokeWidth="1.5"
      >
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            background: "#b5f542",
            color: "#0d0d0d",
            fontSize: "9px",
            fontWeight: "700",
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {cartCount}
        </span>
      )}
    </Link>
  );

  const ProfileAvatar = () => (
    <Link to="/profile" style={{ textDecoration: "none" }}>
      <div
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          background: "#1a1a1a",
          border: "1.5px solid #b5f542",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "14px",
          color: "#b5f542",
          cursor: "pointer",
        }}
      >
        {getInitial()}
      </div>
    </Link>
  );

  return (
    <>
      <nav
        style={{
          background: "#0d0d0d",
          borderBottom: "1px solid #1a1a1a",
          fontFamily: "'DM Sans', sans-serif",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          padding: "0 20px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxSizing: "border-box",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "26px",
              letterSpacing: "2px",
              color: "#f0ede6",
              margin: 0,
            }}
          >
            Cric<span style={{ color: "#b5f542" }}>Kart</span>
          </h1>
        </Link>

        {/* Desktop */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            {links.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                style={{
                  color: "#666",
                  fontSize: "12px",
                  letterSpacing: "1px",
                  textDecoration: "none",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </Link>
            ))}

            {/* Profile Avatar */}
            {token && <ProfileAvatar />}

            <CartIcon />

            {token ? (
              <button
                onClick={handleLogout}
                style={{
                  background: "#ff4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "2px",
                  padding: "6px 16px",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                style={{
                  background: "#b5f542",
                  color: "#0d0d0d",
                  borderRadius: "2px",
                  padding: "6px 16px",
                  fontSize: "11px",
                  fontWeight: "500",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Login
              </Link>
            )}
          </div>
        )}

        {/* Mobile */}
        {isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <CartIcon />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                padding: "4px",
              }}
            >
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#888",
                  display: "block",
                  transition: "all 0.2s",
                  transform: menuOpen
                    ? "rotate(45deg) translate(5px, 5px)"
                    : "none",
                }}
              />
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#888",
                  display: "block",
                  transition: "all 0.2s",
                  opacity: menuOpen ? 0 : 1,
                }}
              />
              <span
                style={{
                  width: "22px",
                  height: "2px",
                  background: "#888",
                  display: "block",
                  transition: "all 0.2s",
                  transform: menuOpen
                    ? "rotate(-45deg) translate(5px, -5px)"
                    : "none",
                }}
              />
            </button>
          </div>
        )}
      </nav>

      {/* Mobile Dropdown */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "56px",
            left: 0,
            right: 0,
            zIndex: 998,
            background: "#0d0d0d",
            borderBottom: "1px solid #1a1a1a",
            padding: "12px 20px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          {/* Profile link — mobile */}
          {token && (
            <Link
              to="/profile"
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#b5f542",
                fontSize: "13px",
                letterSpacing: "1px",
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "10px 0",
                borderBottom: "1px solid #151515",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  background: "#1a1a1a",
                  border: "1.5px solid #b5f542",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "11px",
                  color: "#b5f542",
                }}
              >
                {getInitial()}
              </div>
              Profile
            </Link>
          )}

          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMenuOpen(false)}
              style={{
                color: "#666",
                fontSize: "13px",
                letterSpacing: "1px",
                textDecoration: "none",
                textTransform: "uppercase",
                padding: "10px 0",
                borderBottom: "1px solid #151515",
              }}
            >
              {label}
            </Link>
          ))}

          {token ? (
            <button
              onClick={handleLogout}
              style={{
                marginTop: "8px",
                background: "#ff4444",
                color: "#fff",
                border: "none",
                borderRadius: "2px",
                padding: "10px",
                fontSize: "12px",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                marginTop: "8px",
                background: "#b5f542",
                color: "#0d0d0d",
                borderRadius: "2px",
                padding: "10px",
                fontSize: "12px",
                textTransform: "uppercase",
                letterSpacing: "1px",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
