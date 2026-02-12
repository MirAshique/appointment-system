/* =====================================================
   SHARED EMAIL LAYOUT
===================================================== */
const emailLayout = (title, content, hotel = {}) => `
  <div style="font-family: Arial, sans-serif; background:#f8fafc; padding:30px">
    <div style="max-width:600px;margin:auto;background:white;border-radius:8px;overflow:hidden">
      
      <div style="background:#020617;color:white;padding:20px">
        <h2 style="margin:0">${hotel.hotelName || "Hotel Management"}</h2>
        <p style="margin:4px 0;font-size:13px">
          ${hotel.address || ""}
        </p>
      </div>

      <div style="padding:24px">
        <h3>${title}</h3>
        ${content}
      </div>

      <div style="background:#f1f5f9;padding:16px;font-size:13px;color:#334155">
        ${hotel.email ? `<p>Email: ${hotel.email}</p>` : ""}
        ${hotel.phone ? `<p>Phone: ${hotel.phone}</p>` : ""}
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
    `<p>Hello <strong>${name}</strong>,</p>
     <p>Your account has been created successfully.</p>
     <p>We’re excited to host you!</p>`
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
   BOOKING EMAILS
===================================================== */

export const bookingCreatedEmail = (room, checkIn, checkOut, hotel) =>
  emailLayout(
    "Booking Created 🏨",
    `
      <p>Your booking request has been created.</p>
      <p><strong>Room:</strong> ${room}</p>
      <p><strong>Check-in:</strong> ${checkIn}</p>
      <p><strong>Check-out:</strong> ${checkOut}</p>
      <p>Status: <strong>Pending confirmation</strong></p>
    `,
    hotel
  );

export const bookingCancelledEmail = (room, hotel) =>
  emailLayout(
    "Booking Cancelled ❌",
    `
      <p>Your booking for <strong>${room}</strong> has been cancelled.</p>
      ${hotel?.cancellationPolicy ? `<p>${hotel.cancellationPolicy}</p>` : ""}
    `,
    hotel
  );

/* =====================================================
   ADMIN EMAIL
===================================================== */

export const adminNotificationEmail = (message, hotel) =>
  emailLayout(
    "Admin Notification",
    `<p>${message}</p>`,
    hotel
  );
