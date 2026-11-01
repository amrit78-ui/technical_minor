import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BookingModal from "./BookingModal";
import BookingSlipModal from "./BookingSlipModal";
import { Heart, Star, MapPin, ChevronLeft, ChevronRight, Eye, ShieldCheck, Sparkles } from "lucide-react";

export default function PGCard({ pg }) {
  const navigate = useNavigate();
  const { user, isFavorite, toggleFavorite, openAuthModal } = useAuth();

  const [activeImg, setActiveImg] = useState(0);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const images = pg.images && pg.images.length > 0 ? pg.images : ["/images/dh1.jpg"];
  const favorited = isFavorite(pg._id);

  const nextImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev + 1) % images.length);
  };

  const prevImg = (e) => {
    e.stopPropagation();
    setActiveImg((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    if (!user) {
      openAuthModal("login");
    } else {
      setIsBookingOpen(true);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(pg._id);
  };

  return (
    <>
      <div className="pg-card-modern mb-4">
        <div className="row g-0 align-items-center">
          {/* IMAGE COLUMN */}
          <div className="col-md-5 position-relative">
            <div className="card-media-wrapper" onClick={() => navigate(`/pg/${pg._id}`)}>
              <img
                src={images[activeImg]}
                alt={pg.name}
                className="card-media-img"
              />

              {/* OVERLAY BADGES */}
              <div className="card-top-badges">
                <span className={`gender-badge badge-${pg.gender || "unisex"}`}>
                  {pg.gender ? pg.gender.toUpperCase() : "UNISEX"}
                </span>
                {pg.isFeatured && (
                  <span className="badge-featured-sm">
                    <Sparkles size={11} className="me-1" /> Featured
                  </span>
                )}
              </div>

              {/* FAVORITE BUTTON */}
              <button
                className={`card-heart-btn ${favorited ? "active" : ""}`}
                onClick={handleFavoriteClick}
                title="Save to Wishlist"
              >
                <Heart size={18} fill={favorited ? "#ff4757" : "none"} color={favorited ? "#ff4757" : "#fff"} />
              </button>

              {/* CAROUSEL CONTROLS */}
              {images.length > 1 && (
                <>
                  <button className="carousel-nav-btn prev" onClick={prevImg}>
                    <ChevronLeft size={16} />
                  </button>
                  <button className="carousel-nav-btn next" onClick={nextImg}>
                    <ChevronRight size={16} />
                  </button>
                  <div className="carousel-dots">
                    {images.map((_, i) => (
                      <span
                        key={i}
                        className={`carousel-dot ${i === activeImg ? "active" : ""}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* DETAILS COLUMN */}
          <div className="col-md-7">
            <div className="card-body-content p-4">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h4
                    className="card-pg-name mb-1 cursor-pointer"
                    onClick={() => navigate(`/pg/${pg._id}`)}
                  >
                    {pg.name}
                  </h4>
                  <p className="card-pg-address mb-0">
                    <MapPin size={14} className="me-1 text-danger inline-icon" />
                    {pg.locality ? `${pg.locality}, ` : ""}{pg.address}
                  </p>
                </div>

                <div className="rating-pill">
                  <Star size={13} fill="#f59e0b" color="#f59e0b" className="me-1" />
                  <span>{pg.rating || 4.5}</span>
                </div>
              </div>

              {/* AMENITIES SNIPPET */}
              <div className="amenities-tag-row my-3">
                <span className="amenity-chip">⚡ 100% Power Backup</span>
                <span className="amenity-chip">📶 Fast Wi-Fi</span>
                <span className="amenity-chip">❄️ AC Room</span>
                <span className="amenity-chip">🧹 Daily Cleaning</span>
              </div>

              {/* PRICE & BUTTONS FOOTER */}
              <div className="card-footer-row pt-3 border-top border-light-subtle d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-slate-300 small d-block fw-semibold">Monthly Rent</span>
                  <div className="d-flex align-items-baseline gap-1">
                    <span className="card-price-val">₹{pg.rent?.toLocaleString()}</span>
                    <span className="text-slate-300 small fw-semibold">/ mo</span>
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-light btn-sm px-3"
                    onClick={() => navigate(`/pg/${pg._id}`)}
                  >
                    <Eye size={14} className="me-1 inline-icon" /> Details
                  </button>
                  <button
                    className="btn btn-gradient btn-sm px-4 fw-bold"
                    onClick={handleBookClick}
                  >
                    Book Now 🚀
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      <BookingModal
        pg={pg}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={(booking) => setConfirmedBooking(booking)}
      />

      {/* CONFIRMATION SLIP MODAL */}
      <BookingSlipModal
        booking={confirmedBooking}
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />
    </>
  );
}