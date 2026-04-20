import { useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, setUserFromToken } = useAuth();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    phone:            user?.phone            || "",
    age:              user?.age              || "",
    gender:           user?.gender           || "",
    address:          user?.address          || "",
    city:             user?.city             || "",
    state:            user?.state            || "",
    country:          user?.country          || "",
    emergencyContact: user?.emergencyContact || "",
    passportNumber:   user?.passportNumber   || ""
  });

  const [file, setFile] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveProfile = async () => {
    const { data } = await api.put("/users/profile", form);
    setUserFromToken(data.user);
    alert(t('profile.updated'));
  };

  const uploadPhoto = async () => {
    const fd = new FormData();
    fd.append("avatar", file);
    const { data } = await api.post("/users/avatar", fd);
    setUserFromToken(data.user);
    alert(t('profile.photoUpdated'));
  };

  return (
    <div className="profile-page">
      <div className="profile-card">

        <h2 className="profile-title">{t('profile.title')}</h2>

        <div className="avatar-section">
          <div className="avatar-preview">
            {user?.avatar ? (
              <img src={user.avatar} alt="profile" />
            ) : (
              <span>{user?.name?.charAt(0)}</span>
            )}
          </div>
          <div>
            <input type="file" onChange={(e) => setFile(e.target.files[0])} />
            <button className="upload-btn" onClick={uploadPhoto}>{t('profile.uploadPhoto')}</button>
          </div>
        </div>

        <div className="profile-form">
          <input name="phone"            placeholder={t('profile.phone')}            value={form.phone}            onChange={handleChange} />
          <input name="age"              placeholder={t('profile.age')}              value={form.age}              onChange={handleChange} />
          <input name="gender"           placeholder={t('profile.gender')}           value={form.gender}           onChange={handleChange} />
          <input name="address"          placeholder={t('profile.address')}          value={form.address}          onChange={handleChange} />
          <input name="city"             placeholder={t('profile.city')}             value={form.city}             onChange={handleChange} />
          <input name="state"            placeholder={t('profile.state')}            value={form.state}            onChange={handleChange} />
          <input name="country"          placeholder={t('profile.country')}          value={form.country}          onChange={handleChange} />
          <input name="emergencyContact" placeholder={t('profile.emergencyContact')} value={form.emergencyContact} onChange={handleChange} />
          <input name="passportNumber"   placeholder={t('profile.passportNumber')}   value={form.passportNumber}   onChange={handleChange} />
          <button className="save-btn" onClick={saveProfile}>{t('profile.saveProfile')}</button>
        </div>

      </div>
    </div>
  );
}