import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaPersonWalkingLuggage,
} from "react-icons/fa6";

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="fullscreen-video-bg">
        <video className="flying-video" autoPlay muted loop playsInline>
          <source
            src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
            type="video/mp4"
          />
        </video>

        <div className="video-overlay"></div>
      </div>

      <div className="hero-center-wrapper">
        <div className="hero-content-row">
          <div className="hero-left">
            <div className="logo">
              <FaPersonWalkingLuggage
                size={70}
                style={{
                  background:
                    "linear-gradient(to right, #60a5fa, #22d3ee)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              />

              <span>{t("home.heroTitle")}</span>
            </div>
          </div>

          <div className="hero-right">
            <form className="auth-form" onSubmit={handleSubmit}>
              {error && <p className="text-red-500">{error}</p>}

              <div className="input-group">
                <input
                  type="text"
                  placeholder={t("booking.name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="email"
                  placeholder={t("auth.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder={t("auth.password")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group">
                <FaLock className="input-icon" />
                <input
                  type="password"
                  placeholder={t("auth.confirmPassword")}
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading
                  ? t("common.loading")
                  : t("auth.register")}
              </button>

              <div className="divider">
                <span>{t("auth.orContinueWith")}</span>
              </div>

              <div className="social-login">
                <button
                  type="button"
                  className="social-btn google-btn"
                >
                  <img
                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                    alt="Google"
                  />
                  <span>Google</span>
                </button>
              </div>

              <p className="mt-4 text-center">
                {t("auth.alreadyHaveAccount")}{" "}
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {t("auth.login")}
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}