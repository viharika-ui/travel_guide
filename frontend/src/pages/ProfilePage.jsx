import { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";

const API = "http://localhost:5000/api";

const TRAVEL_STYLES = ["", "budget", "luxury", "adventure", "cultural"];
const ACTIVITIES = ["hiking", "beaches", "heritage", "wildlife", "food", "temples", "trekking", "water sports"];
const GENDERS = ["", "male", "female", "other"];

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    axios
      .get(`${API}/users/profile`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setForm(res.data.user);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleActivities = (activity) => {
    setForm((prev) => {
      const list = prev.preferredActivities || [];
      return {
        ...prev,
        preferredActivities: list.includes(activity)
          ? list.filter((a) => a !== activity)
          : [...list, activity],
      };
    });
  };

  const handleSave = async () => {
  setSaving(true);
  setMessage("");
  console.log("Sending form data:", form);
  try {
    const res = await axios.post(`${API}/users/profile/update`, form, {
      withCredentials: true,
    });

    // ✅ Check success flag, don't rely on res.data.user existing
    if (res.data.success) {
      if (res.data.user) {
        setUser(res.data.user);
        setForm(res.data.user);
      }
      setMessage("success");
    } else {
      console.error("Server error:", res.data.message);
      setMessage("error");
    }
  } catch (err) {
    console.error("Save error:", err.response?.data || err.message);
    setMessage("error");
  } finally {
    setSaving(false);
  }
};

  const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // 🔥 Instant preview (before upload)
  const previewUrl = URL.createObjectURL(file);
  setForm((prev) => ({ ...prev, avatar: previewUrl }));

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await axios.post(`${API}/users/avatar`, formData, {
      withCredentials: true,
    });

    // ✅ Update with actual uploaded URL
    setUser((prev) => ({ ...prev, avatar: res.data.user.avatar }));
    setForm((prev) => ({ ...prev, avatar: res.data.user.avatar }));
  } catch (err) {
    console.error(err);
  }
};
  if (!user) {
    
    return (
      <div className="profile-loading">
        <div className="profile-spinner"></div>
      </div>
    );
  }
  const avatarUrl = form.avatar || user.avatar;
  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* Left Panel */}
        <div className="profile-left">
          {/* <div className="profile-avatar-wrap">
            <img
              src={form.avatar || "/default-avatar.png"}
              alt="avatar"
              className="profile-avatar"
            />
            <label className="avatar-upload-btn">
              Edit
              <input
                type="file"
                accept="image/*"
                className="hidden-input"
                onChange={handleAvatarUpload}
              />
            </label>
          </div> */}
          <div className="profile-avatar-wrap">
  <img
  src={
    avatarUrl && avatarUrl !== ""
      ? avatarUrl
      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
  }
  alt="avatar"
  className="profile-avatar"
/>

  <label className="avatar-upload-btn">
    Edit
    <input
      type="file"
      accept="image/*"
      className="hidden-input"
      onChange={handleAvatarUpload}
    />
  </label>
</div>

          <h2 className="profile-name">{user.name}</h2>
          <p className="profile-email">{user.email}</p>
          <div className="profile-badge">{user.role}</div>
          <div className="loyalty-box">
            <span className="loyalty-label">Loyalty Points</span>
            <span className="loyalty-points">{user.loyaltyPoints ?? 0}</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="profile-right">
          <div className="profile-tabs">
            <button
              className={`profile-tab ${activeTab === "basic" ? "active" : ""}`}
              onClick={() => setActiveTab("basic")}
            >
              Basic Info
            </button>
            <button
              className={`profile-tab ${activeTab === "travel" ? "active" : ""}`}
              onClick={() => setActiveTab("travel")}
            >
              Travel Preferences
            </button>
            <button
              className={`profile-tab ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              Settings
            </button>
          </div>

          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="profile-tab-content">
              <div className="profile-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input name="name" value={form.name || ""} onChange={handleChange} placeholder="Full Name" />
                </div>
                <div className="profile-field">
                  <label>Phone</label>
                  <input name="phone" value={form.phone || ""} onChange={handleChange} placeholder="Phone" />
                </div>
                <div className="profile-field">
                  <label>Age</label>
                  <input name="age" type="number" value={form.age || ""} onChange={handleChange} placeholder="Age" />
                </div>
                <div className="profile-field">
                  <label>Gender</label>
                  <select name="gender" value={form.gender || ""} onChange={handleChange}>
                    {GENDERS.map((g) => (
                      <option key={g} value={g}>
                        {g === "" ? "Select Gender" : g.charAt(0).toUpperCase() + g.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="profile-field">
                  <label>City</label>
                  <input name="city" value={form.city || ""} onChange={handleChange} placeholder="City" />
                </div>
                <div className="profile-field">
                  <label>State</label>
                  <input name="state" value={form.state || ""} onChange={handleChange} placeholder="State" />
                </div>
                <div className="profile-field">
                  <label>Country</label>
                  <input name="country" value={form.country || ""} onChange={handleChange} placeholder="Country" />
                </div>
                <div className="profile-field">
                  <label>Address</label>
                  <input name="address" value={form.address || ""} onChange={handleChange} placeholder="Address" />
                </div>
                <div className="profile-field">
                  <label>Passport Number</label>
                  <input name="passportNumber" value={form.passportNumber || ""} onChange={handleChange} placeholder="Passport Number" />
                </div>
                <div className="profile-field">
                  <label>Emergency Contact</label>
                  <input name="emergencyContact" value={form.emergencyContact || ""} onChange={handleChange} placeholder="Emergency Contact" />
                </div>
              </div>
            </div>
          )}

          {/* Travel Preferences Tab */}
          {activeTab === "travel" && (
            <div className="profile-tab-content">
              <div className="profile-field">
                <label>Travel Style</label>
                <select name="travelStyle" value={form.travelStyle || ""} onChange={handleChange}>
                  {TRAVEL_STYLES.map((s) => (
                    <option key={s} value={s}>
                      {s === "" ? "Select Style" : s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="profile-field">
                <label>Dietary Preferences</label>
                <input
                  name="dietaryPreferences"
                  value={form.dietaryPreferences || ""}
                  onChange={handleChange}
                  placeholder="e.g. vegetarian, vegan, halal"
                />
              </div>
              <div className="profile-field">
                <label>Preferred Activities</label>
                <div className="activity-chips">
                  {ACTIVITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      className={`chip ${(form.preferredActivities || []).includes(a) ? "chip-active" : ""}`}
                      onClick={() => handleActivities(a)}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="profile-tab-content">
              <div className="profile-field">
                <label>Preferred Language</label>
                <select name="preferredLanguage" value={form.preferredLanguage || "en"} onChange={handleChange}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="ta">Tamil</option>
                  <option value="te">Telugu</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>
              <label className="toggle-row">
                <span>Enable Notifications</span>
                <div className="toggle-wrap">
                  <input
                    type="checkbox"
                    name="notificationsEnabled"
                    checked={form.notificationsEnabled ?? true}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </div>
              </label>
            </div>
          )}

          {/* Message */}
          {message === "success" && (
            <p className="profile-msg success">Profile saved successfully!</p>
          )}
          {message === "error" && (
            <p className="profile-msg error">Failed to save. Please try again.</p>
          )}

          <button
            className="profile-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}