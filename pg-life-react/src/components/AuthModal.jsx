import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { X, Mail, Lock, User, Phone, GraduationCap, Sparkles, ArrowRight } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, authModalMode, setAuthModalMode, login, register } = useAuth();

  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    college: "",
    agree: false,
  });

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;
    setLoading(true);
    await login(loginForm.email, loginForm.password);
    setLoading(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) return;
    if (!signupForm.agree) {
      alert("Please accept the terms and conditions");
      return;
    }
    setLoading(true);
    await register(signupForm);
    setLoading(false);
  };

  return (
    <div className="custom-modal-backdrop" onClick={closeAuthModal}>
      <div className="custom-modal-dialog auth-dialog-premium" onClick={(e) => e.stopPropagation()}>
        <button className="custom-modal-close" onClick={closeAuthModal} aria-label="Close">
          <X size={18} />
        </button>

        {/* Modal Header Tabs */}
        <div className="auth-tabs-pill mb-3">
          <button
            type="button"
            className={`auth-tab-pill-btn ${authModalMode === "login" ? "active" : ""}`}
            onClick={() => setAuthModalMode("login")}
          >
            Login to Account
          </button>
          <button
            type="button"
            className={`auth-tab-pill-btn ${authModalMode === "signup" ? "active" : ""}`}
            onClick={() => setAuthModalMode("signup")}
          >
            Create New Account
          </button>
        </div>

        {/* LOGIN FORM */}
        {authModalMode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="auth-form-body">
            <div className="mb-3 text-start">
              <h3 className="auth-title-large text-white mb-1">Welcome Back 👋</h3>
              <p className="text-slate-300 small mb-0">Access your verified bookings, wishlist & profile</p>
            </div>

            <div className="form-group mb-3 text-start">
              <label className="field-label-bold mb-1">Email Address</label>
              <div className="input-icon-box">
                <Mail size={16} className="input-icon-lead text-accent" />
                <input
                  type="email"
                  className="form-control-glass ps-5"
                  placeholder="name@college.edu or gmail"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4 text-start">
              <label className="field-label-bold mb-1">Password</label>
              <div className="input-icon-box">
                <Lock size={16} className="input-icon-lead text-accent" />
                <input
                  type="password"
                  className="form-control-glass ps-5"
                  placeholder="Enter your password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-gradient-glow w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              <span>{loading ? "Verifying..." : "Login to PG Life"}</span>
              <ArrowRight size={18} />
            </button>

            <div className="switch-auth-link mt-3 text-center">
              <span className="text-slate-300 small">Don&apos;t have an account? </span>
              <button
                type="button"
                className="btn-text-link fw-bold"
                onClick={() => setAuthModalMode("signup")}
              >
                Sign up free
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="auth-form-body">
            <div className="mb-3 text-start">
              <h3 className="auth-title-large text-white mb-1">Join PG Life ✨</h3>
              <p className="text-slate-300 small mb-0">Book verified PGs directly with zero brokerage</p>
            </div>

            <div className="form-group mb-2 text-start">
              <label className="field-label-bold mb-1">Full Name</label>
              <div className="input-icon-box">
                <User size={16} className="input-icon-lead text-accent" />
                <input
                  type="text"
                  className="form-control-glass ps-5"
                  placeholder="e.g. Himanshu Sharma"
                  value={signupForm.name}
                  onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="row g-2 mb-2">
              <div className="col-12 col-md-6 text-start">
                <label className="field-label-bold mb-1">Email</label>
                <div className="input-icon-box">
                  <Mail size={16} className="input-icon-lead text-accent" />
                  <input
                    type="email"
                    className="form-control-glass ps-5"
                    placeholder="email@example.com"
                    value={signupForm.email}
                    onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 text-start">
                <label className="field-label-bold mb-1">Password</label>
                <div className="input-icon-box">
                  <Lock size={16} className="input-icon-lead text-accent" />
                  <input
                    type="password"
                    className="form-control-glass ps-5"
                    placeholder="Min 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row g-2 mb-3">
              <div className="col-12 col-md-6 text-start">
                <label className="field-label-bold mb-1">Phone Number</label>
                <div className="input-icon-box">
                  <Phone size={16} className="input-icon-lead text-accent" />
                  <input
                    type="tel"
                    className="form-control-glass ps-5"
                    placeholder="+91 98765 43210"
                    value={signupForm.phone}
                    onChange={(e) => setSignupForm({ ...signupForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 text-start">
                <label className="field-label-bold mb-1">College / Work</label>
                <div className="input-icon-box">
                  <GraduationCap size={16} className="input-icon-lead text-accent" />
                  <input
                    type="text"
                    className="form-control-glass ps-5"
                    placeholder="College Name"
                    value={signupForm.college}
                    onChange={(e) => setSignupForm({ ...signupForm, college: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="form-check text-start mb-3">
              <input
                type="checkbox"
                id="agreeTerms"
                className="form-check-input"
                checked={signupForm.agree}
                onChange={(e) => setSignupForm({ ...signupForm, agree: e.target.checked })}
                required
              />
              <label htmlFor="agreeTerms" className="form-check-label text-slate-300 small cursor-pointer">
                I accept the <span className="text-white fw-bold">Terms of Stay</span> & Privacy Policy
              </label>
            </div>

            <button type="submit" className="btn btn-gradient-glow w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2" disabled={loading}>
              <span>{loading ? "Creating Profile..." : "Create Account 🚀"}</span>
              <ArrowRight size={18} />
            </button>

            <div className="switch-auth-link mt-3 text-center">
              <span className="text-slate-300 small">Already registered? </span>
              <button
                type="button"
                className="btn-text-link fw-bold"
                onClick={() => setAuthModalMode("login")}
              >
                Log in here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
