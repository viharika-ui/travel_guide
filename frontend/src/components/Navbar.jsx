import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import "./Navbar.css";


export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, setLanguage, languageOptions } = useLanguage();
  const navigate = useNavigate();
  const [langOpen, setLangOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
    alert("Logout successful!")
    setUserMenuOpen(false);
  };

  const updatePreferredLanguage = async (code) => {
    setLanguage(code);
    setLangOpen(false);
    if (user) {
      try {
        await api.patch("/users/profile", { preferredLanguage: code });
      } catch (_) {}
    }
  };

  return (
//    <nav className="navbar">
//   <div className="navbar-container">
//     <div className="navbar-left">
//       <Link to="/" className="logo">
//         Incredible India
//       </Link>

//       <div className="nav-links">
//         <Link to="/">Home</Link>
//         <Link to="/explore">Explore</Link>
//         <Link to="/map">Map</Link>
//       </div>
//     </div>

//     <div className="navbar-right">
//       <button className="lang-btn">
//         Language ({currentLanguage.toUpperCase()})
//       </button>

//       {!user && (
//         <Link to="/auth" className="auth-btn">
//           Login
//         </Link>
//       )}
//     </div>
//   </div>
// </nav>
<nav className="navbar">
  <div className="navbar-container">

    {/* Left - Logo */}
    <div className="navbar-left">
      <Link to="/" className="logo">
        {t("home.heroTitle")}
      </Link>
    </div>

    {/* Center - Links */}
    <div className="navbar-center">
      <Link to="/">{t("nav.home")}</Link>
      <Link to="/explore">{t("nav.explore")}</Link>
      <Link to="/map">{t("nav.map")}</Link>
    </div>

    {/* Right - Language + Login */}
    <div className="navbar-right">
      <button
        className="lang-btn"
        onClick={() => setLangOpen(!langOpen)}
      >
        {t("nav.language")} ({currentLanguage.toUpperCase()})
      </button>

      {langOpen && (
        <div className="lang-dropdown">
          {languageOptions.map((opt) => (
            <div
              key={opt.code}
              className="lang-option"
              onClick={() => {
                setLanguage(opt.code);
                setLangOpen(false);
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {user ? (
  <div className="user-menu">
    <div className="avatar" onClick={() => setUserMenuOpen(!userMenuOpen)}>
      {user.avatar ? (
        <img src={user.avatar} alt="profile" />
      ) : (
        <span>{user.name?.charAt(0).toUpperCase()}</span>
      )}
    </div>

    {userMenuOpen && (
      <div className="user-dropdown">
        <Link
  to="/profile"
  onClick={() => setUserMenuOpen(false)}
>
  {t("nav.profile")}
</Link>

        <Link onClick={handleLogout}>{t("nav.logout")}</Link>
      </div>
    )}
  </div>
) : (
  <Link to="/auth" className="auth-btn">Login</Link>
)}


    </div>

  </div>
</nav>

  );
}
