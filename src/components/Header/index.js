import React from "react";
import { useNavigate } from "react-router-dom";
import boondoggleai from "../../assets/ui-update/new-logo.svg";

export default function Header(props) {
  const navigation = useNavigate();

  return (
    <div>
      <div className="w-full px-6 py-2.5 bg-white shadow border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <img src={boondoggleai} alt="Boondoggle Ai" className="mr-5" />
          <div className="flex gap-5">
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
    </div>
  );
}
