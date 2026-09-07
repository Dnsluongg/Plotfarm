import React, { useState } from "react";
import { Sprout } from "lucide-react";

function Signup({ onSignup, onGoLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const user = {
      name,
      email,
      password,
      role: "User"
    };

    localStorage.setItem("plotFarmUser", JSON.stringify(user));

    onSignup(user);
  }

  return (
    <div className="authPage">
      <div className="authCard signupCard">
        <div className="authLogo">
          <div className="authLogoIcon">
            <Sprout size={28} />
          </div>
          <span>Plot Farm</span>
        </div>

        <div className="authHeader">
          <h1>Create account</h1>
          <p>Start managing your farm today</p>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
          <div className="formGroup">
            <label>Full name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label>Password</label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="formGroup">
            <label>Confirm password</label>
            <input
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="authError">{error}</div>}

          <label className="terms">
            <input type="checkbox" required />
            <span>
              I agree to the Terms of Service and Privacy Policy
            </span>
          </label>

          <button className="authSubmit" type="submit">
            Create Account
          </button>
        </form>

        <p className="authSwitch">
          Already have an account?
          <button onClick={onGoLogin}>Sign in</button>
        </p>
      </div>
    </div>
  );
}

export default Signup;