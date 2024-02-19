import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  async function redirect(uid) {
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    localStorage.setItem("connection_id", data[0].crm_id);
    navigation("/home");
  }

  async function signIn() {
    console.log(email);
    console.log(password);
    const { data, error } = await props.db.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(data);
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("uid", data.user.id);
    await redirect(data.user.id);
  }

  return (
    <div className="login-container">
      <div className="login-pic-container">
        <p className="sign-up-text">Sign In</p>
        <p className="trial-text">
          Start your 7 day free trial, no card required.
        </p>
        <div className="or-with-email-text-container">
          <div className="line"></div>
          <p className="or-with-email-text">Use Your Work Email</p>
          <div className="line"></div>
        </div>
        <input
          className="input-container"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        ></input>
        <input
          className="input-container"
          style={{ marginTop: "2vh" }}
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        ></input>
        <button
          className="sign-in-button"
          onClick={async () => {
            await signIn();
          }}
        >
          Sign In
        </button>
        <div className="sign-in-text-container">
          <span className="sign-in-text-1">
            Not a Member Yet?{" "}
            <span
              className="sign-in-text-2"
              onClick={() => {
                navigation("/signup");
              }}
            >
              Sign Up
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
