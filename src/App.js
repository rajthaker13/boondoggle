import "./App.css";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Home from "./screens/Home/Home";
import SignUp from "./screens/SignUp/SignUp";
// import { Client, auth } from "twitter-api-sdk";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Link from "./screens/Link/Link";
import Entries from "./screens/Entries/Entries";
import Login from "./screens/Login/Login";
import Performance from "./screens/Peformance/Performance";
import Airtable from "./screens/Airtable/Airtable";
import ConnectAirtable from "./screens/ConnectAirtable/ConnectAirtable";
import Landing from "./screens/Landing/Landing";
import Privacy from "./screens/Privacy/Privacy";
import Terms from "./screens/Terms/Terms";
import Manager from "./screens/Manager/Manager";
import Payment from "./screens/Payment/Payment";
import Settings from "./screens/Settings/Settings";
import BoondogggleAI from "./screens/BoondoggleAI/BoondoggleAI";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Invite from "./screens/Invite/Invite";
import NewHome from "./screens/NewHome/NewHome";
import Workflows from "./screens/Workflows";
import NewEntries from "./screens/NewEntries";
import Demo from "./screens/Demo";

const supabase = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3Njc5ODMsImV4cCI6MjAyMjM0Mzk4M30.bjgoombrUXrnMn92P7uNGLK0_2ONNECFrE74_Ql4HEg"
);

const supabaseAdmin = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcwNjc2Nzk4MywiZXhwIjoyMDIyMzQzOTgzfQ.-KRrMzS7RXyjZpqhf_84CkmDMkp0g0Himi0btAMP96g"
);

export default function App() {
  return (
    <Router>
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<Landing db={supabase} />} />
        <Route path="/privacy" element={<Privacy db={supabase} />} />
        <Route path="/terms" element={<Terms db={supabase} />} />
        <Route path="/signup" element={<SignUp db={supabase} />} />
        <Route path="/login" element={<Login db={supabase} />} />
        <Route path="/link" element={<Link db={supabase} />} />
        <Route path="/payment" element={<Payment db={supabase} />} />
        <Route path="/home" element={<NewHome db={supabase} />} />
        <Route path="/workflows" element={<Workflows db={supabase} />} />
        <Route path="/entries" element={<NewEntries db={supabase} />} />
        <Route path="/performance" element={<Performance db={supabase} />} />
        <Route path="/boondoggleai" element={<BoondogggleAI db={supabase} />} />
        <Route path="/manager" element={<Manager db={supabaseAdmin} />} />
        <Route path="/settings" element={<Settings db={supabase} />} />
        <Route path="/airtable" element={<Airtable db={supabase} />} />
        <Route path="/invite" element={<Invite db={supabase} />} />
        <Route
          path="/connectAirtable"
          element={<ConnectAirtable db={supabase} />}
        />
      </Routes>
    </Router>
  );

  // if (!session) {
  //   return <Login db={supabase} />;
  // } else {
  //   return <Home session={session} />;
  // }
}
