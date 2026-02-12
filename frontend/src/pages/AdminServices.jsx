import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import "../styles/adminServices.css";

const AdminServices = () => {
  const formRef = useRef(null);

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 5;

  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    isPopular: false,
  });

  const [image, setImage] = useState(null);

  /* ================= FETCH ================= */

  const fetchServices = async () => {
    try {
      const res = await API.get("/api/services");
      setServices(res.data);
    } catch (err) {
      alert("Failed to load services");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch (err) {
      console.log("Category fetch error");
    }
  };

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  /* ================= FORM HANDLING ================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
      category: "",
      isPopular: false,
    });
    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("duration", formData.duration);
      data.append("category", formData.category);
      data.append("isPopular", formData.isPopular);
      if (image) data.append("image", image);

      if (editingId) {
        // 🔥 UPDATE
        await API.put(`/api/services/${editingId}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // 🔥 CREATE
        await API.post("/api/services", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      resetForm();
      fetchServices();
    } catch (err) {
      alert("Operation failed");
    }
  };

  /* ================= EDIT ================= */

  const handleEdit = (service) => {
    setEditingId(service._id);

    setFormData({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category?._id || "",
      isPopular: service.isPopular || false,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= DELETE ================= */

  const deleteService = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await API.delete(`/api/services/${id}`);
      fetchServices();
    } catch (err) {
      alert("Delete failed");
    }
  };

  /* ================= FILTER ================= */

  const filteredServices = services.filter((service) => {
    const matchSearch = service.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory = selectedCategory
      ? service.category?._id === selectedCategory
      : true;

    return matchSearch && matchCategory;
  });

  /* ================= PAGINATION ================= */

  const indexOfLast = currentPage * servicesPerPage;
  const indexOfFirst = indexOfLast - servicesPerPage;
  const currentServices = filteredServices.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredServices.length / servicesPerPage
  );

  return (
    <section className="admin-services">
      <h2>Manage Services</h2>

      {/* ================= FORM ================= */}
      <form
        ref={formRef}
        className="service-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          placeholder="Service Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Service Description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="duration"
          placeholder="Duration (mins)"
          value={formData.duration}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <label className="popular-checkbox">
          <input
            type="checkbox"
            name="isPopular"
            checked={formData.isPopular}
            onChange={handleChange}
          />
          Mark as Popular
        </label>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Service" : "Add Service"}
          </button>

          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= TABLE ================= */}
      {currentServices.length > 0 && (
        <table className="services-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Popular</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {currentServices.map((service) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.category?.name}</td>
                <td>${service.price}</td>
                <td>{service.duration} mins</td>
                <td>
                  {service.isPopular ? (
                    <span className="badge-popular">Yes</span>
                  ) : (
                    <span className="badge-default">No</span>
                  )}
                </td>
                <td style={{ display: "flex", gap: "8px" }}>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => deleteService(service._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ================= PAGINATION ================= */}
      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1 ? "active-page" : ""
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminServices;
