import Property from "../models/Property.js";
import Review from "../models/Review.js";

// @desc Get properties with filtering, searching, and sorting
// @route GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const { city, gender, minRent, maxRent, search, sortBy } = req.query;

    const query = {};

    if (city && city.toLowerCase() !== "all") {
      query.city = city.toLowerCase();
    }

    if (gender && gender.toLowerCase() !== "all") {
      query.gender = gender.toLowerCase();
    }

    if (minRent || maxRent) {
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { locality: { $regex: search, $options: "i" } },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === "rent_asc") sort = { rent: 1 };
    else if (sortBy === "rent_desc") sort = { rent: -1 };
    else if (sortBy === "rating_desc") sort = { rating: -1 };

    const properties = await Property.find(query).sort(sort);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get single property by ID with its reviews
// @route GET /api/properties/:id
export const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const reviews = await Review.find({ property: req.params.id }).sort({
      createdAt: -1,
    });

    res.json({
      property,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get summary count of PGs by city
// @route GET /api/properties/cities-summary
export const getCitiesSummary = async (req, res) => {
  try {
    const summary = await Property.aggregate([
      {
        $group: {
          _id: "$city",
          count: { $sum: 1 },
          minRent: { $min: "$rent" },
        },
      },
    ]);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create a new property
// @route POST /api/properties
export const createProperty = async (req, res) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
