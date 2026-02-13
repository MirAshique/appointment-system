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
   CREATE APPOINTMENT
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

    const user = await User.findById(req.user._id);

    await sendEmail({
      to: user.email,
      subject: "Appointment Booking Confirmation",
      html: appointmentBookedEmail(service.name, date, time),
    });

    res.status(201).json(appointment);

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

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    const user = await User.findById(appointment.user);
    const service = await Service.findById(appointment.service);

    if (status === "approved") {
      await sendEmail({
        to: user.email,
        subject: "Appointment Approved",
        html: appointmentApprovedEmail(
          service.name,
          appointment.date,
          appointment.time
        ),
      });
    }

    if (status === "cancelled") {
      await sendEmail({
        to: user.email,
        subject: "Appointment Cancelled",
        html: appointmentCancelledEmail(
          service.name,
          appointment.date,
          appointment.time
        ),
      });
    }

    res.json(appointment);

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
      return res.status(404).json({ message: "Appointment not found" });
    }

    appointment.status = "cancelled";
    await appointment.save();

    const user = await User.findById(appointment.user);
    const service = await Service.findById(appointment.service);

    await sendEmail({
      to: user.email,
      subject: "Appointment Cancelled",
      html: appointmentCancelledEmail(
        service.name,
        appointment.date,
        appointment.time
      ),
    });

    res.json({ message: "Appointment cancelled successfully" });

  } catch (error) {
    next(error);
  }
};
