import "../styles/footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top-gradient"></div>

      <div className="container footer-content">

        {/* BRAND */}
        <div className="footer-brand">
          <h3>EasyAppointments</h3>
          <p>
            Smart appointment booking platform designed for modern
            businesses. Fast, secure, and reliable scheduling solution.
          </p>

          <div className="footer-socials">
            <span>🌐</span>
            <span>🐦</span>
            <span>💼</span>
            <span>📸</span>
          </div>
        </div>

        {/* PRODUCT LINKS */}
        <div className="footer-links">
          <h4>Product</h4>
          <a href="#">Features</a>
          <a href="#">Pricing</a>
          <a href="#">Integrations</a>
          <a href="#">Security</a>
        </div>

        {/* COMPANY */}
        <div className="footer-links">
          <h4>Company</h4>
          <a href="#">About Us</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Support</a>
        </div>

        {/* CONTACT + NEWSLETTER */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p>Email: support@easyappointments.com</p>
          <p>Phone: +92 300 1234567</p>
          <p>Islamabad, Pakistan</p>

          <div className="newsletter">
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>

      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} EasyAppointments. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
