import React, { useEffect, useState } from "react";
import "./SignUp.css";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    if (isMobile) {
      navigation("/");
    }
  });

  async function signIn() {
    const { data } = await props.db.auth.signUp({
      email: email,
      password: password,
    });
    localStorage.setItem("email", data.user.email);
    localStorage.setItem("uid", data.user.id);
    localStorage.setItem("isAdmin", true);
    navigation("/home");
  }

  return (
    <div className="login-container">
      <div className="login-pic-container">
        <p className="sign-up-text">Sign up</p>

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
          Sign up
        </button>
        <div className="sign-in-text-container">
          <span className="sign-in-text-1">
            Already have an account?{" "}
            <span
              className="sign-in-text-2"
              onClick={() => {
                navigation("/login");
              }}
            >
              Sign in
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
