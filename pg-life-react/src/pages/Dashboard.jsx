import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bookingApi } from "../services/api";
import Navbar from "../components/Navbar";
import PGCard from "../components/PGCard";
import BookingSlipModal from "../components/BookingSlipModal";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import {
  User,
  Heart,
  Package,
  CreditCard,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  FileText,
  Sliders,
  Sparkles,
  Phone,
  GraduationCap,
  Mail,
  AlertCircle,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, updateProfile, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // overview, bookings, wishlist, settings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Profile edit state
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    college: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || "",
        phone: user.phone || "",
        college: user.college || "",
      });
    }
  }, [user]);

  // Load user bookings from API
  const loadBookings = async () => {
    try {
      setLoadingBookings(true);
      const res = await bookingApi.getMyBookings();
      setBookings(res.data);
    } catch (error) {
      console.error("Error loading bookings:", error);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking? This will release your reserved bed."
    );
    if (!confirmCancel) return;

    try {
      await bookingApi.cancel(bookingId, "Cancelled by student from dashboard");
      toast.info("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel booking");
    }
  };

  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    await updateProfile(profileForm);
    setSavingProfile(false);
  };

  if (authLoading) return <Loader />;

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="container mt-5 pt-5 text-center">
          <div className="dashboard-login-gate p-5 rounded mx-auto" style={{ maxWidth: 500 }}>
            <AlertCircle size={48} className="text-warning mb-3" />
            <h2>Login Required</h2>
            <p className="text-muted mb-4">
              Please sign in to access your dashboard, view active bookings, and manage favorites.
            </p>
            <button className="btn btn-gradient px-4 py-2" onClick={() => openAuthModal("login")}>
              Login Now 🚀
            </button>
          </div>
        </div>
      </>
    );
  }

  const favorites = user.favorites || [];
  const totalSpend = bookings.reduce((sum, b) => {
    if (b.bookingStatus !== "Cancelled") {
      return sum + (b.totalAmount || 0);
    }
    return sum;
  }, 0);

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5 pb-5">
        {/* HEADER GREETING */}
        <div className="dashboard-banner-header p-4 rounded mb-4">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div className="d-flex align-items-center gap-3">
              <div className="user-avatar-large">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="badge-featured-sm mb-1">Student Living Portal</span>
                <h2 className="dashboard-user-name mb-0">Welcome, {user.name}! 👋</h2>
                <p className="text-slate-300 small mb-0">{user.email} • {user.college || "College Resident"}</p>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm" onClick={() => navigate("/")}>
                Find More PGs
              </button>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="dashboard-tabs-bar mb-4 d-flex gap-2 border-bottom border-light-subtle pb-2 overflow-auto">
          {[
            { id: "overview", label: "Overview", icon: <Sliders size={16} /> },
            { id: "bookings", label: `My Bookings (${bookings.length})`, icon: <Package size={16} /> },
            { id: "wishlist", label: `Wishlist (${favorites.length})`, icon: <Heart size={16} /> },
            { id: "settings", label: "Profile & Settings", icon: <User size={16} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              className={`dashboard-tab-btn ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="dashboard-overview-tab">
            {/* STATS TILES */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="stat-card-modern p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="stat-card-sub text-slate-300 small">Total Bookings</span>
                      <h3 className="stat-card-val text-white mt-1 mb-0">{bookings.length}</h3>
                    </div>
                    <div className="stat-card-icon icon-purple">
                      <Package size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card-modern p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="stat-card-sub text-slate-300 small">Saved in Wishlist</span>
                      <h3 className="stat-card-val text-white mt-1 mb-0">{favorites.length}</h3>
                    </div>
                    <div className="stat-card-icon icon-pink">
                      <Heart size={24} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="stat-card-modern p-3 rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="stat-card-sub text-slate-300 small">Active Spending</span>
                      <h3 className="stat-card-val text-success mt-1 mb-0">₹{totalSpend.toLocaleString()}</h3>
                    </div>
                    <div className="stat-card-icon icon-green">
                      <CreditCard size={24} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TWO CARDS ROW: RECENT BOOKING + PROFILE INFO */}
            <div className="row g-4">
              <div className="col-lg-7">
                <div className="dashboard-content-box p-4 rounded h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Recent Bookings</h5>
                    <button
                      className="btn btn-link text-accent btn-sm p-0 text-decoration-none"
                      onClick={() => setActiveTab("bookings")}
                    >
                      View All →
                    </button>
                  </div>

                  {loadingBookings ? (
                    <p className="text-muted">Loading bookings...</p>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <Package size={36} className="mb-2 opacity-50" />
                      <p>You have not made any bookings yet.</p>
                      <button className="btn btn-gradient btn-sm" onClick={() => navigate("/city/delhi")}>
                        Explore PGs Now
                      </button>
                    </div>
                  ) : (
                    <div className="recent-bookings-list">
                      {bookings.slice(0, 2).map((b) => (
                        <div key={b._id} className="booking-summary-row p-3 rounded mb-2">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <h6 className="text-white mb-0">{b.property?.name || "PG Property"}</h6>
                            <span className={`status-pill ${b.bookingStatus === "Cancelled" ? "status-cancelled" : "status-confirmed"}`}>
                              {b.bookingStatus}
                            </span>
                          </div>
                          <p className="text-muted small mb-2">{b.property?.address}</p>
                          <div className="d-flex justify-content-between align-items-center text-muted extra-small">
                            <span>Ref: {b.bookingId} • {b.roomType} room ({b.months} mo)</span>
                            <span className="text-white fw-bold">₹{b.totalAmount?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-lg-5">
                <div className="dashboard-content-box p-4 rounded h-100">
                  <h5 className="mb-3">Resident Profile</h5>
                  <div className="profile-detail-list">
                    <div className="profile-item d-flex align-items-center gap-2 mb-2 pb-2 border-bottom border-secondary">
                      <User size={16} className="text-accent" />
                      <span className="text-muted small">Name:</span>
                      <strong className="text-white ms-auto">{user.name}</strong>
                    </div>
                    <div className="profile-item d-flex align-items-center gap-2 mb-2 pb-2 border-bottom border-secondary">
                      <Mail size={16} className="text-accent" />
                      <span className="text-muted small">Email:</span>
                      <strong className="text-white ms-auto">{user.email}</strong>
                    </div>
                    <div className="profile-item d-flex align-items-center gap-2 mb-2 pb-2 border-bottom border-secondary">
                      <Phone size={16} className="text-accent" />
                      <span className="text-muted small">Phone:</span>
                      <strong className="text-white ms-auto">{user.phone || "Not set"}</strong>
                    </div>
                    <div className="profile-item d-flex align-items-center gap-2 mb-3">
                      <GraduationCap size={16} className="text-accent" />
                      <span className="text-muted small">College:</span>
                      <strong className="text-white ms-auto">{user.college || "Not set"}</strong>
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-light btn-sm w-100"
                    onClick={() => setActiveTab("settings")}
                  >
                    Edit Profile Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === "bookings" && (
          <div className="dashboard-bookings-tab">
            <h4 className="mb-3">Your Bookings History</h4>
            {loadingBookings ? (
              <Loader />
            ) : bookings.length === 0 ? (
              <div className="empty-state-box text-center p-5 rounded">
                <Package size={48} className="text-muted mb-3" />
                <h3>No Bookings Yet</h3>
                <p className="text-muted">Browse our handpicked PGs in Delhi, Chandigarh, Bengaluru, or Mohali.</p>
                <button className="btn btn-gradient mt-2" onClick={() => navigate("/")}>
                  Find a PG Now
                </button>
              </div>
            ) : (
              <div className="bookings-table-wrapper">
                {bookings.map((b) => (
                  <div key={b._id} className="booking-card-full p-4 rounded mb-3">
                    <div className="row align-items-center g-3">
                      <div className="col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-1">
                          <span className={`status-pill ${b.bookingStatus === "Cancelled" ? "status-cancelled" : "status-confirmed"}`}>
                            {b.bookingStatus}
                          </span>
                          <span className="text-muted small">Ref: {b.bookingId}</span>
                        </div>
                        <h4 className="text-white mb-1">{b.property?.name || "PG Property"}</h4>
                        <p className="text-muted small mb-0">
                          <MapPin size={13} className="text-danger inline-icon me-1" />
                          {b.property?.address}
                        </p>
                      </div>

                      <div className="col-md-3">
                        <span className="text-muted small d-block">Move-in Date:</span>
                        <strong className="text-white">
                          <Calendar size={13} className="me-1 inline-icon" />
                          {new Date(b.moveInDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </strong>
                        <span className="text-muted small d-block mt-1">
                          {b.roomType} Room • {b.months} Months
                        </span>
                      </div>

                      <div className="col-md-3 text-md-end">
                        <span className="text-muted small d-block">Total Paid:</span>
                        <h4 className="text-success mb-2">₹{b.totalAmount?.toLocaleString()}</h4>
                        <div className="d-flex gap-2 justify-content-md-end">
                          <button
                            className="btn btn-outline-light btn-sm"
                            onClick={() => setSelectedSlip(b)}
                          >
                            <FileText size={14} className="me-1 inline-icon" /> Slip
                          </button>
                          {b.bookingStatus !== "Cancelled" && (
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancelBooking(b._id)}
                            >
                              <XCircle size={14} className="me-1 inline-icon" /> Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WISHLIST */}
        {activeTab === "wishlist" && (
          <div className="dashboard-wishlist-tab">
            <h4 className="mb-3">Saved Favorite PGs</h4>
            {favorites.length === 0 ? (
              <div className="empty-state-box text-center p-5 rounded">
                <Heart size={48} className="text-muted mb-3" />
                <h3>Your Wishlist is Empty</h3>
                <p className="text-muted">Click the heart icon on any PG card to save it here for quick access.</p>
                <button className="btn btn-gradient mt-2" onClick={() => navigate("/city/delhi")}>
                  Explore PGs
                </button>
              </div>
            ) : (
              <div className="row g-4">
                {favorites.map((pg) => {
                  const pgObj = typeof pg === "object" ? pg : { _id: pg, name: "Favorite PG" };
                  return (
                    <div className="col-12" key={pgObj._id}>
                      <PGCard pg={pgObj} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: PROFILE SETTINGS */}
        {activeTab === "settings" && (
          <div className="dashboard-settings-tab">
            <div className="dashboard-content-box p-4 rounded mx-auto" style={{ maxWidth: 600 }}>
              <h4 className="mb-2">Profile & Settings</h4>
              <p className="text-muted small mb-4">Update your personal contact details and college information</p>

              <form onSubmit={handleSaveProfile}>
                <div className="mb-3">
                  <label className="label-text mb-1">Full Name</label>
                  <input
                    type="text"
                    className="form-control-dark"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="label-text mb-1">Email Address</label>
                  <input
                    type="email"
                    className="form-control-dark opacity-50"
                    value={user.email}
                    disabled
                  />
                  <small className="text-muted">Email cannot be changed directly.</small>
                </div>

                <div className="mb-3">
                  <label className="label-text mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-control-dark"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="mb-4">
                  <label className="label-text mb-1">College / University</label>
                  <input
                    type="text"
                    className="form-control-dark"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    placeholder="e.g. Hansraj College, DU / Chandigarh University"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-gradient w-100 py-2 fw-bold"
                  disabled={savingProfile}
                >
                  {savingProfile ? "Saving Changes..." : "Save Profile Changes ✨"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* CONFIRMATION SLIP MODAL */}
      <BookingSlipModal
        booking={selectedSlip}
        isOpen={!!selectedSlip}
        onClose={() => setSelectedSlip(null)}
      />

      {/* FOOTER */}
      <footer className="footer">
        <h3 className="footer-logo">PG Life ✨</h3>
        <p className="footer-tagline">Find your comfort zone anywhere in India 🇮🇳</p>
        <p className="copyright">© 2026 PG Life • Full Stack Dashboard</p>
      </footer>
    </>
  );
}