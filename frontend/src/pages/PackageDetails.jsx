import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./PackageDetails.css";

export default function PackageDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState(null);

  // Fetch package
  useEffect(() => {
    api.get(`/packages/${id}`)
      .then(res => setPkg(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!pkg) return <h2 style={{textAlign:"center",marginTop:"80px"}}>Loading Package...</h2>;

  return (
    <div className="package-page">

      <div className="package-container">

        {/* Image */}
        <img src={pkg.image} alt={pkg.title} className="package-image" />

        {/* Details */}
        <div className="package-title">

          <h2>{pkg.title}</h2>

          <p style={{marginTop:"10px",color:"#444",lineHeight:"1.6"}}>
            {pkg.description}
          </p>

          <div style={{marginTop:"25px"}}>
            <h3>📍 Location: {pkg.city}, {pkg.state}</h3>
            <h3>🕒 Duration: {pkg.days} Days / {pkg.nights} Nights</h3>
          </div>

          <div style={{marginTop:"25px"}}>
            <h2 style={{color:"#0d8ecf"}}>Starting from ₹{pkg.price}</h2>
          </div>

          <button
            className="pay-btn"
            style={{marginTop:"30px"}}
            onClick={() => navigate(`/booking/${pkg._id}`)}
          >
            Book Now
          </button>

        </div>
      </div>

    </div>
  );
}
