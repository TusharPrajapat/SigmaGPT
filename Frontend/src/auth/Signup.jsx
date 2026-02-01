import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/authService.jsx";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // basic validation
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await signup(name, email, password);

      // after successful signup → go to login
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupPage">
      <div className="SignupBox">
        <div className="signupContent">
          <div className="signupHeading">
            <h1>Welcome to SigmaGPT!</h1>
            <p>
              You'll get smarter responses and can upload files, images, and
              more.
            </p>
          </div>
          <div className="signupInputDiv">
            <form onSubmit={handleSubmit}>
              {error && <p style={{ color: "red" }}>{error}</p>}
              {/* <p>{name}</p> */}
              <input
                className="signUp_input"
                placeholder="Enter Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {/* <p>{email}</p> */}
              <input
                className="signUp_input"
                placeholder="Enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* <p>{password}</p> */}
              <input
                className="signUp_input"
                placeholder="Enter password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="submitBtn" type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Signup"}
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
              Already Have Account?{" "}
              <span
                style={{ color: "#10a37f", cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
