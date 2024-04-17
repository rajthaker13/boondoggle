import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import WorkflowSidebar from "../components/WorkflowSidebar";
import { TextInput, Card, Badge, Button } from "@tremor/react";
import {
  RiSearchLine,
  RiMailLine,
  RiAddLin,
  RiLinkedinBoxFill,
  RiTwitterFill,
} from "@remixicon/react";
import { HiOutlineMail } from "@react-icons/all-files/hi/HiOutlineMail";
import hubspot from "../assets/landing/integrations/crm_svg/hubspot.svg";
import LoadingOverlay from "react-loading-overlay";
import DemoOne from "../components/Demo/DemoOne";
import DemoTwo from "../components/Demo/DemoTwo";
import DemoThree from "../components/Demo/DemoThree";
import DemoFour from "../components/Demo/DemoFour";
import DemoFive from "../components/Demo/DemoFive";
import DemoSix from "../components/Demo/DemoSix";

function Demo(props) {
  const [step, setStep] = useState(0);
  return (
    <div>
      <Sidebar selectedTab={1} db={props.db} />
      <>
        {step == 0 && <DemoOne setStep={setStep} />}
        {step == 1 && <DemoTwo setStep={setStep} />}
        {step == 2 && <DemoThree setStep={setStep} />}
        {step == 3 && <DemoFour setStep={setStep} />}
        {step == 4 && <DemoFive setStep={setStep} db={props.db} />}
        {step == 5 && <DemoSix setStep={setStep} />}
      </>
    </div>
  );
}

export default Demo;
