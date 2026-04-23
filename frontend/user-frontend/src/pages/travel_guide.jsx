import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './TravelGuides.css';

const TravelGuides = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    slotDate: "",
    slotTime: "",
    tourType: "",
    groupSize: 1,
    notes: "",
  });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const assetBase = apiBase.replace(/\/api\/?$/, "");

  const resolveImageUrl = (guide) => {
    if (!guide || !guide.image) {
      // Use a generic avatar instead of a specific photograph if the guide hasn't uploaded one
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(guide?.name || "Guide")}&background=random&size=400`;
    }
    const imageUrl = guide.image;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    const normalized = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
    return `${assetBase}${normalized}`;
  };

  const renderStars = (rating) => {
    const rounded = Math.round(Number(rating) || 0);
    return Array.from({ length: 5 }).map((_, idx) => (
      <svg
        key={idx}
        className={idx < rounded ? "star-icon star-icon-filled" : "star-icon"}
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.968a1 1 0 00.95.69h4.17c.969 0 1.371 1.24.588 1.81l-3.374 2.452a1 1 0 00-.364 1.118l1.286 3.968c.3.921-.755 1.688-1.538 1.118l-3.374-2.452a1 1 0 00-1.175 0l-3.374 2.452c-.783.57-1.838-.197-1.538-1.118l1.286-3.968a1 1 0 00-.364-1.118L2.002 9.395c-.783-.57-.38-1.81.588-1.81h4.17a1 1 0 00.95-.69l1.286-3.968z" />
      </svg>
    ));
  };

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const response = await api.get('/users/guides');
        setGuides(response.data.guides);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching guides:', err);
        setError('Failed to load travel guides. Please try again later.');
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const openGuide = (guide) => {
    setSelectedGuide(guide);
    setIsModalOpen(true);
    setBookingForm({
      slotDate: "",
      slotTime: "",
      tourType: "",
      groupSize: 1,
      notes: "",
    });
    setBookingError("");
    setBookingSuccess("");
  };

  const closeGuide = () => {
    setIsModalOpen(false);
    setSelectedGuide(null);
    setBookingError("");
    setBookingSuccess("");
  };

  const handleBookingChange = (patch) => {
    setBookingForm((prev) => ({ ...prev, ...patch }));
  };

  const submitBooking = async () => {
    if (!selectedGuide) return;
    setBookingError("");
    setBookingSuccess("");

    if (!bookingForm.slotDate || !bookingForm.slotTime) {
      setBookingError("Please select a date and time.");
      return;
    }

    setBookingSubmitting(true);
    try {
      await api.post("/users/guide-bookings", {
        guideId: selectedGuide._id,
        slotDate: bookingForm.slotDate,
        slotTime: bookingForm.slotTime,
        tourType: bookingForm.tourType,
        groupSize: bookingForm.groupSize,
        notes: bookingForm.notes,
      });

      setBookingSuccess("Booking confirmed. You can review your guide after the tour in your dashboard.");
    } catch (err) {
      setBookingError(err?.response?.data?.message || "Unable to book this guide. Please try again.");
    } finally {
      setBookingSubmitting(false);
    }
  };

  const filteredGuides = guides.filter(guide => {
    const guideName = guide.name || '';
    const guideLocation = guide.city || guide.state || '';
    return (
      guideName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (locationFilter === "" || guideLocation.toLowerCase().includes(locationFilter.toLowerCase()))
    );
  });

  const uniqueLocations = [...new Set(guides.map(g => g.city || g.state).filter(Boolean))];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <p className="error-title">Oops!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page-container">
      <div className="guides-content-wrapper">
        <div className="guides-header">
          <h1 className="guides-title">
            Meet Our Expert Local Guides
          </h1>
          <p className="guides-subtitle">
            Discover your dream destinations through the eyes and expertise of our passionate, knowledgeable local travel guides. Connect and book your personalized experience!
          </p>
        </div>

        {/* Filters */}
        <div className="guides-filters">
          <div className="search-input-wrapper">
            <div className="search-icon-wrapper">
              <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search guides by name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="location-select-wrapper">
            <select
              className="location-select"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Guide Grid */}
        <div className="guides-grid">
          {filteredGuides.map((guide) => (
            <div key={guide._id} className="guide-card">
              <button type="button" className="guide-image-wrapper" onClick={() => openGuide(guide)}>
                <img
                  src={resolveImageUrl(guide)}
                  alt={guide.name}
                  className="guide-image"
                />
                <div className="guide-image-overlay"></div>
                <div className="guide-image-content">
                  <div>
                    <h3 className="guide-name">{guide.name}</h3>
                    <p className="guide-meta">{guide.experience || "New Guide"}</p>
                  </div>
                  <div className="guide-rating">
                    <div className="guide-rating-stars">{renderStars(guide.rating)}</div>
                    <span>{guide.rating > 0 ? guide.rating : "New"}</span>
                  </div>
                </div>
              </button>

              <div className="guide-details">
                <div className="guide-stats">
                  <div className="guide-reviews">
                    {guide.reviewsCount > 0 ? `${guide.reviewsCount} reviews` : "No reviews yet"}
                  </div>
                  <div className="guide-price-wrapper">
                    <span className="guide-price">₹{guide.fee || 0}</span>
                    <span className="guide-price-unit">/ day</span>
                  </div>
                </div>

                <div className="guide-specialties-wrapper">
                  <p className="guide-section-title">Speciality</p>
                  <div className="guide-specialties">
                    <span className="guide-specialty">{guide.speciality || "Local Experiences"}</span>
                  </div>
                </div>

                <div className="guide-languages-wrapper">
                  <p className="guide-section-title">Languages</p>
                  <p className="guide-languages">
                    <svg className="guide-languages-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path>
                    </svg>
                    {(guide.languages && guide.languages.length > 0) ? guide.languages.join(", ") : "English, Hindi"}
                  </p>
                </div>

                <button className="guide-book-button" onClick={() => openGuide(guide)}>
                  View Profile & Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && !loading && (
          <div className="no-guides-message">
            <svg className="no-guides-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="no-guides-title">No guides found</p>
            <p className="no-guides-subtitle">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {isModalOpen && selectedGuide && (
        <div className="guide-modal-overlay" role="dialog" aria-modal="true">
          <div className="guide-modal">
            <button className="guide-modal-close" onClick={closeGuide} aria-label="Close">
              <span aria-hidden="true">x</span>
            </button>

            <div className="guide-modal-header">
              <div className="guide-modal-image">
                <img src={resolveImageUrl(selectedGuide)} alt={selectedGuide.name} />
              </div>
              <div className="guide-modal-summary">
                <h2>{selectedGuide.name}</h2>
                <p className="guide-modal-meta">{selectedGuide.speciality || "Local Experiences"}</p>
                <div className="guide-modal-rating">
                  <div className="guide-rating-stars">{renderStars(selectedGuide.rating)}</div>
                  <span>{selectedGuide.rating > 0 ? selectedGuide.rating : "New"}</span>
                  <span className="guide-modal-reviews">({selectedGuide.reviewsCount || 0} reviews)</span>
                </div>
                <div className={selectedGuide.available ? "guide-availability available" : "guide-availability unavailable"}>
                  {selectedGuide.available ? "Available for bookings" : "Currently unavailable"}
                </div>
              </div>
            </div>

            <div className="guide-modal-grid">
              <div className="guide-modal-section">
                <h3>About</h3>
                <p>{selectedGuide.about || "No description provided."}</p>
                <div className="guide-modal-info">
                  <div>
                    <span>Experience</span>
                    <strong>{selectedGuide.experience || "New Guide"}</strong>
                  </div>
                  <div>
                    <span>Degree</span>
                    <strong>{selectedGuide.degree || "Certified Guide"}</strong>
                  </div>
                  <div>
                    <span>Fee</span>
                    <strong>₹{selectedGuide.fee || 0} / day</strong>
                  </div>
                </div>

                <div className="guide-modal-tags">
                  <span>Regions</span>
                  <p>{selectedGuide.regions && selectedGuide.regions.length ? selectedGuide.regions.join(", ") : "Flexible"}</p>
                </div>
                <div className="guide-modal-tags">
                  <span>Languages</span>
                  <p>{selectedGuide.languages && selectedGuide.languages.length ? selectedGuide.languages.join(", ") : "English, Hindi"}</p>
                </div>
                <div className="guide-modal-tags">
                  <span>Base Address</span>
                  <p>
                    {selectedGuide.address?.line1 || "Address not available"}
                    {selectedGuide.address?.line2 ? `, ${selectedGuide.address.line2}` : ""}
                  </p>
                </div>
              </div>

              <div className="guide-modal-section">
                <h3>Book This Guide</h3>
                <div className="guide-modal-form">
                  <label>
                    Date
                    <input
                      type="date"
                      value={bookingForm.slotDate}
                      onChange={(e) => handleBookingChange({ slotDate: e.target.value })}
                    />
                  </label>
                  <label>
                    Time
                    <input
                      type="time"
                      value={bookingForm.slotTime}
                      onChange={(e) => handleBookingChange({ slotTime: e.target.value })}
                    />
                  </label>
                  <label>
                    Tour Type
                    <input
                      type="text"
                      placeholder="Heritage, Adventure, Food..."
                      value={bookingForm.tourType}
                      onChange={(e) => handleBookingChange({ tourType: e.target.value })}
                    />
                  </label>
                  <label>
                    Group Size
                    <input
                      type="number"
                      min="1"
                      value={bookingForm.groupSize}
                      onChange={(e) => handleBookingChange({ groupSize: e.target.value })}
                    />
                  </label>
                  <label>
                    Notes
                    <textarea
                      rows="3"
                      placeholder="Share any preferences or special requests"
                      value={bookingForm.notes}
                      onChange={(e) => handleBookingChange({ notes: e.target.value })}
                    />
                  </label>

                  {bookingError ? <p className="guide-modal-error">{bookingError}</p> : null}
                  {bookingSuccess ? <p className="guide-modal-success">{bookingSuccess}</p> : null}

                  <button
                    className="guide-modal-book"
                    type="button"
                    onClick={submitBooking}
                    disabled={!selectedGuide.available || bookingSubmitting}
                  >
                    {bookingSubmitting ? "Booking..." : "Book Guide"}
                  </button>
                  {!selectedGuide.available && (
                    <p className="guide-modal-note">This guide is unavailable right now. Please check back later.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TravelGuides;
