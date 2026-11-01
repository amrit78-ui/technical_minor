import mongoose from "mongoose";
import dotenv from "dotenv";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Booking from "../models/Booking.js";

dotenv.config();

const initialProperties = [
  // Delhi
  {
    name: "Ashray Living PG",
    city: "delhi",
    locality: "Kamla Nagar, North Campus",
    address: "Amitabh Banquet, Bungalow Road, Kamla Nagar, Delhi-110007",
    gender: "boys",
    rent: 9500,
    deposit: 15000,
    rating: 4.8,
    numReviews: 24,
    images: ["/images/dh1.jpg", "/images/dh2.jpg"],
    features: {
      building: "Lift, Power Backup, High-Speed Inverter, Biometric Lock",
      common: "WiFi 300Mbps, TV, RO Water Purifier, Dining Table, Sofa, Washing Machine",
      bedroom: "AC, 2 Single Beds, Orthopedic Mattresses, Study Table, Wardrobe",
      washroom: "Geyser, Western Toilet, 24/7 Hot Water",
    },
    roomPricing: { single: 14000, double: 9500, triple: 7500 },
    foodIncluded: true,
    isFeatured: true,
    rules: ["Gate closes at 11:00 PM", "Visitors allowed in lounge", "No smoking"],
  },
  {
    name: "Comfort Rooms PG",
    city: "delhi",
    locality: "Saket, South Delhi",
    address: "Metro near Made Easy, 9B, Lane 4, IGNOU Rd, Saket, New Delhi 110030",
    gender: "unisex",
    rent: 8000,
    deposit: 12000,
    rating: 4.2,
    numReviews: 18,
    images: ["/images/dh3.jpg", "/images/dh4.jpg"],
    features: {
      building: "Lift, 24/7 Security Guard, CCTV Monitoring",
      common: "WiFi, Dining Table, Automatic Washing Machine, Microwave",
      bedroom: "Spacious Room, 2 Beds, Wooden Almirah",
      washroom: "Geyser, Western Toilet, Modern Fittings",
    },
    roomPricing: { single: 12000, double: 8000, triple: 6500 },
    foodIncluded: false,
    isFeatured: false,
    rules: ["Entry until 10:30 PM", "Quiet hours after 11 PM", "Keep common areas clean"],
  },

  // Chandigarh
  {
    name: "Ganpati PG",
    city: "chandigarh",
    locality: "Kharar, Landran Road",
    address: "SCO-4, Shivalik, Near Children Park, Landran Road, Kharar - 140301",
    gender: "boys",
    rent: 8500,
    deposit: 10000,
    rating: 4.9,
    numReviews: 32,
    images: ["/images/ch1.jpg", "/images/ch3.jpg"],
    features: {
      building: "Lift, 100% Power Backup, Ample Bike Parking",
      common: "WiFi, Smart TV, Sofa Lounge, Purified Water",
      bedroom: "Split AC, Single Bed, Ergonomic Chair, Study Desk",
      washroom: "Instant Geyser, Exhaust, Premium Sanitaryware",
    },
    roomPricing: { single: 13000, double: 8500, triple: 6800 },
    foodIncluded: true,
    isFeatured: true,
    rules: ["Gate closes at 10:30 PM", "Clean dining habits required", "ID check for guests"],
  },
  {
    name: "Elite Luxury PG",
    city: "chandigarh",
    locality: "Bhago Majra, Kharar",
    address: "Bhagoo Majra Phirni, Kharar, Punjab 140413",
    gender: "girls",
    rent: 12000,
    deposit: 18000,
    rating: 5.0,
    numReviews: 45,
    images: ["/images/ch2.jpg", "/images/ch4.jpg"],
    features: {
      building: "Lift, 24x7 Inverter, High-res CCTV, Female Warden",
      common: "High-Speed WiFi, Dining Table, Fully Automatic Washing Machine, Smart TV",
      bedroom: "Dual Inverter AC, 2 Beds with Spring Mattresses, Private Balcony",
      washroom: "Premium Geyser, Shower Cubicle, Vanity Mirror",
    },
    roomPricing: { single: 18000, double: 12000, triple: 9500 },
    foodIncluded: true,
    isFeatured: true,
    rules: ["Female visitors only inside rooms", "Gate closes 10 PM", "Pure veg meals provided"],
  },

  // Bengaluru
  {
    name: "Stanza Living PG",
    city: "bengaluru",
    locality: "Sarjapura & Varthur",
    address: "53, Hadosiddapura Village, Varthur Hobli, Sarjapura, Bengaluru 560035",
    gender: "unisex",
    rent: 9000,
    deposit: 15000,
    rating: 4.6,
    numReviews: 29,
    images: ["/images/bg1.jpg", "/images/bg2.jpg"],
    features: {
      building: "Modern Elevator, Full Power Backup, 24/7 Tech Security",
      common: "Gigabit WiFi, Gaming Zone, Smart TV, Modern Cafe Dining",
      bedroom: "Inverter AC, 2 Comfortable Beds, Individual Lockers",
      washroom: "Continuous Hot Water Geyser, Premium Fixtures",
    },
    roomPricing: { single: 15000, double: 9000, triple: 7200 },
    foodIncluded: true,
    isFeatured: true,
    rules: ["App-based digital entry", "Visitors in clubhouse only", "Quiet hours after midnight"],
  },
  {
    name: "Modern Deluxe PG",
    city: "bengaluru",
    locality: "Koramangala 6th Block",
    address: "3rd cross, Patel Narayana Reddy Layout, No.7, 80 Feet Rd, Koramangala 560095",
    gender: "boys",
    rent: 8700,
    deposit: 12000,
    rating: 4.3,
    numReviews: 16,
    images: ["/images/bg3.jpg", "/images/bg4.jpg"],
    features: {
      building: "Heavy Duty Inverter, 24/7 CCTV, Daily Housekeeping",
      common: "High-speed WiFi, RO Purifier, Common Refrigerator",
      bedroom: "Spacious Non-AC/AC options, 2 Beds, Wooden Almirah",
      washroom: "Geyser, Western Toilet, Daily Sanitation",
    },
    roomPricing: { single: 13500, double: 8700, triple: 7000 },
    foodIncluded: false,
    isFeatured: false,
    rules: ["No loud music after 11 PM", "Smoking outdoors only", "Clean up after cooking"],
  },

  // Mohali
  {
    name: "The Ana House PG",
    city: "mohali",
    locality: "Sector 82 A, IT City",
    address: "Sector 82 A, 1269, IT City Rd, Sahibzada Ajit Singh Nagar, Mohali 140306",
    gender: "unisex",
    rent: 8500,
    deposit: 10000,
    rating: 4.1,
    numReviews: 14,
    images: ["/images/mh1.jpg", "/images/mh2.jpg"],
    features: {
      building: "Modern Lift, Power Backup, Secure Keyless Entry",
      common: "High-Speed WiFi, Big Screen TV, Cosy Sofa Set",
      bedroom: "Air Conditioned, 2 Beds, High Density Mattresses",
      washroom: "Fast-heating Geyser, Modern Fittings",
    },
    roomPricing: { single: 13000, double: 8500, triple: 6800 },
    foodIncluded: true,
    isFeatured: false,
    rules: ["Gate closes at 11 PM", "Parking allowed for residents", "Keep noise minimal"],
  },
  {
    name: "Luxury PG 80",
    city: "mohali",
    locality: "Sector 80",
    address: "Sector 80, Mauli Baidwan, Sahibzada Ajit Singh Nagar, Mohali 140308",
    gender: "girls",
    rent: 9200,
    deposit: 14000,
    rating: 4.7,
    numReviews: 22,
    images: ["/images/mh3.jpg", "/images/mh4.jpg"],
    features: {
      building: "Passenger Lift, Full CCTV Coverage, Security Guard, Power Backup",
      common: "High-Speed WiFi, Smart TV, Large Dining Space, Washing Machine",
      bedroom: "Air Conditioned, Queen Bed, Premium Mattress, Study Area",
      washroom: "Geyser, Designer Shower Panel, Large Vanity",
    },
    roomPricing: { single: 14500, double: 9200, triple: 7500 },
    foodIncluded: true,
    isFeatured: true,
    rules: ["Female resident security priority", "Gate closes 10:30 PM", "Fresh home-cooked food"],
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pglife";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing properties
    await Property.deleteMany({});
    console.log("Cleared old properties...");

    // Insert rich properties
    const inserted = await Property.insertMany(initialProperties);
    console.log(`✅ Successfully seeded ${inserted.length} properties into MongoDB!`);

    // Optional: Add sample reviews for top properties
    const sampleReviews = [
      {
        property: inserted[0]._id,
        userName: "Aman Sharma",
        rating: 5,
        comment: "Awesome amenities! The high-speed WiFi and food quality are unmatched in North Campus.",
      },
      {
        property: inserted[0]._id,
        userName: "Priya Verma",
        rating: 4,
        comment: "Very clean rooms, responsive caretaker. Highly recommended for students.",
      },
      {
        property: inserted[3]._id,
        userName: "Simran Kaur",
        rating: 5,
        comment: "Super safe and luxurious PG for girls in Kharar. Food is hygienic and tasty!",
      },
    ];

    // Create dummy user for reviews if not exists
    let demoUser = await User.findOne({ email: "student@demo.com" });
    if (!demoUser) {
      demoUser = await User.create({
        name: "Demo Student",
        email: "student@demo.com",
        password: "password123",
        phone: "9876543210",
        college: "Delhi University",
      });
      console.log("Created demo student account: student@demo.com / password123");
    }

    await Review.deleteMany({});
    for (const r of sampleReviews) {
      await Review.create({
        ...r,
        user: demoUser._id,
      });
    }
    console.log("✅ Seeded sample reviews!");

    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
