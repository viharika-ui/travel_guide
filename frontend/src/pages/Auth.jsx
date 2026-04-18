import { useState } from "react";
import api from "../api/axios";
import "./Auth.css";
import { FaEnvelope, FaLock, FaPersonWalkingLuggage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function Auth() {
  const { login } = useAuth();
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await login(form.email, form.password);
        navigate("/", { replace: true });
        alert(t("auth.loginSuccess"));
      } else {
        await api.post("/auth/register", form);
        await login(form.email, form.password);
        navigate("/", { replace: true });
        alert(t("auth.registerSuccess"));
      }
    } catch (err) {
      alert(err.response?.data?.message || t("common.error"));
    }
  };

  return (
    <div className="auth-container">
      <video autoPlay loop muted className="background-video">
        <source
          src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
      </video>

      <div className="auth-card">
        <div className="auth-left">
          <FaPersonWalkingLuggage
            size={70}
            style={{
              background: "linear-gradient(to right, #60a5fa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          />

          <h1>{t("home.heroTitle")}</h1>
        </div>

        <div className="auth-right">
          <h2>{isLogin ? t("auth.login") : t("auth.register")}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder={t("booking.name")}
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder={t("auth.email")}
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder={t("auth.password")}
              value={form.password}
              onChange={handleChange}
              required
            />

            <div>
              <button type="submit">
                {isLogin ? t("auth.login") : t("auth.register")}
              </button>
            </div>
          </form>

          <p>
            {isLogin ? (
              <>
                {t("auth.dontHaveAccount")}{" "}
                <span onClick={() => setIsLogin(false)}>
                  {t("auth.register")}
                </span>
              </>
            ) : (
              <>
                {t("auth.alreadyHaveAccount")}{" "}
                <span onClick={() => setIsLogin(true)}>
                  {t("auth.login")}
                </span>
              </>
            )}
          </p>

          <div className="divider">{t("auth.orContinueWith")}</div>

          <button className="google-btn">Google</button>
        </div>
      </div>
    </div>
  );
}