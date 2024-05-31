import React from "react";
import { useNavigate } from "react-router-dom";
import boondoggleai from "../../assets/ui-update/new-logo.svg";

export default function Header(props) {
  const navigation = useNavigate();

  return (
    <div className="w-[100vw] px-[38px] py-2.5 bg-white shadow border-b border-gray-200 justify-between items-center inline-flex">
      <div className="justify-center items-center gap-5 inline-flex">
        <img src={boondoggleai} alt="Boondoggle Ai" />
        <div className="justify-center items-center gap-5 inline-flex">
          <p
            className="header-2-picker-text"
            style={props.selectedTab === 0 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/home");
            }}
          >
            Dashboard
          </p>
          <p
            className="header-2-picker-text"
            style={props.selectedTab === 2 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/entries");
            }}
          >
            Activity
          </p>
          <p
            className="header-2-picker-text"
            style={props.selectedTab === 3 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/boondoggleai");
            }}
          >
            Summon
          </p>
        </div>
      </div>
    </div>
  );
}
