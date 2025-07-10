import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "/styles/products.css";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [expandedProductId, setExpandedProductId] = useState(null);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
        setFiltered(data);
      } else {
        toast.error("Greška prilikom dohvatanja proizvoda");
        navigate("/");
      }
    } catch (error) {
      console.error("Greška:", error);
      toast.error("Greška u mreži");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(
        (p) =>
          p.naziv.toLowerCase().includes(search.toLowerCase()) ||
          p.sif_product.toString().includes(search)
      );
    }
    if (category) {
      result = result.filter(
        (p) =>
          p.categoryName?.toLowerCase() === category.toLowerCase()
      );
    }
    setFiltered(result);
  }, [search, category, products]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const toggleDetails = (productId) => {
    setExpandedProductId(productId === expandedProductId ? null : productId);
  };

  return (
    <div className="products-page">
      <header className="products-header">
        <img
          src="https://konovo.rs/wp-content/uploads/2025/07/Konovo-LOGO-letnja-akcija.png"
          alt="Konovo logo"
          className="header-logo"
        />

        <input
          type="text"
          className="search-input"
          placeholder="Pretraga proizvoda po nazivu"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-select"
        >
          <option value="">Sve kategorije</option>
          {Array.from(new Set(products.map((p) => p.categoryName)))
            .filter(Boolean)
            .map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <img
          src="https://konovo.rs/wp-content/uploads/2025/07/Konovo-LOGO-letnja-akcija.png"
          alt="Konovo logo"
          className="header-logo"
        />
      </header>

      <div className="logout-container">
        <button onClick={logout} className="logout-button">
          Odjavi se
        </button>
      </div>

      <div className="products-list">
        {filtered.map((product) => (
          <div key={product.id} className="content-product-imagin">
            <img
              src={
                product.imgsrc ||
                "https://konovo.rs/wp-content/uploads/2025/07/Letnja-akcija-text-mobile.png"
              }
              alt={product.naziv}
              className="product-image"
            />
            <div className="product-info">
              <h4>{product.naziv}</h4>
              <p>Šifra: {product.sif_product}</p>
              {product.categoryName !== "Monitori" && (
                <p>Cena: {product.price.toFixed(2)} RSD</p>
              )}
              {product.categoryName === "Monitori" && (
                <>
                  <p style={{ textDecoration: "line-through" }}>
                    Stara cena: {product.price.toFixed(2)} RSD
                  </p>
                  {product.newPrice != null && (
                    <p>Nova cena: {product.newPrice.toFixed(2)} RSD</p>
                  )}
                </>
              )}

              <button
                onClick={() => toggleDetails(product.id)}
                style={{
                  marginTop: "0.5rem",
                  background: "#fa4",
                  border: "none",
                  color: "#fff",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {expandedProductId === product.id
                  ? "Sakrij detalje"
                  : "Prikaži detalje"}
              </button>

              {expandedProductId === product.id && (
                <div
                  className="product-details"
                  style={{ marginTop: "1rem", fontSize: "0.9rem" }}
                >
                  <p>
                    <strong>SKU:</strong> {product.sku || "N/A"}
                  </p>
                  <p>
                    <strong>EAN:</strong> {product.ean || "N/A"}
                  </p>
                  <p>
                    <strong>PDV:</strong> {product.vat}%
                  </p>
                  <p>
                    <strong>Stanje:</strong> {product.stock}
                  </p>
                  <p>
                    <strong>Opis:</strong> {product.description}
                  </p>
                  <p>
                    <strong>Brend:</strong> {product.brandName}
                  </p>
                  <p>
                    <strong>Kategorija:</strong> {product.categoryName}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
