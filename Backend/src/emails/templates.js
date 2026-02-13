/* =====================================================
   SHARED EMAIL LAYOUT
===================================================== */

const emailLayout = (title, content) => `
  <div style="font-family: Arial, sans-serif; background:#f1f5f9; padding:30px">
    <div style="max-width:600px;margin:auto;background:white;border-radius:8px;overflow:hidden">
      
      <div style="background:#1e293b;color:white;padding:20px">
        <h2 style="margin:0">EasyAppointments</h2>
        <p style="margin:4px 0;font-size:13px">
          Smart Appointment Booking System
        </p>
      </div>

      <div style="padding:24px;color:#334155">
        <h3>${title}</h3>
        ${content}
      </div>

      <div style="background:#f8fafc;padding:16px;font-size:13px;color:#64748b;text-align:center">
        © ${new Date().getFullYear()} EasyAppointments. All rights reserved.
      </div>

    </div>
  </div>
`;

/* =====================================================
   AUTH EMAILS
===================================================== */

export const welcomeEmail = (name) =>
  emailLayout(
    "Welcome 🎉",
    `
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your account has been created successfully.</p>
      <p>We’re excited to have you onboard!</p>
    `
  );

export const forgotPasswordEmail = (resetLink) =>
  emailLayout(
    "Reset Your Password 🔐",
    `
      <p>You requested a password reset.</p>
      <p>Click the button below to reset your password:</p>
      <p>
        <a href="${resetLink}"
           style="display:inline-block;padding:10px 16px;
           background:#2563eb;color:white;border-radius:6px;
           text-decoration:none">
          Reset Password
        </a>
      </p>
      <p>This link will expire in 15 minutes.</p>
    `
  );

/* =====================================================
   APPOINTMENT EMAILS
===================================================== */

export const appointmentBookedEmail = (service, date, time) =>
  emailLayout(
    "Appointment Booked 📅",
    `
      <p>Your appointment request has been created.</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>Status: <strong>Pending approval</strong></p>
    `
  );

export const appointmentApprovedEmail = (service, date, time) =>
  emailLayout(
    "Appointment Approved ✅",
    `
      <p>Your appointment has been approved.</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
      <p>We look forward to serving you!</p>
    `
  );

export const appointmentCancelledEmail = (service, date, time) =>
  emailLayout(
    "Appointment Cancelled ❌",
    `
      <p>Your appointment has been cancelled.</p>
      <p><strong>Service:</strong> ${service}</p>
      <p><strong>Date:</strong> ${date}</p>
      <p><strong>Time:</strong> ${time}</p>
    `
  );
