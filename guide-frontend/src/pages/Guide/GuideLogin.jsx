import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "../../login.css";  // adjust path as needed

export default function GuideLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setError("");
    try {
      const res = await api.post("/auth/guide/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "guide");
      navigate("/guide/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2><span className="highlight">Travel Guide</span> Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="guide@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        <p className="switch-link">
          Admin Login?{" "}
          <span onClick={() => navigate("/admin/login")}>Click here</span>
        </p>
      </div>
    </div>
  );
}