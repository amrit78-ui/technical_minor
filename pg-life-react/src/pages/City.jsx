import { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { propertyApi } from "../services/api";
import PGCard from "../components/PGCard";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import { Filter, SlidersHorizontal, Search, RotateCcw, MapPin, Sparkles } from "lucide-react";

export default function City() {
  const { name } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from query params
  const [gender, setGender] = useState(searchParams.get("gender") || "all");
  const [maxRent, setMaxRent] = useState(searchParams.get("maxRent") || 20000);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("rating_desc");

  // Fetch properties from MongoDB based on filters
  const fetchCityProperties = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        city: name.toLowerCase(),
        gender: gender !== "all" ? gender : undefined,
        maxRent: maxRent ? Number(maxRent) : undefined,
        search: searchKeyword.trim() ? searchKeyword.trim() : undefined,
        sortBy,
      };

      const res = await propertyApi.getAll(params);
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching city properties:", error);
    } finally {
      setLoading(false);
    }
  }, [name, gender, maxRent, searchKeyword, sortBy]);

  useEffect(() => {
    fetchCityProperties();
  }, [fetchCityProperties]);

  const handleResetFilters = () => {
    setGender("all");
    setMaxRent(20000);
    setSearchKeyword("");
    setSortBy("rating_desc");
    setSearchParams({});
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5 pb-5">
        {/* CITY BANNER HEADER */}
        <div className="city-header-banner p-4 p-md-5 mb-4 rounded">
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <span className="badge-featured mb-2">Explore Accommodations</span>
              <h1 className="city-title-display text-capitalize mb-1">{name} PGs & Hostels</h1>
              <p className="text-slate-300 fs-6 mb-0">
                Found <strong className="text-white fw-bold">{properties.length}</strong> verified student living spaces in {name}
              </p>
            </div>

            <div className="city-pill-switch d-flex gap-2 flex-wrap">
              {["delhi", "chandigarh", "bengaluru", "mohali"].map((c) => (
                <Link
                  key={c}
                  to={`/city/${c}`}
                  className={`city-switch-link ${c === name.toLowerCase() ? "active" : ""}`}
                >
                  {c.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT: FILTERS SIDEBAR + RESULTS */}
        <div className="row g-4">
          {/* FILTER SIDEBAR */}
          <div className="col-lg-3">
            <div className="filters-sidebar p-4 rounded sticky-top">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0 d-flex align-items-center gap-2 text-white fw-bold">
                  <SlidersHorizontal size={18} className="text-accent" /> Filters
                </h5>
                <button
                  type="button"
                  className="btn btn-link text-slate-300 fw-semibold btn-sm p-0 text-decoration-none"
                  onClick={handleResetFilters}
                >
                  <RotateCcw size={14} className="me-1 inline-icon" /> Reset
                </button>
              </div>

              {/* SEARCH KEYWORD */}
              <div className="filter-group mb-4">
                <label className="filter-label mb-2">Search Locality / Name</label>
                <div className="input-with-icon">
                  <Search size={15} className="input-lead-icon" />
                  <input
                    type="text"
                    className="form-control-dark"
                    placeholder="e.g. North Campus, Saket..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                  />
                </div>
              </div>

              {/* GENDER FILTER */}
              <div className="filter-group mb-4">
                <label className="filter-label mb-2">Resident Type</label>
                <div className="filter-radio-list">
                  {[
                    { id: "all", label: "All Residents" },
                    { id: "boys", label: "Boys PG Only" },
                    { id: "girls", label: "Girls PG Only" },
                    { id: "unisex", label: "Unisex / Co-living" },
                  ].map((g) => (
                    <label key={g.id} className="filter-radio-item">
                      <input
                        type="radio"
                        name="gender"
                        checked={gender === g.id}
                        onChange={() => setGender(g.id)}
                      />
                      <span>{g.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* BUDGET SLIDER */}
              <div className="filter-group mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="filter-label mb-0">Max Monthly Budget</label>
                  <span className="budget-val text-success fw-bold">₹{Number(maxRent).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  className="form-range"
                  min="6000"
                  max="20000"
                  step="500"
                  value={maxRent}
                  onChange={(e) => setMaxRent(e.target.value)}
                />
                <div className="d-flex justify-content-between text-muted extra-small">
                  <span>₹6k</span>
                  <span>₹20k+</span>
                </div>
              </div>

              {/* SORT BY */}
              <div className="filter-group mb-3">
                <label className="filter-label mb-2">Sort By</label>
                <select
                  className="form-control-dark"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="rating_desc">Top Rated First ⭐</option>
                  <option value="rent_asc">Rent: Low to High 💸</option>
                  <option value="rent_desc">Rent: High to Low 👑</option>
                </select>
              </div>
            </div>
          </div>

          {/* LISTINGS RESULTS COLUMN */}
          <div className="col-lg-9">
            {loading ? (
              <Loader />
            ) : properties.length === 0 ? (
              <div className="empty-state-box text-center p-5 rounded">
                <Search size={48} className="text-muted mb-3" />
                <h3>No Accommodations Found</h3>
                <p className="text-muted">
                  No PGs matched your active filter criteria in {name}. Try loosening your budget or selecting &apos;All Residents&apos;.
                </p>
                <button className="btn btn-gradient mt-2" onClick={handleResetFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="city-properties-list">
                {properties.map((pg) => (
                  <PGCard key={pg._id} pg={pg} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <h3 className="footer-logo">PG Life ✨</h3>
        <p className="footer-tagline">Find your comfort zone anywhere in India 🇮🇳</p>
        <p className="copyright">© 2026 PG Life • Designed with ❤️ by Himanshu</p>
      </footer>
    </>
  );
}