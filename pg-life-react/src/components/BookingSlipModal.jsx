import { X, Printer, CheckCircle, MapPin, Calendar, CreditCard } from "lucide-react";

export default function BookingSlipModal({ booking, isOpen, onClose }) {
  if (!isOpen || !booking) return null;

  const property = booking.property || {};
  const moveIn = booking.moveInDate
    ? new Date(booking.moveInDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal-dialog booking-slip-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="custom-modal-close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="printable-slip p-4">
          {/* RECEIPT HEADER */}
          <div className="slip-header text-center pb-3 border-bottom border-secondary mb-3">
            <span className="slip-brand">PG Life ✨</span>
            <h4 className="mt-2 text-white">Booking Confirmation Slip</h4>
            <span className={`status-pill ${booking.bookingStatus === "Cancelled" ? "status-cancelled" : "status-confirmed"}`}>
              <CheckCircle size={14} className="me-1 inline-icon" /> {booking.bookingStatus || "Confirmed"}
            </span>
          </div>

          {/* BOOKING DETAILS TABLE */}
          <div className="slip-info-grid mb-4">
            <div className="info-block">
              <span className="info-label">Booking Reference</span>
              <span className="info-val text-accent fw-bold">{booking.bookingId}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Booked Date</span>
              <span className="info-val">
                {new Date(booking.createdAt || Date.now()).toLocaleDateString("en-IN")}
              </span>
            </div>
            <div className="info-block">
              <span className="info-label">Move-In Date</span>
              <span className="info-val"><Calendar size={13} className="me-1" />{moveIn}</span>
            </div>
            <div className="info-block">
              <span className="info-label">Room Type & Stay</span>
              <span className="info-val">{booking.roomType} ({booking.months} mo)</span>
            </div>
          </div>

          {/* PROPERTY INFO */}
          <div className="slip-property-box p-3 mb-3 rounded">
            <h5 className="mb-1 text-white">{property.name || "PG Property"}</h5>
            <p className="text-muted small mb-1">
              <MapPin size={13} className="me-1 inline-icon text-danger" />
              {property.address}
            </p>
            <p className="text-muted small mb-0">
              City: <strong className="text-white text-capitalize">{property.city}</strong>
            </p>
          </div>

          {/* FINANCIAL SUMMARY */}
          <div className="slip-financials p-3 rounded mb-4">
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary small">Monthly Rent</span>
              <span>₹{booking.rentPerMonth?.toLocaleString()}</span>
            </div>
            <div className="d-flex justify-content-between mb-1">
              <span className="text-secondary small">Duration</span>
              <span>{booking.months} Months</span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-secondary small">Payment Mode</span>
              <span><CreditCard size={13} className="me-1 inline-icon" />{booking.paymentMethod}</span>
            </div>
            <div className="d-flex justify-content-between pt-2 border-top border-secondary fw-bold text-white fs-5">
              <span>Total Paid</span>
              <span className="text-success">₹{booking.totalAmount?.toLocaleString()}</span>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="d-flex gap-2">
            <button className="btn btn-secondary w-50" onClick={handlePrint}>
              <Printer size={16} className="me-1" /> Print Slip
            </button>
            <button className="btn btn-gradient w-50" onClick={onClose}>
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
