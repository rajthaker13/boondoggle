import React, { useEffect, useState } from "react";
import "./Invite.css";
import { useNavigate } from "react-router-dom";

function Invite(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  useEffect(() => {
    async function getSession() {
      const { data, error } = await props.db.auth.getSession();

      console.log("SESSION", data.session.user.email);
      setEmail(data.session.user.email);
      localStorage.setItem("email", data.session.user.email);
      localStorage.setItem("uid", data.session.user.id);
    }

    getSession();
  }, []);

  async function changePassword() {
    const uid = localStorage.getItem("uid");

    const { data, error } = await props.db.from("users").select().eq("id", uid);

    const connection_id = data[0].crm_id;

    localStorage.setItem("connection_id", connection_id);

    await props.db.auth.updateUser({
      password: password,
    });

    await props.db
      .from("user_data")
      .update({
        onboardingStep: 2,
      })
      .eq("id", uid);
    navigation("/home");
  }
  return (
    <div className="login-container">
      <div className="login-pic-container">
        <p className="sign-up-text">Create Password</p>
        <input
          className="input-container"
          value={email}
          disabled={true}
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
            await changePassword();
          }}
        >
          Sign in
        </button>
      </div>
    </div>
  );
}

export default Invite;
