import React, { useEffect, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  async function signInWithTwitter() {
    const { data, error } = await props.db.functions.invoke("twitter-login-3");
    console.log(data);
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  async function captureOauthVerifier() {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthVerifier = urlParams.get("oauth_verifier");

    // Now oauthVerifier contains the value of oauth_verifier parameter
    console.log("Verifier " + oauthVerifier);
    const token = localStorage.getItem("oauth_token");
    const secret = localStorage.getItem("oauth_secret");
    console.log(token);
    console.log(secret);
    const { data, error } = await props.db.functions.invoke("get-twitter-dms", {
      body: { token: token, secret: secret, oauthVerifier: oauthVerifier },
    });
    console.log(data);
  }

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.has("oauth_verifier")) {
  //     captureOauthVerifier();
  //   }
  // }, []);

  async function signIn() {
    console.log(email);
    console.log(password);
    const { data, error } = await props.db.auth.signUp({
      email: email,
      password: password,
    });
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("uid", data.user.id);
    navigation("/link");
  }

  return (
    <div className="login-container">
      <div className="login-pic-container">
        <img
          className="login-pic"
          src={require("../../assets/login.png")}
        ></img>
      </div>
      <div className="login-pic-container">
        <h1 className="sign-up-text">Sign Up</h1>
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
          placeholder="Password"
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
          //   onClick={async () => {
          //     await signInWithTwitter();
          //   }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default Login;
