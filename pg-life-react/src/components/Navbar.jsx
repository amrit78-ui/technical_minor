import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, User, Sparkles, Building2, Heart } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, openAuthModal } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-3 px-md-5 sticky-top">
      <div className="container-fluid p-0">
        {/* LOGO */}
        <Link to="/" className="navbar-brand logo d-flex align-items-center gap-2">
          <span>PG Life</span>
          <span className="logo-badge">PRO</span>
        </Link>

        {/* CITY QUICK LINKS */}
        <div className="d-none d-md-flex align-items-center gap-3 ms-4 city-nav-links">
          <Link to="/city/delhi" className="nav-city-link">Delhi</Link>
          <Link to="/city/chandigarh" className="nav-city-link">Chandigarh</Link>
          <Link to="/city/bengaluru" className="nav-city-link">Bengaluru</Link>
          <Link to="/city/mohali" className="nav-city-link">Mohali</Link>
        </div>

        {/* RIGHT SIDE ACTIONS */}
        <div className="d-flex align-items-center gap-2 ms-auto">
          {!user ? (
            <>
              <button
                className="btn btn-outline-light nav-btn btn-sm px-3"
                type="button"
                onClick={() => openAuthModal("login")}
              >
                Login
              </button>

              <button
                className="btn btn-gradient nav-btn btn-sm px-3"
                type="button"
                onClick={() => openAuthModal("signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="d-flex align-items-center gap-2">
              <Link to="/dashboard" className="nav-user-pill d-flex align-items-center gap-2">
                <div className="user-avatar-circle">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="d-none d-sm-inline user-name-display">{user.name}</span>
              </Link>

              <button
                className="btn btn-gradient nav-btn btn-sm d-flex align-items-center gap-1"
                onClick={() => navigate("/dashboard")}
              >
                <LayoutDashboard size={15} />
                <span className="d-none d-sm-inline">Dashboard</span>
              </button>

              <button
                className="btn btn-outline-danger nav-btn btn-sm"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={15} />
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
