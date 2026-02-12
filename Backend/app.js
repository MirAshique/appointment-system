import express from "express";
import cors from "cors";

import notFound from "./src/middleware/notFoundMiddleware.js";
import errorHandler from "./src/middleware/errorMiddleware.js";

import serviceRoutes from "./src/routes/serviceRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminAuthRoutes from "./src/routes/adminAuthRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js"; // ✅ NEW

import path from "path";

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// Static uploads folder
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes); // ✅ NEW
app.use("/api/appointments", appointmentRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("EasyAppointments API is running...");
});

// ================= ERROR HANDLERS =================
app.use(notFound);
app.use(errorHandler);

export default app;
