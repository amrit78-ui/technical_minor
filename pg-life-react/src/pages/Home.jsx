import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";
import { propertyApi } from "../services/api";
import { Search, MapPin, Users, ShieldCheck, Wifi, Utensils, Zap, Sparkles } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const [searchCity, setSearchCity] = useState("delhi");
  const [searchGender, setSearchGender] = useState("all");
  const [searchMaxRent, setSearchMaxRent] = useState(15000);
  const [featuredPGs, setFeaturedPGs] = useState([]);
  const [cityStats, setCityStats] = useState({});

  useEffect(() => {
    // Fetch featured PGs
    const loadHomeData = async () => {
      try {
        const [propsRes, statsRes] = await Promise.all([
          propertyApi.getAll({ sortBy: "rating_desc" }),
          propertyApi.getCitiesSummary(),
        ]);
        setFeaturedPGs(propsRes.data.slice(0, 3));

        const statsMap = {};
        statsRes.data.forEach((item) => {
          statsMap[item._id] = item;
        });
        setCityStats(statsMap);
      } catch (err) {
        console.error("Error loading home data:", err);
      }
    };

    loadHomeData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams();
    if (searchGender !== "all") query.append("gender", searchGender);
    if (searchMaxRent) query.append("maxRent", searchMaxRent);

    navigate(`/city/${searchCity}?${query.toString()}`);
  };

  const cities = [
    { id: "delhi", label: "Delhi", tagline: "North & South Campus hubs" },
    { id: "chandigarh", label: "Chandigarh", tagline: "City Beautiful & Mohali border" },
    { id: "bengaluru", label: "Bengaluru", tagline: "Silicon Valley Tech Parks" },
    { id: "mohali", label: "Mohali", tagline: "IT City & Education Zone" },
  ];

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="hero-modern position-relative text-center d-flex align-items-center justify-content-center">
        <div className="hero-overlay"></div>
        <div className="container hero-content-box position-relative z-index-2 py-5">
          <span className="hero-pill mb-3 d-inline-flex align-items-center gap-1">
            <Sparkles size={14} className="text-warning" /> India&apos;s #1 Verified Student & Professional Stay Platform
          </span>

          <h1 className="hero-display-title mb-3">
            Discover Your <span>Dream PG Stay</span>
          </h1>

          <p className="hero-subtitle-text mb-4 mx-auto">
            Smart Living • Zero Brokerage • Verified Amenities • Instant Digital Booking
          </p>

          {/* QUICK SEARCH WIDGET */}
          <form className="search-bar-widget mx-auto p-2" onSubmit={handleSearchSubmit}>
            <div className="row g-2 align-items-center text-start">
              {/* CITY SELECT */}
              <div className="col-md-4 col-sm-6">
                <div className="search-input-field p-2">
                  <label className="search-field-label">
                    <MapPin size={13} className="text-danger inline-icon me-1" /> Select City
                  </label>
                  <select
                    className="form-select-plain"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                  >
                    <option value="delhi">Delhi</option>
                    <option value="chandigarh">Chandigarh</option>
                    <option value="bengaluru">Bengaluru</option>
                    <option value="mohali">Mohali</option>
                  </select>
                </div>
              </div>

              {/* GENDER / OCCUPANCY */}
              <div className="col-md-3 col-sm-6">
                <div className="search-input-field p-2">
                  <label className="search-field-label">
                    <Users size={13} className="text-info inline-icon me-1" /> Looking For
                  </label>
                  <select
                    className="form-select-plain"
                    value={searchGender}
                    onChange={(e) => setSearchGender(e.target.value)}
                  >
                    <option value="all">Any Gender</option>
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="unisex">Unisex / Co-living</option>
                  </select>
                </div>
              </div>

              {/* BUDGET SLIDER */}
              <div className="col-md-3 col-sm-6">
                <div className="search-input-field p-2">
                  <label className="search-field-label d-flex justify-content-between">
                    <span>Max Budget</span>
                    <strong className="text-success">₹{Number(searchMaxRent).toLocaleString()}</strong>
                  </label>
                  <input
                    type="range"
                    className="form-range custom-slider mt-1"
                    min="5000"
                    max="20000"
                    step="500"
                    value={searchMaxRent}
                    onChange={(e) => setSearchMaxRent(e.target.value)}
                  />
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <div className="col-md-2 col-sm-6">
                <button type="submit" className="btn btn-gradient w-100 py-3 fw-bold search-submit-btn">
                  <Search size={16} className="me-1 inline-icon" /> Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* EXPLORE BY CITIES */}
      <section className="container my-5 py-3">
        <div className="text-center mb-4">
          <h2 className="section-heading">Explore By Prime Cities</h2>
          <p className="text-slate-300 fs-6">Handpicked verified accommodations near major colleges & IT hubs</p>
        </div>

        <div className="row g-4">
          {cities.map((city) => {
            const stat = cityStats[city.id];
            const count = stat?.count || 2;
            const minRent = stat?.minRent || 8000;

            return (
              <div className="col-lg-3 col-md-6" key={city.id}>
                <div
                  className="city-card-modern"
                  onClick={() => navigate(`/city/${city.id}`)}
                >
                  <div className="city-img-wrapper">
                    <img src={`/images/${city.id}.jpg`} alt={city.label} />
                    <div className="city-gradient-overlay"></div>
                    <span className="city-badge">{count} PGs Available</span>
                  </div>

                  <div className="city-card-info p-3">
                    <h4 className="city-name-title mb-1">{city.label}</h4>
                    <p className="city-tagline text-slate-300 small mb-2">{city.tagline}</p>
                    <span className="city-start-price text-accent small">
                      Starting @ ₹{minRent.toLocaleString()} / mo
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WHY PG LIFE */}
      <section className="why-section py-5 my-4">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-heading">Why Thousands Choose PG Life</h2>
            <p className="text-slate-300 fs-6">We eliminate brokers, hidden fees, and sketchy landlords</p>
          </div>

          <div className="row g-4">
            {[
              {
                icon: <Zap size={28} className="text-warning" />,
                title: "Zero Brokerage",
                desc: "100% transparent pricing directly from verified property owners. Save thousands on commissions.",
              },
              {
                icon: <Wifi size={28} className="text-primary" />,
                title: "High-Speed Wi-Fi & Backup",
                desc: "Uninterrupted gigabit connectivity and 24/7 power backup tailored for online classes & work from home.",
              },
              {
                icon: <Utensils size={28} className="text-success" />,
                title: "Hygienic Home Meals",
                desc: "Fresh 3-time daily meals prepared in sanitized kitchens with pure vegetarian and healthy options.",
              },
              {
                icon: <ShieldCheck size={28} className="text-danger" />,
                title: "Safe & Biometric Secure",
                desc: "CCTV surveillance, biometric entry gates, and verified on-site wardens for absolute peace of mind.",
              },
            ].map((feature, idx) => (
              <div className="col-md-3 col-sm-6" key={idx}>
                <div className="feature-card-modern p-4 text-center h-100">
                  <div className="feature-icon-wrapper mb-3">{feature.icon}</div>
                  <h5 className="feature-card-title mb-2">{feature.title}</h5>
                  <p className="feature-card-desc text-slate-300 small mb-0">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRENDING / TOP RATED SECTION */}
      {featuredPGs.length > 0 && (
        <section className="container my-5 py-3">
          <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
            <div>
              <h2 className="section-heading mb-1 text-white">Top Rated Student Stays</h2>
              <p className="text-slate-300 mb-0">Highest student satisfaction and modern amenities</p>
            </div>
            <button
              className="btn btn-outline-light btn-sm px-3"
              onClick={() => navigate("/city/delhi")}
            >
              View All Listings →
            </button>
          </div>

          <div className="featured-listings-grid">
            {featuredPGs.map((pg) => (
              <PGCard key={pg._id} pg={pg} />
            ))}
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer className="footer">
        <h3 className="footer-logo">PG Life ✨</h3>
        <p className="footer-tagline">Find your comfort zone anywhere in India 🇮🇳</p>

        <div className="footer-links">
          <span><a href="/city/delhi">Delhi</a></span>
          <span><a href="/city/chandigarh">Chandigarh</a></span>
          <span><a href="/city/bengaluru">Bengaluru</a></span>
          <span><a href="/city/mohali">Mohali</a></span>
        </div>

        <p className="copyright">© 2026 PG Life • Full Stack MERN Edition • Designed with ❤️</p>
      </footer>
    </>
  );
}