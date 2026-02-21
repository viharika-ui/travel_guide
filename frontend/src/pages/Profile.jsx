import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, setUserFromToken } = useAuth();

  const [form, setForm] = useState({
    phone: user?.phone || "",
    age: user?.age || "",
    gender: user?.gender || "",
    address: user?.address || "",
    city: user?.city || "",
    state: user?.state || "",
    country: user?.country || "",
    emergencyContact: user?.emergencyContact || "",
    passportNumber: user?.passportNumber || ""
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    const { data } = await api.put("/users/profile", form);
    setUserFromToken(data.user);
    alert("Profile Updated");
  };

  const uploadPhoto = async () => {
    const fd = new FormData();
    fd.append("avatar", file);

    const { data } = await api.post("/users/avatar", fd);
    setUserFromToken(data.user);
    alert("Photo Updated");
  };

  return (
  <div className="profile-page">
    <div className="profile-card">

      <h2 className="profile-title">Traveller Profile</h2>

      <div className="avatar-section">
        <div className="avatar-preview">
          {user?.avatar ? (
            <img src={user.avatar} alt="profile" />
          ) : (
            <span>{user?.name?.charAt(0)}</span>
          )}
        </div>

        <div>
          <input type="file" onChange={(e)=>setFile(e.target.files[0])}/>
          <button className="upload-btn" onClick={uploadPhoto}>Upload Photo</button>
        </div>
      </div>

      <div className="profile-form">
       <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange}/>
      <input name="age" placeholder="Age" value={form.age} onChange={handleChange}/>
      <input name="gender" placeholder="Gender" value={form.gender} onChange={handleChange}/>
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange}/>
      <input name="city" placeholder="City" value={form.city} onChange={handleChange}/>
      <input name="state" placeholder="State" value={form.state} onChange={handleChange}/>
      <input name="country" placeholder="Country" value={form.country} onChange={handleChange}/>
      <input name="emergencyContact" placeholder="Emergency Contact" value={form.emergencyContact} onChange={handleChange}/>
      <input name="passportNumber" placeholder="Passport Number" value={form.passportNumber} onChange={handleChange}/>
        <button className="save-btn" onClick={saveProfile}>Save Profile</button>
      </div>

    </div>
  </div>
);

 
}
