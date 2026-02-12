import Service from "../models/Service.js";

/* =========================================================
   CREATE SERVICE
   POST /api/services
   Admin
========================================================= */
export const createService = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      category,
      isPopular,
      pricingType,
      premiumMultiplier,
    } = req.body;

    const service = await Service.create({
      name,
      description,
      price,
      duration,
      category: category || null,
      image: req.file ? `/uploads/${req.file.filename}` : "",
      isPopular: isPopular || false,
      pricingType: pricingType || "standard",
      premiumMultiplier: premiumMultiplier || 1.2,
      isActive: true,
    });

    res.status(201).json(service);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET ALL SERVICES
   GET /api/services
   Public
========================================================= */
export const getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json(services);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   GET SINGLE SERVICE
   GET /api/services/:id
   Public
========================================================= */
export const getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate("category", "name");

    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.json(service);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE SERVICE
   PUT /api/services/:id
   Admin
========================================================= */
export const updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.name = req.body.name ?? service.name;
    service.description = req.body.description ?? service.description;
    service.price = req.body.price ?? service.price;
    service.duration = req.body.duration ?? service.duration;
    service.category = req.body.category ?? service.category;

    // ⭐ Popular control
    if (req.body.isPopular !== undefined) {
      service.isPopular = req.body.isPopular;
    }

    // 💎 Pricing type control
    if (req.body.pricingType) {
      service.pricingType = req.body.pricingType;
    }

    // 🔢 Premium multiplier control
    if (req.body.premiumMultiplier !== undefined) {
      service.premiumMultiplier = req.body.premiumMultiplier;
    }

    if (req.file) {
      service.image = `/uploads/${req.file.filename}`;
    }

    const updatedService = await service.save();

    res.json(updatedService);
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE SERVICE (SOFT DELETE)
   DELETE /api/services/:id
   Admin
========================================================= */
export const deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.isActive = false;
    await service.save();

    res.json({ message: "Service removed successfully" });
  } catch (error) {
    next(error);
  }
};
