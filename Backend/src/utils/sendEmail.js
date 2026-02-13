import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    // 🔎 Debug: check if env variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("❌ EMAIL_USER or EMAIL_PASS is missing in environment variables");
      return;
    }

    console.log("📧 Sending email to:", to);
    console.log("🔐 Using SMTP user:", process.env.EMAIL_USER);

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.EMAIL_USER, // Brevo SMTP login
        pass: process.env.EMAIL_PASS, // Brevo SMTP key
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"EasyAppointments" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully:", info.response);

  } catch (error) {
    console.log("❌ Email sending error:", error.message);
  }
};

export default sendEmail;
