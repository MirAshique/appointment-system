import express from "express";
import {
  createAppointment,
  getMyAppointments,
  getAllAppointments,
  updateAppointmentStatus,
  cancelAppointment,
  getAppointmentStats,
} from "../controllers/appointmentController.js";

import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";

const router = express.Router();

//
// 🔹 USER ROUTES
//
router.post("/", protect, createAppointment);
router.get("/my", protect, getMyAppointments);
router.delete("/:id", protect, cancelAppointment);

//
// 🔹 ADMIN ROUTES
//

// 🔥 Stats route (must come before "/")
router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getAppointmentStats
);

router.get("/", protect, authorizeRoles("admin"), getAllAppointments);

router.put(
  "/:id/status",
  protect,
  authorizeRoles("admin"),
  updateAppointmentStatus
);

export default router;
