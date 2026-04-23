import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGuide } from "../../context/GuideContext";
import axios from "axios";
import "../../login.css";

export default function GuideRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    fee: "",
    languages: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setGToken, backendUrl } = useGuide(); // Use the guide context to hydrate token directly

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Send to the guide API
      const res = await axios.post(`${backendUrl}/api/guide/register`, formData, {
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.data.success) {
        navigate("/guide/login");
      } else {
        setError(res.data.message || "Registration failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper" style={{ padding: "40px 0" }}>
      <div className="login-card" style={{ width: "500px", maxWidth: "90%" }}>
        <h2><span className="highlight">Guide</span> Registration</h2>

        {error && <p className="error-msg">{error}</p>}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
          
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Fee (₹ per day)</label>
              <input type="number" name="fee" value={formData.fee} onChange={handleChange} required />
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label>Speciality</label>
              <input type="text" name="speciality" placeholder="e.g. Wildlife Guide" value={formData.speciality} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Degree</label>
              <input type="text" name="degree" placeholder="e.g. B.A History" value={formData.degree} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <label>Years of Experience</label>
            <input type="text" name="experience" placeholder="e.g. 5 Years" value={formData.experience} onChange={handleChange} required />
          </div>
          <div>
            <label>Languages known</label>
            <input type="text" name="languages" placeholder="English, Spanish, Hindi..." value={formData.languages} onChange={handleChange} required />
          </div>
          <div>
            <label>About</label>
            <textarea 
              name="about" 
              value={formData.about} 
              onChange={handleChange} 
              required
              rows="3"
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading} style={{ marginTop: "10px" }}>
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <p className="switch-link" style={{ marginTop: "20px" }}>
          Already have an account?{" "}
          <span onClick={() => navigate("/guide/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}