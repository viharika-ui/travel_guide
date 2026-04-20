import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock, FaPersonWalkingLuggage } from "react-icons/fa6";

export default function Login() {
  const { t } = useTranslation();
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    const apiBase = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000";
    window.location.href = apiBase + "/api/auth/google";
  };

  return (
    <body className="login-page">
      <div className="fullscreen-video-bg">
        <video className="flying-video" autoPlay muted loop playsInline>
          <source src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4" type="video/mp4"/>
        </video>
        <div className="video-overlay"></div>
      </div>

      <div className="hero-center-wrapper">
        <div className="hero-content-row">

          <div className="hero-left">
            <div className="logo">
              <FaPersonWalkingLuggage size={70} style={{
                background: "linear-gradient(to right, #60a5fa, #22d3ee)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }} />
              <span>{t('home.heroTitle')}</span>
            </div>
          </div>

          <div className="hero-right">
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder={t('auth.email')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
                <input
                  type="password"
                  placeholder={t('auth.password')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input type="checkbox"/>
                  <span>{t('login.rememberMe')}</span>
                </label>
                <a href="#" className="forgot-password">{t('login.forgotPassword')}</a>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? t('common.loading') : t('auth.login')}
              </button>

              <div className="divider">
                <span>{t('login.orContinueWith')}</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google-btn" onClick={handleGoogle}>
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google"/>
                  <span>Google</span>
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </body>
  );
}