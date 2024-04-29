import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  async function redirect(uid) {
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    localStorage.setItem("connection_id", data[0].crm_id);
    navigation("/home");
  }

  useEffect(() => {
    if (isMobile) {
      navigation("/");
    }
  });

  async function getUserData(uid) {
    const { data, error } = await props.db.from("users").select().eq("id", uid);
    if (data[0].crm_id != null) {
      localStorage.setItem("connection_id", data[0].crm_id);
    }
    if (data[0].email_grant_id != null) {
      localStorage.setItem("email_grant_id", data[0].email_grant_id);
    }
  }

  async function signIn() {
    console.log(email);
    console.log(password);
    const { data, error } = await props.db.auth.signInWithPassword({
      email: email,
      password: password,
    });
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("uid", data.user.id);
    await getUserData(data.user.id);
    navigation("/home");
    // await redirect(data.user.id);
  }

  return (
    <div className="login-container">
      <div className="login-pic-container">
        <p className="sign-up-text">Sign in</p>
        <div className="or-with-email-text-container">
          <div className="line"></div>
          <p className="or-with-email-text">Use your work email</p>
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
          Sign in
        </button>
        <div className="sign-in-text-container">
          <span className="sign-in-text-1">
            Not a member yet?{" "}
            <span
              className="sign-in-text-2"
              onClick={() => {
                navigation("/signup");
              }}
            >
              Sign up
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
