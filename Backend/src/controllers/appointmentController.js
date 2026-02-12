import Appointment from "../models/Appointment.js";
import Service from "../models/Service.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

import {
  appointmentBookedEmail,
  appointmentApprovedEmail,
  appointmentCancelledEmail,
} from "../emails/templates.js";


/* =========================================================
   CREATE APPOINTMENT (User)
========================================================= */
export const createAppointment = async (req, res, next) => {
  try {
    const { serviceId, date, time, notes } = req.body;

    if (!serviceId || !date || !time) {
      return res.status(400).json({
        message: "Service, date and time are required",
      });
    }

    const service = await Service.findById(serviceId);

    if (!service || !service.isActive) {
      return res.status(404).json({
        message: "Service not available",
      });
    }

    const existingAppointment = await Appointment.findOne({
      service: serviceId,
      date,
      time,
      status: { $ne: "cancelled" },
    });

    if (existingAppointment) {
      return res.status(400).json({
        message: "This time slot is already booked",
      });
    }

    const appointment = await Appointment.create({
      user: req.user._id,
      service: serviceId,
      date,
      time,
      notes,
      paymentStatus: "paid",
      status: "pending",
    });

    try {
      const user = await User.findById(req.user._id);

      await sendEmail(
        user.email,
        "Appointment Booking Confirmation",
        appointmentBookedEmail(service.name, date, time)
      );
    } catch (emailError) {
      console.log("Booking email failed:", emailError.message);
    }

    res.status(201).json(appointment);

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   GET MY APPOINTMENTS (User)
========================================================= */
export const getMyAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      user: req.user._id,
    })
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(appointments);

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   GET ALL APPOINTMENTS (Admin)
========================================================= */
export const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("user", "name email")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(appointments);

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   UPDATE APPOINTMENT STATUS (Admin)
========================================================= */
export const updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "approved", "cancelled", "completed"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value",
      });
    }

    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    appointment.status = status;
    const updatedAppointment = await appointment.save();

    const user = await User.findById(appointment.user);
    const service = await Service.findById(appointment.service);

    try {
      if (status === "approved") {
        await sendEmail(
          user.email,
          "Appointment Approved",
          appointmentApprovedEmail(
            service.name,
            appointment.date,
            appointment.time
          )
        );
      }

      if (status === "cancelled") {
        await sendEmail(
          user.email,
          "Appointment Cancelled",
          appointmentCancelledEmail(
            service.name,
            appointment.date,
            appointment.time
          )
        );
      }

    } catch (emailError) {
      console.log("Status email failed:", emailError.message);
    }

    res.json(updatedAppointment);

  } catch (error) {
    next(error);
  }
};


/* =========================================================
   CANCEL APPOINTMENT (User)
========================================================= */
export const cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const user = await User.findById(appointment.user);
    const service = await Service.findById(appointment.service);

    try {
      await sendEmail(
        user.email,
        "Appointment Cancelled",
        appointmentCancelledEmail(
          service.name,
          appointment.date,
          appointment.time
        )
      );
    } catch (emailError) {
      console.log("Cancel email failed:", emailError.message);
    }

    res.json({
      message: "Appointment cancelled successfully",
    });

  } catch (error) {
    next(error);
  }
};
/* =========================================================
   ADMIN STATISTICS
========================================================= */
export const getAppointmentStats = async (req, res, next) => {
  try {
    const total = await Appointment.countDocuments();
    const pending = await Appointment.countDocuments({ status: "pending" });
    const approved = await Appointment.countDocuments({ status: "approved" });
    const completed = await Appointment.countDocuments({ status: "completed" });
    const cancelled = await Appointment.countDocuments({ status: "cancelled" });

    // Monthly bookings
    const monthlyBookings = await Appointment.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // Monthly revenue (approved + completed)
    const monthlyRevenue = await Appointment.aggregate([
      {
        $match: {
          status: { $in: ["approved", "completed"] },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData",
        },
      },
      { $unwind: "$serviceData" },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$serviceData.price" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json({
      total,
      pending,
      approved,
      completed,
      cancelled,
      monthlyBookings,
      monthlyRevenue,
    });

  } catch (error) {
    next(error);
  }
};
