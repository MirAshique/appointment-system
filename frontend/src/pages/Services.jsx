import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import "../styles/services.css";

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");
  const [pricingMode, setPricingMode] = useState("standard");

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get("/api/services");
      setServices(res.data);
    } catch (err) {
      console.error("Failed to fetch services");
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Failed to fetch categories");
    }
  };

  // CATEGORY FILTER
  const filteredServices = selectedCategory
    ? services.filter((s) => s.category?._id === selectedCategory)
    : services;

  // PRICING FILTER
  const pricingFiltered = filteredServices.filter((service) => {
    return service.pricingType === pricingMode;
  });

  // SORT
  const sortedServices = [...pricingFiltered].sort((a, b) => {
    if (sortOption === "low") return a.price - b.price;
    if (sortOption === "high") return b.price - a.price;
    if (sortOption === "duration") return a.duration - b.duration;
    return 0;
  });

  const getDisplayedPrice = (service) => {
    if (pricingMode === "premium") {
      return Math.round(
        service.price * (service.premiumMultiplier || 1.2)
      );
    }
    return service.price;
  };

  // SMART IMAGE HANDLER (Cloudinary + Old Uploads Support)
  const getImageUrl = (image) => {
    if (!image) return null;

    // If already full URL (Cloudinary)
    if (image.startsWith("http")) {
      return image;
    }

    // If old local upload (for backward compatibility)
    return `${import.meta.env.VITE_API_URL}${image}`;
  };

  return (
    <section className="services-section page-fade">
      <div className="container">

        <div className="services-header">
          <h2>Explore Our Professional Services</h2>
          <p>Choose, compare and book in seconds.</p>
        </div>

        {/* CONTROLS */}
        <div className="services-controls">

          {/* CATEGORY */}
          <div className="category-filter">
            <button
              className={`category-pill ${!selectedCategory ? "active" : ""}`}
              onClick={() => setSelectedCategory("")}
            >
              All
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                className={`category-pill ${
                  selectedCategory === cat._id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* SORT */}
          <div className="sort-box">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Sort By</option>
              <option value="low">Price: Low → High</option>
              <option value="high">Price: High → Low</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          {/* PRICING TOGGLE */}
          <div className="pricing-toggle">
            <button
              className={pricingMode === "standard" ? "active" : ""}
              onClick={() => setPricingMode("standard")}
            >
              Standard
            </button>
            <button
              className={pricingMode === "premium" ? "active" : ""}
              onClick={() => setPricingMode("premium")}
            >
              Premium
            </button>
          </div>

        </div>

        {/* GRID */}
        <div className="services-grid">

          {loading
            ? Array(6)
                .fill()
                .map((_, i) => (
                  <div key={i} className="service-card skeleton-card" />
                ))
            : sortedServices.map((service) => (
                <div key={service._id} className="service-card">

                  {service.isPopular && (
                    <div className="popular-badge">
                      ⭐ Most Popular
                    </div>
                  )}

                  {getImageUrl(service.image) ? (
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.name}
                      className="service-image"
                    />
                  ) : (
                    <div className="service-placeholder">📅</div>
                  )}

                  {service.category && (
                    <span className="category-tag">
                      {service.category.name}
                    </span>
                  )}

                  <div className="service-price">
                    ${getDisplayedPrice(service)}
                  </div>

                  <h3>{service.name}</h3>

                  <p className="service-desc">
                    {service.description}
                  </p>

                  <div className="service-meta">
                    ⏱ {service.duration} mins
                  </div>

                  <Link
                    to={`/book/${service._id}`}
                    className="btn btn-primary service-btn"
                  >
                    Book Now
                  </Link>

                </div>
              ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
