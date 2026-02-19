import { useState } from "react";
import api from "../api/axios";
import "./Auth.css";
import { FaEnvelope, FaLock,FaPersonWalkingLuggage } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Auth() {
  const { login } = useAuth();
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
        alert("Login successful!")
      } else {
         await api.post("/auth/register", form);

        // immediately login after register
        await login(form.email, form.password);

        navigate("/", { replace: true });
        alert("Registration successful!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      
      {/* Background Video */}
      <video autoPlay loop muted className="background-video">
        <source src="https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4" type="video/mp4" />
      </video>

      <div className="auth-card">

        <div className="auth-left">
          <FaPersonWalkingLuggage size={70} style={{
              background: "linear-gradient(to right, #60a5fa, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }} />
          <h1>Incredible India</h1>
        </div>

        <div className="auth-right">
          <h2>{isLogin ? "Login" : "Register"}</h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <div>
                <button type="submit">
              {isLogin ? "Login" : "Register"}
            </button>
            </div>
            
          </form>

          <p>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <span onClick={() => setIsLogin(false)}>Register</span>
              </>
            ) : (
              <>
                Already registered?{" "}
                <span onClick={() => setIsLogin(true)}>Login</span>
              </>
            )}
          </p>

          <div className="divider">or continue with</div>

          <button className="google-btn">Google</button>
        </div>

      </div>
    </div>
  );
}
