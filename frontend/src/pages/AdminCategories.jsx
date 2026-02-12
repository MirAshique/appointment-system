import { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/adminCategories.css";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/categories");
      setCategories(res.data);
    } catch {
      alert("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/api/categories/${editingId}`, formData);
      } else {
        await API.post("/api/categories", formData);
      }

      setFormData({ name: "", description: "" });
      setEditingId(null);
      fetchCategories();
    } catch {
      alert("Operation failed");
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setFormData({
      name: category.name,
      description: category.description,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await API.delete(`/api/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Delete failed");
    }
  };

  return (
    <section className="admin-categories">
      <h2>Manage Categories</h2>

      {/* FORM */}
      <form className="category-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />

        <button type="submit" className="btn btn-primary">
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="categories-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(cat)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default AdminCategories;
