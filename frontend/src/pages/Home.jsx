import { Link } from "react-router-dom";
import { useEffect } from "react";
import "../styles/home.css";
import heroImage from "../assets/hero.png";

const Home = () => {

  useEffect(() => {

    // ================= COUNTER ANIMATION =================
    const counters = document.querySelectorAll(".counter");

    const runCounter = (counter) => {
      const target = +counter.getAttribute("data-target");
      let count = 0;

      const update = () => {
        const increment = target / 100;

        if (count < target) {
          count += increment;
          counter.innerText = Math.ceil(count);
          setTimeout(update, 20);
        } else {
          counter.innerText = target.toLocaleString();
        }
      };

      update();
    };

    counters.forEach(counter => runCounter(counter));

    // ================= SCROLL REVEAL =================
    const revealElements = document.querySelectorAll(
      ".feature-card, .testimonial-card, .stat-item"
    );

    const revealOnScroll = () => {
      revealElements.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
          el.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", revealOnScroll);

  }, []);

  return (
    <div className="page-fade">

      {/* HERO SECTION */}
      <section className="hero">
        <div className="container hero-content">

          <div className="hero-text">
            <span className="hero-badge">
              🚀 Trusted Appointment Platform
            </span>

            <h1>
              Smart Appointment Booking
              <br />
              <span className="highlight">
                Made Simple & Professional
              </span>
            </h1>

            <p>
              Schedule, manage, and track appointments effortlessly.
              Designed for modern businesses who value speed, security,
              and simplicity.
            </p>

            <div className="hero-buttons">
              <Link to="/services" className="btn btn-primary btn-animate">
                Explore Services
              </Link>

              <Link to="/register" className="btn btn-outline btn-animate">
                Get Started Free
              </Link>
            </div>

            <div className="hero-trust">
              ✔ Secure & Encrypted &nbsp;&nbsp;
              ✔ Real-Time Updates &nbsp;&nbsp;
              ✔ Role-Based Access
            </div>
          </div>

          <div className="hero-image">
            <img src={heroImage} alt="Dashboard Preview" />
          </div>

        </div>
      </section>

      {/* STATS SECTION */}
      <section className="stats">
        <div className="container stats-grid">
          <div className="stat-item">
            <h3 className="counter" data-target="10000">0</h3>
            <p>Appointments Scheduled</p>
          </div>
          <div className="stat-item">
            <h3 className="counter" data-target="500">0</h3>
            <p>Active Businesses</p>
          </div>
          <div className="stat-item">
            <h3 className="counter" data-target="99">0</h3>
            <p>System Uptime %</p>
          </div>
          <div className="stat-item">
            <h3 className="counter" data-target="49">0</h3>
            <p>Customer Rating (x10)</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features container">
        <h2 className="section-title">
          Why Choose EasyAppointments?
        </h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>⚡ Fast Scheduling</h3>
            <p>
              Book appointments in seconds with a smooth and intuitive interface.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔐 Secure Platform</h3>
            <p>
              JWT protected system with modern security standards and encrypted sessions.
            </p>
          </div>

          <div className="feature-card">
            <h3>📊 Real-Time Tracking</h3>
            <p>
              Monitor appointment status instantly with live updates and smart management.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Clients Say</h2>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <p>
                “This system completely transformed how we manage bookings.
                Clean, fast, and reliable.”
              </p>
              <h4>— Sarah Khan</h4>
            </div>

            <div className="testimonial-card">
              <p>
                “The admin dashboard is powerful yet simple.
                My team loves using it.”
              </p>
              <h4>— Ali Raza</h4>
            </div>

            <div className="testimonial-card">
              <p>
                “Highly recommended for clinics and service businesses.
                Very professional.”
              </p>
              <h4>— Dr. Ahmed</h4>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="cta">
        <div className="container cta-content">
          <h2>Ready to Simplify Your Appointments?</h2>
          <Link to="/register" className="btn btn-primary btn-animate">
            Start Free Today
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
