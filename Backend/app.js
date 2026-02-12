import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import notFound from "./src/middleware/notFoundMiddleware.js";
import errorHandler from "./src/middleware/errorMiddleware.js";

import serviceRoutes from "./src/routes/serviceRoutes.js";
import appointmentRoutes from "./src/routes/appointmentRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import adminAuthRoutes from "./src/routes/adminAuthRoutes.js";
import categoryRoutes from "./src/routes/categoryRoutes.js";

// ================= FIX __dirname FOR ES MODULES =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: [
      "https://appointment-system-wheat-iota.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: false,
  })
);

app.use(express.json());

// ================= STATIC FILES =================

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminAuthRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/appointments", appointmentRoutes);

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.send("EasyAppointments API is running...");
});

// ================= ERROR HANDLERS =================
app.use(notFound);
app.use(errorHandler);

export default app;
