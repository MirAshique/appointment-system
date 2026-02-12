import Category from "../models/Category.js";

/* ================= CREATE CATEGORY ================= */
export const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Check if category already exists
    const existing = await Category.findOne({ name });

    if (existing) {
      return res.status(400).json({
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    res.status(201).json(category);

  } catch (error) {
    next(error);
  }
};


/* ================= GET ALL CATEGORIES ================= */
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(categories);
  } catch (error) {
    next(error);
  }
};

/* ================= UPDATE CATEGORY ================= */
export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = req.body.name || category.name;
    category.description =
      req.body.description || category.description;

    const updated = await category.save();

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

/* ================= DELETE CATEGORY (SOFT) ================= */
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.isActive = false;
    await category.save();

    res.json({ message: "Category removed successfully" });
  } catch (error) {
    next(error);
  }
};
