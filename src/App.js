import "./App.css";
import { createClient } from "@supabase/supabase-js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./screens/Landing/Landing";
import BoondogggleAI from "./screens/BoondoggleAI";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Workflows from "./screens/Workflows";
import Entries from "./screens/Entries";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import * as Frigade from "@frigade/react";

const supabase = createClient(
  "https://gwjtbxxhdsqrelswpgdi.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd3anRieHhoZHNxcmVsc3dwZ2RpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY3Njc5ODMsImV4cCI6MjAyMjM0Mzk4M30.bjgoombrUXrnMn92P7uNGLK0_2ONNECFrE74_Ql4HEg"
);

const FRIGADE_API_KEY =
"api_public_p64HUD7ajq3mcgQGzz0R0B44StuQu6r30NpmWSDY9SdLCY8bs0gAdeQMUjDrqmvH";

export default function App() {
  return (
    <Frigade.Provider apiKey={FRIGADE_API_KEY}>
    <Router>
      <SpeedInsights />
      <Routes>
        <Route path="/" element={<Landing db={supabase} />} />
        <Route
          path="/signup"
          element={<Login db={supabase} isNewAccount={true} />}
        />
        <Route
          path="/login"
          element={<Login db={supabase} isNewAccount={false} />}
        />
        <Route path="/home" element={<Dashboard db={supabase} />} />
        <Route path="/workflows" element={<Workflows db={supabase} />} />
        <Route path="/entries" element={<Entries db={supabase} />} />
        <Route path="/boondoggleai" element={<BoondogggleAI db={supabase} />} />

        {/* NOT CURRENTLY USING THESE SCREENS (SUBJECT TO CHANGE)
        <Route path="/payment" element={<Payment db={supabase} />} />
        <Route path="/performance" element={<Performance db={supabase} />} />
        <Route path="/manager" element={<Manager db={supabaseAdmin} />} />
        <Route path="/settings" element={<Settings db={supabase} />} />
        <Route path="/invite" element={<Invite db={supabase} />} /> 
        */}
      </Routes>
    </Router>
    </Frigade.Provider>
  );
}
