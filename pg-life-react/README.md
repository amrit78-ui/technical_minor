# 🏡 PG Life — Full-Stack MERN Platform

A full-stack student & professional PG accommodation discovery and booking portal built with **React 19**, **Vite**, **Express**, and **MongoDB**.

---

## 🌟 Key Features

- **Backend & Database**:
  - Express REST API with MongoDB & Mongoose.
  - JWT Authentication with bcrypt password hashing.
  - Collections for Users, Properties, Bookings, and Reviews.
- **Modern UI & UX**:
  - Glassmorphic dark styling with custom gradients and responsive layouts.
  - Pure React modals (no bootstrap DOM memory leaks or stuck backdrops).
  - Global `AuthContext` with automatic token verification.
- **Search & Multi-Facet Filtering**:
  - Search by city, locality, and name.
  - Filter by resident type (Boys / Girls / Unisex).
  - Real-time budget slider and sorting (Top Rated, Rent Low-to-High, Rent High-to-Low).
- **Dedicated PG Details Page (`/pg/:id`)**:
  - Photo gallery with thumbnail preview.
  - Verified badges and room occupancy breakdown (Single, Double, Triple).
  - Building, room, and hygiene amenities.
  - Verified student reviews & review submission form.
- **Dynamic Booking & Confirmation Slip**:
  - Instant online booking with customizable duration and move-in date.
  - Printable/Downloadable booking confirmation receipt slip with booking reference ID.
- **Interactive Resident Dashboard**:
  - Overview metrics (Total Bookings, Saved in Wishlist, Total Active Spending).
  - Booking history with status tracking (*Confirmed*, *Cancelled*) and cancellation action.
  - Persistent MongoDB Wishlist.
  - Profile contact & college editor.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local instance running at `mongodb://127.0.0.1:27017/pglife` or MongoDB Atlas URI)

### 2. Environment Configuration
The backend configuration is located in `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/pglife
JWT_SECRET=pglife_super_secret_jwt_key_2026_himanshu
NODE_ENV=development
```

### 3. Seed the Database
Populate your MongoDB database with curated PGs and demo reviews:
```bash
npm run seed
```

### 4. Run the Project
Open two terminals:

**Terminal 1 — Backend API (port 5000):**
```bash
npm run server
```

**Terminal 2 — Frontend Client (port 5173):**
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📂 Project Structure

```
pg-life-react/
├── server/
│   ├── config/db.js              # MongoDB connection
│   ├── controllers/              # Auth, Property, Booking, Review controllers
│   ├── middleware/authMiddleware.js # JWT authentication guard
│   ├── models/                   # User, Property, Booking, Review schemas
│   ├── routes/                   # REST API routes
│   ├── seeds/seedData.js         # MongoDB database seeder
│   └── server.js                 # Express app entrypoint
├── src/
│   ├── components/               # Navbar, PGCard, AuthModal, BookingModal, BookingSlipModal
│   ├── context/AuthContext.jsx   # Global React authentication & wishlist context
│   ├── pages/                    # Home, City, PGDetail, Dashboard
│   ├── services/api.js           # Axios API client with auth interceptors
│   ├── style.css                 # Glassmorphic dark styling & responsive tokens
│   ├── App.jsx                   # Router & global modal providers
│   └── main.jsx
└── package.json
```
