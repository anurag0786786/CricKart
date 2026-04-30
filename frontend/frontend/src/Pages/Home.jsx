import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("https://crickart-mchl.onrender.com/product").then((res) => {
      const data = res.data.product || res.data.products || [];
      setProducts(data);
      setFiltered(data);
    });
    axios.get("https://crickart-mchl.onrender.com/category").then((res) => {
      setCategories(res.data || []);
    });
  }, []);

  const handleFilter = (catName, catId) => {
    setSearch("");
    if (catName === "all") {
      setActiveFilter("all");
      setFiltered(products);
    } else {
      setActiveFilter(catId);
      setFiltered(products.filter((p) => p.category?._id === catId));
    }
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setActiveFilter("all");
    setFiltered(
      val.trim() === ""
        ? products
        : products.filter((p) =>
            p.name.toLowerCase().includes(val.toLowerCase()),
          ),
    );
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
      {/* Hero */}
      <div
        style={{
          padding: "24px 16px 20px",
          borderBottom: "1px solid #1a1a1a",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(40px, 10vw, 72px)",
              lineHeight: 1,
              letterSpacing: "2px",
            }}
          >
            Cric<span style={{ color: "#b5f542" }}>Kart</span>
          </h1>
          <p
            style={{
              fontSize: "10px",
              color: "#444",
              marginTop: "6px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Premium cricket gear
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(24px, 6vw, 36px)",
              color: "#b5f542",
            }}
          >
            {products.length}
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#444",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Products
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #151515" }}>
        <div style={{ position: "relative" }}>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#555"
            strokeWidth="2"
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            style={{
              width: "100%",
              background: "#111",
              border: "1px solid #1e1e1e",
              borderRadius: "2px",
              padding: "10px 14px 10px 36px",
              color: "#f0ede6",
              fontSize: "13px",
              outline: "none",
              boxSizing: "border-box",
              letterSpacing: "0.5px",
            }}
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setFiltered(products);
              }}
              style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#555",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          padding: "14px 16px",
          borderBottom: "1px solid #151515",
          overflowX: "auto",
          scrollbarWidth: "none",
        }}
      >
        <button
          onClick={() => handleFilter("all")}
          style={{
            padding: "6px 14px",
            borderRadius: "20px",
            fontSize: "11px",
            fontWeight: "500",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            cursor: "pointer",
            border: `1px solid ${activeFilter === "all" ? "#b5f542" : "#222"}`,
            background: activeFilter === "all" ? "#b5f542" : "transparent",
            color: activeFilter === "all" ? "#0d0d0d" : "#555",
          }}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => handleFilter(cat.name, cat._id)}
            style={{
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "11px",
              fontWeight: "500",
              letterSpacing: "0.5px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              cursor: "pointer",
              border: `1px solid ${activeFilter === cat._id ? "#b5f542" : "#222"}`,
              background: activeFilter === cat._id ? "#b5f542" : "transparent",
              color: activeFilter === cat._id ? "#0d0d0d" : "#555",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding: "14px 16px 8px" }}>
        <span
          style={{
            fontSize: "10px",
            color: "#444",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          {search ? `Results for "${search}" — ` : ""}
          {filtered.length} products
        </span>
      </div>

      {/* Grid */}
      <div
        className="product-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "2px",
          padding: "0 0 40px",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "80px",
              color: "#333",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            No products found
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="product-card"
              onClick={() => navigate(`/product/${item._id}`)}
              style={{
                background: "#111",
                cursor: "pointer",
                position: "relative",
              }}
            >
              <div style={{ aspectRatio: "1", overflow: "hidden" }}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    transition: "transform 0.4s",
                  }}
                  onError={(e) => {
                    e.target.src =
                      "https://placehold.co/400x400/1a1a1a/333?text=?";
                  }}
                />
              </div>
              <div style={{ padding: "10px 10px 12px" }}>
                <div
                  style={{
                    fontSize: "9px",
                    color: "#555",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "3px",
                  }}
                >
                  {item.category?.name}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: "500",
                    color: "#e0ddd6",
                    marginBottom: "8px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.name}
                </div>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "20px",
                    color: "#b5f542",
                  }}
                >
                  ₹{item.price}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${item._id}`);
                  }}
                  style={{
                    marginTop: "10px",
                    width: "100%",
                    padding: "8px",
                    background: "#b5f542",
                    color: "#0d0d0d",
                    border: "none",
                    fontSize: "11px",
                    fontWeight: "500",
                    letterSpacing: "1px",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <style>{`
        @media (min-width: 640px) { .product-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (min-width: 1024px) { .product-grid { grid-template-columns: repeat(4, 1fr) !important; } }
        .product-card:hover img { transform: scale(1.08); }
        ::-webkit-scrollbar { display: none; }
        input::placeholder { color: #444; }
      `}</style>
    </div>
  );
};

export default Home;
