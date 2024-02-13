import "./App.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Home from "./screens/Home/Home";
import SignUp from "./screens/SignUp/SignUp";
// import { Client, auth } from "twitter-api-sdk";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Switch,
} from "react-router-dom";
import Link from "./screens/Link/Link";
import Entries from "./screens/Dashboard/Entries";
import Login from "./screens/Login/Login";
import Performance from "./screens/Peformance/Performance";
import Airtable from "./screens/Airtable/Airtable";
import ConnectAirtable from "./screens/ConnectAirtable/ConnectAirtable";
import Landing from "./screens/Landing/Landing";

const supabase = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3Njc5ODMsImV4cCI6MjAyMjM0Mzk4M30.bjgoombrUXrnMn92P7uNGLK0_2ONNECFrE74_Ql4HEg"
);

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // async function signInWithTwitter() {
  //   const { data, error } = await supabase.functions.invoke("twitter-login-3");
  //   console.log(data);
  //   localStorage.setItem("oauth_token", data.url.oauth_token);
  //   localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
  //   window.open(data.url.url, "_self");
  // }
  // async function captureOauthVerifier() {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const oauthVerifier = urlParams.get("oauth_verifier");

  //   // Now oauthVerifier contains the value of oauth_verifier parameter
  //   console.log("Verifier " + oauthVerifier);
  //   localStorage.setItem("oauth_verifier", oauthVerifier);
  //   const token = localStorage.getItem("oauth_token");
  //   const secret = localStorage.getItem("oauth_secret");
  //   console.log(token);
  //   console.log(secret);
  //   const { data, error } = await supabase.functions.invoke("get-twitter-dms", {
  //     body: { token: token, secret: secret, oauthVerifier: oauthVerifier },
  //   });
  //   console.log(data);
  //   const { data2, error2 } = await supabase.auth.signInWithOAuth({
  //     provider: "twitter",
  //   });
  //   console.log(data2);
  // }

  // useEffect(() => {
  //   const urlParams = new URLSearchParams(window.location.search);
  //   if (urlParams.has("oauth_verifier")) {
  //     captureOauthVerifier();
  //   }
  // }, []);

  // <UnifiedDirectory workspace_id={"65c02dbec9810ed1f215c33b"} />

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing db={supabase} />}></Route>
        <Route path="/signup" element={<SignUp db={supabase} />}></Route>
        <Route path="/login" element={<Login db={supabase} />}></Route>
        <Route path="/link" element={<Link db={supabase} />}></Route>
        <Route path="/home" element={<Home db={supabase} />}></Route>
        <Route path="/entries" element={<Entries db={supabase} />}></Route>
        <Route
          path="/performance"
          element={<Performance db={supabase} />}
        ></Route>
        <Route path="/airtable" element={<Airtable db={supabase} />}></Route>
        <Route
          path="/connectAirtable"
          element={<ConnectAirtable db={supabase} />}
        ></Route>
      </Routes>
    </Router>
  );

  // if (!session) {
  //   return <Login db={supabase} />;
  // } else {
  //   return <Home session={session} />;
  // }
}
