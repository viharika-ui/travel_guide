import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"; // import useAuth to set admin state
import "../login.css";

// MANUALLY SET YOUR ADMIN CREDENTIALS HERE
const ADMIN_CREDENTIALS = {
  email: "admin@incredibleindia.com",
  password: "admin@123"
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth(); // using Context method

  const handleLogin = async () => {
    if (!email || !password) return setError("Please fill in all fields");
    setError("");

    try {
      // It handles both manual hardcoded credentials & DB
      await login(email, password);
      // Navigate to dashboard immediately upon successful authentication
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message || err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2><span className="highlight">Admin</span> Login</h2>

        {error && <p className="error-msg">{error}</p>}

        <label>Email</label>
        <input
          type="email"
          placeholder="admin@example.com"
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
          Travel Guide Login?{" "}
          <span onClick={() => navigate("/guide/login")}>Click here</span>
        </p>
      </div>
    </div>
  );
}