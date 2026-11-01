import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

// Helper to generate readable booking reference
const generateBookingId = () => {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `PGL-${year}-${randomNum}`;
};

// @desc Create a new booking
// @route POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { propertyId, roomType, months, moveInDate, paymentMethod } = req.body;

    if (!propertyId || !moveInDate) {
      return res.status(400).json({ message: "Property and move-in date are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const duration = Number(months) || 1;

    // Calculate room type rate
    let multiplier = 1.0;
    if (roomType === "Double") multiplier = 0.85;
    if (roomType === "Triple") multiplier = 0.75;

    const rentPerMonth = Math.round(property.rent * multiplier);
    const totalAmount = rentPerMonth * duration;

    const booking = await Booking.create({
      bookingId: generateBookingId(),
      user: req.user._id,
      property: property._id,
      roomType: roomType || "Single",
      months: duration,
      moveInDate,
      rentPerMonth,
      totalAmount,
      paymentMethod: paymentMethod || "UPI",
      paymentStatus: "Paid",
      bookingStatus: "Confirmed",
    });

    const populatedBooking = await Booking.findById(booking._id).populate("property");

    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get bookings for the authenticated user
// @route GET /api/bookings/my
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("property")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Cancel booking
// @route PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found or unauthorized" });
    }

    if (booking.bookingStatus === "Cancelled") {
      return res.status(400).json({ message: "Booking is already cancelled" });
    }

    booking.bookingStatus = "Cancelled";
    booking.cancellationReason = req.body.reason || "Cancelled by user";
    await booking.save();

    const updated = await Booking.findById(booking._id).populate("property");
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
