import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import './TravelGuides.css';

const TravelGuides = () => {
  const [guides, setGuides] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredGuides.map((guide) => (
            <div key={guide._id} className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group">
              <div className="h-64 w-full relative overflow-hidden bg-gray-200">
                <img
                  src={guide.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400"}
                  alt={guide.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold font-serif">{guide.name}</h3>
                    {(guide.city || guide.state) && (
                      <p className="flex items-center text-gray-200 text-sm mt-1 font-medium">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {[guide.city, guide.state].filter(Boolean).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5 font-bold text-sm text-gray-800">
                    <span className="text-amber-500 text-lg leading-none">?</span> {guide.rating > 0 ? guide.rating : 'New'}
                  </div>
                </div>
              </div>
              
              <div className="p-7">
                <div className="flex justify-between items-center mb-6 py-3 border-b border-gray-100">
                   <div className="text-gray-500 text-sm font-medium">
                     {guide.reviews > 0 ? <>{guide.reviews} reviews</> : 'No reviews yet'}
                   </div>
                   <div className="text-right">
                     <span className="text-2xl font-black text-indigo-600">?{guide.price || 1500}</span>
                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide ml-1">/ day</span>
                   </div>
                </div>

                <div className="space-y-5 mb-8">
                  {guide.specialties && guide.specialties.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {guide.specialties.slice(0,3).map((spec, idx) => (
                          <span key={idx} className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-100">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {(guide.languages && guide.languages.length > 0) ? (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</p>
                      <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                        {guide.languages.join(", ")}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Languages</p>
                      <p className="text-sm font-medium text-gray-700">English, Hindi</p>
                    </div>
                  )}
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  View Profile & Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredGuides.length === 0 && !loading && (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <svg className="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="text-xl font-semibold text-gray-600">No guides found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelGuides;
