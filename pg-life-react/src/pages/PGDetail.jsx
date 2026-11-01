import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyApi, reviewApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import BookingModal from "../components/BookingModal";
import BookingSlipModal from "../components/BookingSlipModal";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  MapPin,
  Star,
  Heart,
  Share2,
  Shield,
  Zap,
  Coffee,
  CheckCircle2,
  PhoneCall,
  Clock,
  Sparkles,
  MessageSquare,
} from "lucide-react";

export default function PGDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, toggleFavorite, isFavorite, openAuthModal } = useAuth();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Review Form
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const res = await propertyApi.getById(id);
        setProperty(res.data.property);
        setReviews(res.data.reviews || []);
      } catch (error) {
        toast.error("Could not load PG details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.name,
        text: `Check out ${property?.name} on PG Life!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard! 📋");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      openAuthModal("login");
      return;
    }

    if (!reviewForm.comment.trim()) {
      toast.warning("Please enter your review text");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await reviewApi.add(property._id, reviewForm);
      setReviews([res.data, ...reviews]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Thank you for your review! ⭐");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Loader />;
  if (!property) return null;

  const images = property.images && property.images.length > 0
    ? property.images
    : ["/images/dh1.jpg"];

  const favorited = isFavorite(property._id);

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5 pb-5">
        {/* BREADCRUMB */}
        <div className="breadcrumb-nav mb-3 text-muted small">
          <span className="crumb-link" onClick={() => navigate("/")}>Home</span>
          <span className="mx-2">/</span>
          <span className="crumb-link text-capitalize" onClick={() => navigate(`/city/${property.city}`)}>
            {property.city}
          </span>
          <span className="mx-2">/</span>
          <span className="text-white">{property.name}</span>
        </div>

        {/* TOP TITLE BAR */}
        <div className="d-flex flex-wrap justify-content-between align-items-start mb-3 gap-2">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <span className={`gender-tag tag-${property.gender}`}>
                {property.gender?.toUpperCase()} PG
              </span>
              {property.isFeatured && (
                <span className="badge-featured">
                  <Sparkles size={12} className="me-1 inline-icon" /> Featured
                </span>
              )}
            </div>
            <h1 className="pg-detail-title">{property.name}</h1>
            <p className="pg-detail-address">
              <MapPin size={16} className="me-1 text-danger inline-icon" />
              {property.address}
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className={`btn-action-round ${favorited ? "active" : ""}`}
              onClick={() => toggleFavorite(property._id)}
              title="Save to Wishlist"
            >
              <Heart size={20} fill={favorited ? "#ff4757" : "none"} color={favorited ? "#ff4757" : "#fff"} />
            </button>
            <button className="btn-action-round" onClick={handleShare} title="Share PG">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* IMAGE GALLERY */}
        <div className="gallery-section mb-4">
          <div className="main-image-wrapper">
            <img
              src={images[activeImageIndex]}
              alt={property.name}
              className="main-detail-img"
            />
          </div>
          {images.length > 1 && (
            <div className="thumbnails-row mt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`thumbnail-box ${activeImageIndex === idx ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`Thumbnail ${idx}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* MAIN CONTENT + STICKY SIDEBAR */}
        <div className="row g-4">
          {/* LEFT COLUMN: SPECS, AMENITIES, RULES, REVIEWS */}
          <div className="col-lg-8">
            {/* QUICK STATS CARDS */}
            <div className="stats-row mb-4">
              <div className="quick-stat-box">
                <Star size={20} className="text-warning mb-1" fill="#f59e0b" />
                <span className="stat-number">{property.rating} / 5</span>
                <span className="stat-label">{reviews.length} reviews</span>
              </div>
              <div className="quick-stat-box">
                <Shield size={20} className="text-success mb-1" />
                <span className="stat-number">Verified</span>
                <span className="stat-label">100% Quality Checked</span>
              </div>
              <div className="quick-stat-box">
                <Coffee size={20} className="text-info mb-1" />
                <span className="stat-number">{property.foodIncluded ? "Included" : "Available"}</span>
                <span className="stat-label">Home Cooked Meals</span>
              </div>
              <div className="quick-stat-box">
                <Zap size={20} className="text-primary mb-1" />
                <span className="stat-number">Zero Brokerage</span>
                <span className="stat-label">Direct Admission</span>
              </div>
            </div>

            {/* ROOM SHARING OPTIONS */}
            <div className="detail-section mb-4">
              <h3 className="section-title">Available Room Sharing Options</h3>
              <div className="row g-3 mt-1">
                {[
                  {
                    title: "Single Room (Private)",
                    price: property.roomPricing?.single || Math.round(property.rent * 1.4),
                    tag: "Most Popular for Privacy",
                  },
                  {
                    title: "Double Sharing",
                    price: property.roomPricing?.double || property.rent,
                    tag: "Best Value",
                  },
                  {
                    title: "Triple Sharing",
                    price: property.roomPricing?.triple || Math.round(property.rent * 0.75),
                    tag: "Budget Friendly",
                  },
                ].map((room, i) => (
                  <div className="col-md-4" key={i}>
                    <div className="room-card-option p-3">
                      <span className="badge bg-secondary mb-2 small">{room.tag}</span>
                      <h5>{room.title}</h5>
                      <p className="room-price-val">₹{room.price.toLocaleString()} <span className="small text-muted">/ month</span></p>
                      <button
                        className="btn btn-outline-light btn-sm w-100"
                        onClick={() => {
                          if (!user) {
                            openAuthModal("login");
                          } else {
                            setIsBookingOpen(true);
                          }
                        }}
                      >
                        Select & Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DETAILED AMENITIES */}
            <div className="detail-section mb-4">
              <h3 className="section-title">Amenities & Facilities</h3>

              <div className="amenity-group mb-3">
                <h5 className="amenity-group-title">🏢 Building Amenities</h5>
                <p className="amenity-list-text">{property.features?.building}</p>
              </div>

              <div className="amenity-group mb-3">
                <h5 className="amenity-group-title">📺 Common Area</h5>
                <p className="amenity-list-text">{property.features?.common}</p>
              </div>

              <div className="amenity-group mb-3">
                <h5 className="amenity-group-title">🛏 Bedroom Essentials</h5>
                <p className="amenity-list-text">{property.features?.bedroom}</p>
              </div>

              <div className="amenity-group mb-3">
                <h5 className="amenity-group-title">🚿 Washroom & Hygiene</h5>
                <p className="amenity-list-text">{property.features?.washroom}</p>
              </div>
            </div>

            {/* HOUSE RULES */}
            <div className="detail-section mb-4">
              <h3 className="section-title">House Rules & Policies</h3>
              <div className="rules-list">
                {(property.rules || []).map((rule, idx) => (
                  <div key={idx} className="rule-item d-flex align-items-center gap-2 mb-2">
                    <CheckCircle2 size={18} className="text-success flex-shrink-0" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* STUDENT REVIEWS SECTION */}
            <div className="detail-section mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3 className="section-title mb-0">Verified Student Reviews</h3>
                <span className="badge bg-dark border border-secondary px-3 py-2">
                  <Star size={14} className="text-warning me-1 inline-icon" fill="#f59e0b" />
                  {property.rating} ({reviews.length} reviews)
                </span>
              </div>

              {/* WRITE A REVIEW FORM */}
              <div className="review-box-card p-3 mb-4 rounded">
                <h5 className="mb-2 text-white">Leave a Review</h5>
                {!user ? (
                  <p className="text-slate-300 small">
                    Please <span className="text-accent cursor-pointer fw-bold" onClick={() => openAuthModal("login")}>login</span> to share your experience with this PG.
                  </p>
                ) : (
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-2 d-flex align-items-center gap-2">
                      <label className="small text-slate-300 fw-bold">Your Rating:</label>
                      <select
                        className="form-control-dark select-sm w-auto"
                        value={reviewForm.rating}
                        onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                      >
                        <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                        <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                        <option value="3">⭐⭐⭐ (3 - Average)</option>
                        <option value="2">⭐⭐ (2 - Poor)</option>
                        <option value="1">⭐ (1 - Terrible)</option>
                      </select>
                    </div>

                    <div className="mb-2">
                      <textarea
                        className="form-control-dark w-100"
                        rows="3"
                        placeholder="Share your stay experience, food quality, hygiene, or connectivity..."
                        value={reviewForm.comment}
                        onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-gradient btn-sm"
                      disabled={submittingReview}
                    >
                      <MessageSquare size={14} className="me-1 inline-icon" />
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                )}
              </div>

              {/* REVIEWS LIST */}
              {reviews.length === 0 ? (
                <p className="text-slate-300">No reviews yet for this PG. Be the first to review!</p>
              ) : (
                <div className="reviews-flow">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="review-item-card p-3 mb-3 rounded">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="fw-bold text-white">{rev.userName}</span>
                        <span className="text-warning small">
                          {"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}
                        </span>
                      </div>
                      <p className="review-text mb-1">{rev.comment}</p>
                      <span className="text-slate-300 extra-small">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY BOOKING WIDGET */}
          <div className="col-lg-4">
            <div className="sticky-booking-widget p-4 rounded">
              <span className="text-slate-300 small fw-bold">Starting from</span>
              <div className="d-flex align-items-baseline gap-2 mb-2">
                <h2 className="price-big mb-0">₹{property.rent.toLocaleString()}</h2>
                <span className="text-slate-300 fw-semibold">/ month</span>
              </div>

              <div className="booking-perks py-2 mb-3 border-top border-bottom border-light-subtle">
                <div className="perk-row d-flex align-items-center gap-2 mb-1 small text-slate-300">
                  <CheckCircle2 size={15} className="text-success" />
                  <span>Deposit: ₹{(property.deposit || property.rent * 2).toLocaleString()}</span>
                </div>
                <div className="perk-row d-flex align-items-center gap-2 mb-1 small text-slate-300">
                  <Clock size={15} className="text-info" />
                  <span>Lock-in: 1 Month minimum</span>
                </div>
                <div className="perk-row d-flex align-items-center gap-2 small text-slate-300">
                  <PhoneCall size={15} className="text-warning" />
                  <span>Host Contact: {property.contactPhone || "+91 98765 43210"}</span>
                </div>
              </div>

              <button
                className="btn btn-gradient w-100 py-3 fw-bold mb-3 fs-5"
                onClick={() => {
                  if (!user) {
                    openAuthModal("login");
                  } else {
                    setIsBookingOpen(true);
                  }
                }}
              >
                Instant Book Now 🚀
              </button>

              <button
                className="btn btn-outline-light w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                onClick={() => {
                  window.location.href = `tel:${property.contactPhone || "9876543210"}`;
                }}
              >
                <PhoneCall size={16} /> Contact Host / Caretaker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BOOKING MODAL */}
      <BookingModal
        pg={property}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onBookingSuccess={(bookingData) => {
          setConfirmedBooking(bookingData);
        }}
      />

      {/* BOOKING SLIP MODAL */}
      <BookingSlipModal
        booking={confirmedBooking}
        isOpen={!!confirmedBooking}
        onClose={() => setConfirmedBooking(null)}
      />

      {/* FOOTER */}
      <footer className="footer">
        <h3 className="footer-logo">PG Life ✨</h3>
        <p className="footer-tagline">Find your comfort zone anywhere in India 🇮🇳</p>
        <p className="copyright">© 2026 PG Life • Built with full stack React & MongoDB</p>
      </footer>
    </>
  );
}
