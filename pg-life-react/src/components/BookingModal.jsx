import { useState } from "react";
import { X, Calendar, Home, CreditCard, Check, ShieldCheck, Sparkles, Clock, ArrowRight } from "lucide-react";
import { bookingApi } from "../services/api";
import { toast } from "react-toastify";

export default function BookingModal({ pg, isOpen, onClose, onBookingSuccess }) {
  const [roomType, setRoomType] = useState("Single");
  const [months, setMonths] = useState(1);
  const [moveInDate, setMoveInDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !pg) return null;

  // Pricing calculations
  let multiplier = 1.0;
  if (roomType === "Double") multiplier = 0.85;
  if (roomType === "Triple") multiplier = 0.75;

  const baseRent = pg.rent || 8000;
  const rentPerMonth = Math.round(baseRent * multiplier);
  const totalAmount = rentPerMonth * Number(months);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!moveInDate) {
      toast.warning("Please choose your move-in date 📅");
      return;
    }

    setSubmitting(true);
    try {
      const response = await bookingApi.create({
        propertyId: pg._id,
        roomType,
        months: Number(months),
        moveInDate,
        paymentMethod,
      });

      toast.success(`Booking Confirmed! Ref: ${response.data.bookingId} 🎉`);
      if (onBookingSuccess) {
        onBookingSuccess(response.data);
      }
      onClose();
    } catch (error) {
      const msg = error.response?.data?.message || "Booking failed. Please try again.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal-dialog booking-dialog-premium" onClick={(e) => e.stopPropagation()}>
        {/* CLOSE BUTTON */}
        <button className="custom-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* MODAL HEADER */}
        <div className="booking-modal-header mb-3 pb-2 border-bottom border-light-subtle">
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge-glow-purple">
              <Sparkles size={11} className="me-1 inline-icon" /> Fast Checkout
            </span>
            <span className="text-white-75 small text-uppercase fw-semibold tracking-wide">
              {pg.city?.toUpperCase()}
            </span>
          </div>
          <h3 className="modal-title text-white fw-bold mb-1">{pg.name}</h3>
          <p className="modal-address-sub mb-0">{pg.address}</p>
        </div>

        {/* COMPACT DYNAMIC PRICE BANNER */}
        <div className="price-glass-banner mb-3 p-3 rounded-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <span className="text-slate-300 small d-block">Configured Rate</span>
              <div className="d-flex align-items-baseline gap-1">
                <span className="fs-4 fw-black text-emerald">₹{rentPerMonth.toLocaleString()}</span>
                <span className="text-slate-400 small">/ mo ({roomType})</span>
              </div>
            </div>
            <div className="text-end">
              <span className="text-slate-300 small d-block">Estimated Total</span>
              <span className="fs-3 fw-black text-accent-gradient">₹{totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="booking-form-compact">
          {/* ROW 1: ROOM OCCUPANCY */}
          <div className="form-group mb-3">
            <label className="field-label-bold d-flex justify-content-between align-items-center mb-1">
              <span><Home size={14} className="me-1 inline-icon text-accent" /> Room Sharing Type</span>
              <span className="text-emerald small fw-semibold">
                {roomType === "Single" ? "Standard" : roomType === "Double" ? "Save 15%" : "Save 25%"}
              </span>
            </label>
            <div className="room-toggle-group">
              {[
                { type: "Single", label: "Single", discount: "Private" },
                { type: "Double", label: "Double", discount: "15% OFF" },
                { type: "Triple", label: "Triple", discount: "25% OFF" },
              ].map((item) => (
                <button
                  type="button"
                  key={item.type}
                  className={`room-toggle-pill ${roomType === item.type ? "active" : ""}`}
                  onClick={() => setRoomType(item.type)}
                >
                  <span className="toggle-main">{item.label}</span>
                  <span className="toggle-sub">{item.discount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ROW 2: MOVE-IN DATE & DURATION (SIDE-BY-SIDE) */}
          <div className="row g-2 mb-3">
            <div className="col-6">
              <label className="field-label-bold mb-1">
                <Calendar size={13} className="me-1 inline-icon text-accent" /> Move-in Date
              </label>
              <input
                type="date"
                className="form-control-glass w-100"
                value={moveInDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setMoveInDate(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <label className="field-label-bold mb-1 d-flex justify-content-between">
                <span><Clock size={13} className="me-1 inline-icon text-accent" /> Duration</span>
                <span className="text-accent fw-bold">{months} {months > 1 ? "mos" : "mo"}</span>
              </label>
              <select
                className="form-control-glass w-100"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 9, 12].map((m) => (
                  <option key={m} value={m}>
                    {m} {m === 1 ? "Month" : "Months"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ROW 3: COMPACT PAYMENT OPTIONS */}
          <div className="form-group mb-3">
            <label className="field-label-bold mb-1">
              <CreditCard size={14} className="me-1 inline-icon text-accent" /> Select Payment Method
            </label>
            <div className="payment-pills-row">
              {[
                { id: "UPI", label: "⚡ UPI", note: "Instant Confirmation" },
                { id: "Card", label: "💳 Card / NetBanking", note: "Debit / Credit" },
                { id: "Cash", label: "💵 Pay on Check-in", note: "At Property" },
              ].map((pm) => (
                <div
                  key={pm.id}
                  className={`payment-pill-card ${paymentMethod === pm.id ? "active" : ""}`}
                  onClick={() => setPaymentMethod(pm.id)}
                >
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="pm-title">{pm.label}</span>
                    {paymentMethod === pm.id && <Check size={14} className="text-emerald" />}
                  </div>
                  <span className="pm-note">{pm.note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRUST BADGE */}
          <div className="trust-pill-banner mb-3 py-1 px-2 d-flex align-items-center justify-content-center gap-1">
            <ShieldCheck size={14} className="text-emerald" />
            <span className="small text-slate-300">
              100% Verified PG • Zero Brokerage • Free Cancellation within 24h
            </span>
          </div>

          {/* ACTION BUTTON (ALWAYS VISIBLE & PROMINENT) */}
          <button
            type="submit"
            className="btn btn-gradient-glow w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
            disabled={submitting}
          >
            <span>{submitting ? "Securing Bed..." : `Confirm Booking • ₹${totalAmount.toLocaleString()}`}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
