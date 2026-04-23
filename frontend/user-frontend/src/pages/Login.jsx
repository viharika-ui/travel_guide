import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { FaEnvelope, FaLock,FaPersonWalkingLuggage } from "react-icons/fa6";

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
    // <div className="min-h-[70vh] flex items-center justify-center px-4">
    //   <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
    //     <h1 className="text-2xl font-bold text-navy mb-6">{t("auth.login")}</h1>
    //     {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <div>
    //         <label className="block text-sm font-medium text-slate-600">{t("auth.email")}</label>
    //         <input
    //           type="email"
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           required
    //           className="w-full rounded-lg border border-slate-300 px-4 py-3 mt-1"
    //         />
    //       </div>
    //       <div>
    //         <label className="block text-sm font-medium text-slate-600">{t("auth.password")}</label>
    //         <input
    //           type="password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           required
    //           className="w-full rounded-lg border border-slate-300 px-4 py-3 mt-1"
    //         />
    //       </div>
    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full py-3 rounded-lg bg-saffron text-white font-semibold disabled:opacity-50"
    //       >
    //         {loading ? t("common.loading") : t("auth.login")}
    //       </button>
    //     </form>
    //     <p className="mt-4 text-center text-slate-600">
    //       {t("auth.dontHaveAccount")}{" "}
    //       <Link to="/register" className="text-saffron font-medium">
    //         {t("auth.register")}
    //       </Link>
    //     </p>
    //     <div className="mt-6 pt-6 border-t border-slate-200">
    //       <button
    //         type="button"
    //         onClick={handleGoogle}
    //         className="w-full py-3 rounded-lg border border-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50"
    //       >
    //         {t("auth.googleLogin")}
    //       </button>
    //     </div>
    //   </div>
    // </div>
    <body class="login-page">
    {/* <!-- Full Screen Video Background --> */}
    <div class="fullscreen-video-bg">
        <video class="flying-video" autoPlay muted loop playsinline>
            <source src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4" type="video/mp4"/>
        </video>
        <div class="video-overlay"></div>
    </div>
    
    {/* <!-- Centered Hero Content --> */}
    <div class="hero-center-wrapper">
        <div class="hero-content-row">
            {/* <!-- Left Side - Logo & Title --> */}
            <div class="hero-left">
                <div class="logo">
                    

<FaPersonWalkingLuggage size={70} style={{
    background: "linear-gradient(to right, #60a5fa, #22d3ee)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  }} />

                    <span>Incredible India</span>
                </div>
            </div>

            {/* <!-- Right Side - Login Form --> */}
            <div className="hero-right">
                <form className="auth-form" id="loginForm">
                    <div className="input-group">
                         <FaEnvelope className="input-icon" />
                        <input type="email" placeholder="Email Address" required/>
                    </div>
                    
                    <div className="input-group">
                         <FaLock className="absolute left-3 top-3 text-gray-400 text-lg" />
                        <input type="password" placeholder="Password" required/>
                        
                    </div>
                    
                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox"/>
                            <span>Remember me</span>
                        </label>
                        <a href="#" class="forgot-password">Forgot Password?</a>
                    </div>
                    
                    <button type="submit" class="submit-btn">Login</button>
                    
                    <div class="divider">
                        <span>or continue with</span>
                    </div>
                    
                    <div class="social-login">
                        <button type="button" class="social-btn google-btn">
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google"/>
                            <span>Google</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
  );
}
