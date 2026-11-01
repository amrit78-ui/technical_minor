import Review from "../models/Review.js";
import Property from "../models/Property.js";

// @desc Add review to property
// @route POST /api/reviews/:propertyId
export const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const { propertyId } = req.params;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const review = await Review.create({
      property: propertyId,
      user: req.user._id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
    });

    // Update property rating & count
    const reviews = await Review.find({ property: propertyId });
    const avgRating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    property.rating = Number(avgRating.toFixed(1));
    property.numReviews = reviews.length;
    await property.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
