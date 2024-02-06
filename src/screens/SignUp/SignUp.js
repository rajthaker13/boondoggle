import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";

function SignUp(props) {
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

  useEffect(() => {
    console.log(localStorage.getItem("twitterLinked"));
  }, []);

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
        <p className="sign-up-text">Sign Up</p>
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
          //   onClick={async () => {
          //     await signInWithTwitter();
          //   }}
        >
          Sign Up
        </button>
        <div className="sign-in-text-container">
          <span className="sign-in-text-1">
            Already have an Account?{" "}
            <span
              className="sign-in-text-2"
              onClick={() => {
                navigation("/login");
              }}
            >
              Sign In
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
