import express from "express";
import {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Admin routes
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  createService
);
router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.single("image"),
  updateService
);
router.delete("/:id", protect, authorizeRoles("admin"), deleteService);

export default router;
