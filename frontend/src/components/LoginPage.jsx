import React, { useState } from "react";
import { Sprout } from "lucide-react";

function Login({ onLogin, onGoSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem("plotFarmUser"));

    if (
      savedUser &&
      savedUser.email === email &&
      savedUser.password === password
    ) {
      onLogin(savedUser);
      return;
    }

    // Demo account
    if (email === "demo@plotfarm.com" && password === "123456") {
      onLogin({
        name: "Alex",
        email,
        role: "User"
      });
      return;
    }

    setError("Email or password is incorrect.");
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLogo">
          <div className="authLogoIcon">
            <Sprout size={28} />
          </div>
          <span>Plot Farm</span>
        </div>

        <div className="authHeader">
          <h1>Welcome back</h1>
          <p>Sign in to manage your farm</p>
        </div>

        <form onSubmit={handleSubmit} className="authForm">
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="authError">{error}</div>}

          <div className="forgotRow">
            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <button type="button" className="forgotBtn">
              Forgot password?
            </button>
          </div>

          <button className="authSubmit" type="submit">
            Sign In
          </button>
        </form>

        <div className="authDivider">
          <span>or</span>
        </div>

        <p className="authSwitch">
          Don't have an account?
          <button onClick={onGoSignup}>Create account</button>
        </p>
      </div>
    </div>
  );
}

export default Login;