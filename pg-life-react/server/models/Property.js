import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Property name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      lowercase: true,
      index: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    locality: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: ["boys", "girls", "unisex"],
      default: "unisex",
    },
    rent: {
      type: Number,
      required: [true, "Rent is required"],
    },
    deposit: {
      type: Number,
      default: function () {
        return this.rent * 2;
      },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      building: {
        type: String,
        default: "Lift, Power Backup, CCTV",
      },
      common: {
        type: String,
        default: "WiFi, TV, RO Purifier, Washing Machine",
      },
      bedroom: {
        type: String,
        default: "AC, Bed, Mattress, Cupboard",
      },
      washroom: {
        type: String,
        default: "Geyser, Western Toilet",
      },
    },
    roomPricing: {
      single: { type: Number },
      double: { type: Number },
      triple: { type: Number },
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    foodIncluded: {
      type: Boolean,
      default: false,
    },
    rules: {
      type: [String],
      default: ["Gate closes at 11:00 PM", "Visitors allowed in common area", "Smoking strictly prohibited"],
    },
    contactPhone: {
      type: String,
      default: "+91 98765 43210",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);
