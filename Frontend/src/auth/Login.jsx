import React from "react";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { AuthContext } from "./AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("All fields are Required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await login(email, password); // backend sets cookie
      setIsAuthenticated(true); // unlock app
      navigate("/"); // go to App
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="loginPage">
      <div className="loginBox">
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="loginContent">
          <div className="loginHeading">
            <h1>Welcome back to SigmaGPT!</h1>
            <p>Please login to continue your conversations.</p>
          </div>
          <div className="loginInputDiv">
            <form onSubmit={handleSubmit}>
              <input
                className="login_Input"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="login_Input"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="loginBtn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
          <div className="orDiv">
            <hr />
            OR
            <hr />
          </div>
          <div className="paraTag">
            <p>
              Don’t have an account?{" "}
              <span
                style={{ color: "#10a37f", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
              >
                Signup
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
