import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import boondoggleai from "../../assets/ui-update/new-logo.svg";

function Sidebar(props) {
  const navigation = useNavigate();
  const [selectedTab, setSelectedTab] = useState(props.selectedTab);
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    async function checkOnBoarding() {
      const uid = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("user_data")
        .select("")
        .eq("id", uid);
      setIsOnboarding(!data[0].hasOnboarded);
      setOnboardingStep(data[0].onboardingStep);
    }

    async function checkAdmin() {
      if (!isOnboarding) {
        setIsAdmin(localStorage.getItem("isAdmin"));
      }
    }
    checkOnBoarding();
    checkAdmin();
  });

  async function nextOnboardingStep() {
    const uid = localStorage.getItem("uid");
    await props.db
      .from("user_data")
      .update({
        onboardingStep: onboardingStep + 1,
      })
      .eq("id", uid);
  }
  return (
    <div className="w-[100vw] px-[38px] py-2.5 bg-white shadow border-b border-gray-200 justify-between items-center inline-flex">
      <div className="justify-center items-center gap-5 inline-flex">
        <img src={boondoggleai} />
        <div className="justify-center items-center gap-5 inline-flex">
          <p
            className="header-2-picker-text"
            style={props.selectedTab == 0 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/home");
            }}
          >
            Dashboard
          </p>
          <p
            className="header-2-picker-text"
            style={props.selectedTab == 1 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/workflows");
            }}
          >
            Workflows
          </p>
          <p
            className="header-2-picker-text"
            style={props.selectedTab == 2 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/entries");
            }}
          >
            Activity
          </p>
          <p
            className="header-2-picker-text"
            style={props.selectedTab == 3 ? { fontWeight: "700" } : {}}
            onClick={() => {
              navigation("/boondoggleai");
            }}
          >
            Summon
          </p>
          <p className="header-2-picker-text">Billing</p>
          <p className="header-2-picker-text">Help</p>
        </div>
      </div>

      <div className="header-2-info-container">
        <div className="header-2-action-container">
          <div className="header-2-badge-container">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="19"
              viewBox="0 0 16 19"
              fill="none"
            >
              <path
                d="M15 4.74038C15 6.66792 11.8657 8.23077 8 8.23077C4.1343 8.23077 1 6.66792 1 4.74038M15 4.74038C15 2.81285 11.8657 1.25 8 1.25C4.1343 1.25 1 2.81285 1 4.74038M15 4.74038V14.2596C15 16.1872 11.8657 17.75 8 17.75C4.1343 17.75 1 16.1872 1 14.2596V4.74038M15 4.74038V7.91346M1 4.74038V7.91346M15 7.91346V11.0865C15 13.0141 11.8657 14.5769 8 14.5769C4.1343 14.5769 1 13.0141 1 11.0865V7.91346M15 7.91346C15 9.841 11.8657 11.4038 8 11.4038C4.1343 11.4038 1 9.841 1 7.91346"
                stroke="#BE123C"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            <span className="header-2-badge-text">10 Slots Remaining</span>
          </div>
          <button className="header-2-upgrade-button">
            <span className="header-2-upgrade-text">Upgrade plan</span>
          </button>
        </div>
      </div>
      {/* <div className="tabs-container">
        <div
          className="sidebar-tabs"
          style={
            isOnboarding && onboardingStep > 4 && onboardingStep != 13
              ? { filter: "blur(5px)" }
              : isOnboarding && onboardingStep == 13
              ? { border: "1px solid red" }
              : {}
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="IdentificationBadge">
              <path
                id="Vector"
                d="M15.625 2.5H4.375C4.20924 2.5 4.05027 2.56585 3.93306 2.68306C3.81585 2.80027 3.75 2.95924 3.75 3.125V16.875C3.75 17.0408 3.81585 17.1997 3.93306 17.3169C4.05027 17.4342 4.20924 17.5 4.375 17.5H15.625C15.7908 17.5 15.9497 17.4342 16.0669 17.3169C16.1842 17.1997 16.25 17.0408 16.25 16.875V3.125C16.25 2.95924 16.1842 2.80027 16.0669 2.68306C15.9497 2.56585 15.7908 2.5 15.625 2.5ZM10 13.125C9.50555 13.125 9.0222 12.9784 8.61107 12.7037C8.19995 12.429 7.87952 12.0385 7.6903 11.5817C7.50108 11.1249 7.45157 10.6222 7.54804 10.1373C7.6445 9.65232 7.8826 9.20686 8.23223 8.85723C8.58186 8.5076 9.02732 8.2695 9.51227 8.17304C9.99723 8.07657 10.4999 8.12608 10.9567 8.3153C11.4135 8.50452 11.804 8.82495 12.0787 9.23607C12.3534 9.6472 12.5 10.1305 12.5 10.625C12.5 11.288 12.2366 11.9239 11.7678 12.3928C11.2989 12.8616 10.663 13.125 10 13.125Z"
                fill="#1C1C1C"
                fill-opacity="0.1"
              />
              <path
                id="Vector_2"
                d="M5.87422 15.5C5.9399 15.5494 6.01468 15.5853 6.09426 15.6057C6.17385 15.6262 6.25669 15.6307 6.33803 15.6191C6.41937 15.6075 6.49763 15.58 6.56832 15.5381C6.63901 15.4962 6.70075 15.4408 6.75 15.375C7.12841 14.8705 7.61909 14.4609 8.18319 14.1789C8.7473 13.8968 9.36932 13.75 10 13.75C10.6307 13.75 11.2527 13.8968 11.8168 14.1789C12.3809 14.4609 12.8716 14.8705 13.25 15.375C13.2992 15.4407 13.3609 15.496 13.4316 15.5378C13.5022 15.5796 13.5804 15.6071 13.6616 15.6187C13.7429 15.6303 13.8256 15.6258 13.9051 15.6054C13.9846 15.5851 14.0593 15.5492 14.125 15.5C14.1907 15.4508 14.246 15.3891 14.2878 15.3184C14.3296 15.2478 14.3571 15.1696 14.3687 15.0884C14.3803 15.0071 14.3758 14.9244 14.3554 14.8449C14.3351 14.7654 14.2992 14.6907 14.25 14.625C13.6966 13.883 12.9586 13.2988 12.1094 12.9305C12.5748 12.5056 12.9008 11.9499 13.0447 11.3364C13.1887 10.7229 13.1438 10.0802 12.9159 9.49267C12.688 8.90514 12.2879 8.40023 11.7679 8.0442C11.248 7.68816 10.6325 7.49765 10.0023 7.49765C9.37218 7.49765 8.75673 7.68816 8.23678 8.0442C7.71682 8.40023 7.31666 8.90514 7.08879 9.49267C6.86093 10.0802 6.81602 10.7229 6.95995 11.3364C7.10388 11.9499 7.42993 12.5056 7.89531 12.9305C7.0444 13.2981 6.30472 13.8824 5.75 14.625C5.65046 14.7575 5.60763 14.9241 5.63092 15.0882C5.65422 15.2523 5.74173 15.4004 5.87422 15.5ZM10 8.75C10.3708 8.75 10.7334 8.85997 11.0417 9.06599C11.35 9.27202 11.5904 9.56486 11.7323 9.90747C11.8742 10.2501 11.9113 10.6271 11.839 10.9908C11.7666 11.3545 11.588 11.6886 11.3258 11.9508C11.0636 12.213 10.7295 12.3916 10.3658 12.464C10.0021 12.5363 9.62508 12.4992 9.28247 12.3573C8.93986 12.2154 8.64702 11.975 8.44099 11.6667C8.23497 11.3584 8.125 10.9958 8.125 10.625C8.125 10.1277 8.32254 9.65081 8.67417 9.29917C9.02581 8.94754 9.50272 8.75 10 8.75ZM15.625 1.875H4.375C4.04348 1.875 3.72554 2.0067 3.49112 2.24112C3.2567 2.47554 3.125 2.79348 3.125 3.125V16.875C3.125 17.2065 3.2567 17.5245 3.49112 17.7589C3.72554 17.9933 4.04348 18.125 4.375 18.125H15.625C15.9565 18.125 16.2745 17.9933 16.5089 17.7589C16.7433 17.5245 16.875 17.2065 16.875 16.875V3.125C16.875 2.79348 16.7433 2.47554 16.5089 2.24112C16.2745 2.0067 15.9565 1.875 15.625 1.875ZM15.625 16.875H4.375V3.125H15.625V16.875ZM6.875 5C6.875 4.83424 6.94085 4.67527 7.05806 4.55806C7.17527 4.44085 7.33424 4.375 7.5 4.375H12.5C12.6658 4.375 12.8247 4.44085 12.9419 4.55806C13.0592 4.67527 13.125 4.83424 13.125 5C13.125 5.16576 13.0592 5.32473 12.9419 5.44194C12.8247 5.55915 12.6658 5.625 12.5 5.625H7.5C7.33424 5.625 7.17527 5.55915 7.05806 5.44194C6.94085 5.32473 6.875 5.16576 6.875 5Z"
                fill="#1C1C1C"
              />
            </g>
          </svg>

          <p
            className="tabs-text"
            style={selectedTab == 0 ? { fontWeight: 700 } : {}}
            onClick={async () => {
              if (!isOnboarding || onboardingStep == 13) {
                if (isOnboarding) {
                  await nextOnboardingStep();
                }
                navigation("/home");
              }
            }}
          >
            Integrations
          </p>
        </div>
        <div
          className="sidebar-tabs"
          style={
            isOnboarding && onboardingStep == 5
              ? { border: "1px solid red" }
              : isOnboarding && onboardingStep > 5
              ? { filter: "blur(5px)" }
              : {}
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="ChartPieSlice">
              <path
                id="Vector"
                d="M7.50002 2.92969V8.55469L2.62502 11.3672C2.29959 9.61066 2.61183 7.79565 3.50554 6.24885C4.39925 4.70205 5.81572 3.52504 7.50002 2.92969Z"
                fill="#1C1C1C"
                fill-opacity="0.1"
              />
              <path
                id="Vector_2"
                d="M7.81261 9.09609C7.90765 9.04123 7.98656 8.96231 8.04142 8.86727C8.09627 8.77223 8.12514 8.66442 8.12511 8.55469V2.92969C8.12456 2.83004 8.10018 2.73198 8.05402 2.64367C8.00786 2.55536 7.94126 2.47936 7.85976 2.42202C7.77826 2.36469 7.68424 2.32766 7.58553 2.31405C7.48681 2.30043 7.38628 2.31062 7.2923 2.34375C5.46807 2.98939 3.93396 4.26457 2.96575 5.94005C1.99755 7.61554 1.65875 9.58145 2.01027 11.4844C2.02849 11.5828 2.07008 11.6754 2.13153 11.7544C2.19298 11.8333 2.27249 11.8964 2.3634 11.9383C2.44531 11.9766 2.53468 11.9963 2.62511 11.9961C2.73481 11.9961 2.84259 11.9673 2.93761 11.9125L7.81261 9.09609ZM6.87511 3.87656V8.19375L3.13449 10.3523C3.12511 10.2344 3.12511 10.1156 3.12511 10C3.12622 8.73309 3.4769 7.49106 4.13855 6.41066C4.80019 5.33025 5.74713 4.45337 6.87511 3.87656ZM17.0579 5.97812C17.0509 5.96406 17.0439 5.94922 17.0353 5.93516C17.0267 5.92109 17.0196 5.90938 17.0111 5.89688C16.2947 4.67328 15.2707 3.65834 14.0409 2.95282C12.811 2.24729 11.418 1.87572 10.0001 1.875C9.83435 1.875 9.67538 1.94085 9.55817 2.05806C9.44096 2.17527 9.37511 2.33424 9.37511 2.5V9.67422L3.21808 13.2602C3.14664 13.3016 3.0841 13.3567 3.0341 13.4225C2.9841 13.4882 2.94762 13.5632 2.92677 13.6431C2.90592 13.723 2.90112 13.8062 2.91263 13.888C2.92415 13.9698 2.95176 14.0485 2.99386 14.1195C3.8972 15.6578 5.28168 16.856 6.93365 17.5293C8.58561 18.2025 10.4132 18.3134 12.1345 17.8448C13.8557 17.3762 15.3749 16.3541 16.4576 14.9364C17.5403 13.5186 18.1262 11.7839 18.1251 10C18.1269 8.58916 17.759 7.20247 17.0579 5.97812ZM10.6251 3.15313C11.6164 3.24437 12.576 3.54965 13.4378 4.04791C14.2995 4.54617 15.0429 5.22552 15.6165 6.03906L10.6251 8.94609V3.15313ZM10.0001 16.875C8.90903 16.8722 7.83412 16.6111 6.86336 16.113C5.89259 15.6149 5.05357 14.894 4.41496 14.0094L10.3056 10.5789L10.3228 10.568L16.2423 7.12031C16.7255 8.16777 16.9373 9.31996 16.8583 10.4708C16.7793 11.6216 16.4121 12.734 15.7903 13.7057C15.1685 14.6773 14.3123 15.4768 13.3005 16.0307C12.2886 16.5845 11.1536 16.8749 10.0001 16.875Z"
                fill="#1C1C1C"
              />
            </g>
          </svg>

          <p
            className="tabs-text"
            style={selectedTab == 1 ? { fontWeight: 700 } : {}}
            onClick={async () => {
              if (!isOnboarding || onboardingStep == 5)
                if (isOnboarding) {
                  await nextOnboardingStep();
                }
              navigation("/performance");
            }}
          >
            Performance
          </p>
        </div>

        <div
          className="sidebar-tabs"
          style={
            isOnboarding && onboardingStep > 4 && onboardingStep != 7
              ? { filter: "blur(5px)" }
              : isOnboarding && onboardingStep == 7
              ? { border: "1px solid red" }
              : {}
          }
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="FolderNotch">
              <path
                id="Vector"
                d="M10 6.25L7.66641 8C7.55822 8.08114 7.42664 8.125 7.29141 8.125H2.5V5C2.5 4.83424 2.56585 4.67527 2.68306 4.55806C2.80027 4.44085 2.95924 4.375 3.125 4.375H7.29141C7.42664 4.375 7.55822 4.41886 7.66641 4.5L10 6.25Z"
                fill="#1C1C1C"
                fill-opacity="0.1"
              />
              <path
                id="Vector_2"
                d="M16.875 5.625H10.2086L8.04141 4C7.82472 3.83832 7.56176 3.75067 7.29141 3.75H3.125C2.79348 3.75 2.47554 3.8817 2.24112 4.11612C2.0067 4.35054 1.875 4.66848 1.875 5V15.625C1.875 15.9565 2.0067 16.2745 2.24112 16.5089C2.47554 16.7433 2.79348 16.875 3.125 16.875H16.875C17.2065 16.875 17.5245 16.7433 17.7589 16.5089C17.9933 16.2745 18.125 15.9565 18.125 15.625V6.875C18.125 6.54348 17.9933 6.22554 17.7589 5.99112C17.5245 5.7567 17.2065 5.625 16.875 5.625ZM3.125 5H7.29141L8.95859 6.25L7.29141 7.5H3.125V5ZM16.875 15.625H3.125V8.75H7.29141C7.56176 8.74933 7.82472 8.66168 8.04141 8.5L10.2086 6.875H16.875V15.625Z"
                fill="#1C1C1C"
              />
            </g>
          </svg>

          <p
            className="tabs-text"
            style={selectedTab == 2 ? { fontWeight: 700 } : {}}
            onClick={async () => {
              if (!isOnboarding || onboardingStep == 7) {
                if (isOnboarding) {
                  await nextOnboardingStep();
                }
                navigation("/entries");
              }
            }}
          >
            Entries
          </p>
        </div>

        <div
          className="sidebar-tabs"
          style={
            isOnboarding && onboardingStep > 4 && onboardingStep != 10
              ? { filter: "blur(5px)" }
              : isOnboarding && onboardingStep == 10
              ? { border: "1px solid red" }
              : {}
          }
        >
          <img src={boondogggleai} style={{ height: "20px", width: "20px" }} />

          <p
            className="tabs-text"
            style={selectedTab == 3 ? { fontWeight: 700 } : {}}
            onClick={async () => {
              if (!isOnboarding || onboardingStep == 10) {
                if (isOnboarding) {
                  await nextOnboardingStep();
                }
                navigation("/boondoggleai");
              }
            }}
          >
            Boondoggle AI
          </p>
        </div>

        {!isOnboarding && isAdmin == "true" && (
          <div
            className="sidebar-tabs"
            style={
              isOnboarding && onboardingStep > 4 && onboardingStep != 10
                ? { filter: "blur(5px)" }
                : isOnboarding && onboardingStep == 10
                ? { border: "1px solid red" }
                : {}
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M13.125 11.25C13.125 11.8681 12.9417 12.4723 12.5983 12.9862C12.255 13.5001 11.7669 13.9006 11.1959 14.1371C10.6249 14.3736 9.99653 14.4355 9.39034 14.315C8.78415 14.1944 8.22733 13.8967 7.79029 13.4597C7.35325 13.0227 7.05563 12.4658 6.93505 11.8597C6.81447 11.2535 6.87635 10.6251 7.11288 10.0541C7.3494 9.48309 7.74994 8.99504 8.26384 8.65166C8.77775 8.30828 9.38193 8.125 10 8.125C10.8288 8.125 11.6237 8.45424 12.2097 9.04029C12.7958 9.62634 13.125 10.4212 13.125 11.25ZM5 4.375C4.50555 4.375 4.0222 4.52162 3.61108 4.79633C3.19995 5.07103 2.87952 5.46148 2.6903 5.91829C2.50108 6.37511 2.45157 6.87777 2.54804 7.36273C2.6445 7.84768 2.8826 8.29314 3.23223 8.64277C3.58187 8.9924 4.02732 9.2305 4.51228 9.32696C4.99723 9.42343 5.49989 9.37392 5.95671 9.1847C6.41353 8.99548 6.80397 8.67505 7.07868 8.26393C7.35338 7.8528 7.5 7.36945 7.5 6.875C7.5 6.21196 7.23661 5.57607 6.76777 5.10723C6.29893 4.63839 5.66304 4.375 5 4.375ZM15 4.375C14.5055 4.375 14.0222 4.52162 13.6111 4.79633C13.2 5.07103 12.8795 5.46148 12.6903 5.91829C12.5011 6.37511 12.4516 6.87777 12.548 7.36273C12.6445 7.84768 12.8826 8.29314 13.2322 8.64277C13.5819 8.9924 14.0273 9.2305 14.5123 9.32696C14.9972 9.42343 15.4999 9.37392 15.9567 9.1847C16.4135 8.99548 16.804 8.67505 17.0787 8.26393C17.3534 7.8528 17.5 7.36945 17.5 6.875C17.5 6.21196 17.2366 5.57607 16.7678 5.10723C16.2989 4.63839 15.663 4.375 15 4.375Z"
                fill="#1C1C1C"
                fill-opacity="0.1"
              />
              <path
                d="M19.125 11.7501C19.0593 11.7993 18.9846 11.8351 18.9051 11.8555C18.8256 11.8759 18.7429 11.8804 18.6616 11.8688C18.5804 11.8572 18.5022 11.8297 18.4316 11.7879C18.3609 11.746 18.2992 11.6907 18.25 11.6251C17.8733 11.1187 17.3829 10.7079 16.8185 10.4256C16.254 10.1434 15.6311 9.99761 15 10.0001C14.8342 10.0001 14.6753 9.93421 14.558 9.817C14.4408 9.69979 14.375 9.54082 14.375 9.37506C14.375 9.2093 14.4408 9.05033 14.558 8.93312C14.6753 8.81591 14.8342 8.75006 15 8.75006C15.3507 8.75003 15.6943 8.65165 15.9919 8.46611C16.2895 8.28056 16.529 8.01528 16.6834 7.7004C16.8378 7.38552 16.9007 7.03367 16.8651 6.68479C16.8296 6.33592 16.6969 6.00402 16.4821 5.72679C16.2673 5.44957 15.9791 5.23812 15.6502 5.11648C15.3213 4.99483 14.9649 4.96787 14.6214 5.03864C14.278 5.10941 13.9612 5.27509 13.7072 5.51685C13.4532 5.75861 13.272 6.06676 13.1844 6.40631C13.1638 6.48582 13.1279 6.56051 13.0785 6.62612C13.0291 6.69172 12.9673 6.74696 12.8965 6.78867C12.8258 6.83039 12.7476 6.85776 12.6662 6.86923C12.5849 6.8807 12.5022 6.87605 12.4226 6.85553C12.3431 6.83501 12.2684 6.79903 12.2028 6.74964C12.1372 6.70026 12.082 6.63844 12.0403 6.5677C11.9986 6.49697 11.9712 6.41872 11.9597 6.3374C11.9483 6.25609 11.9529 6.17332 11.9734 6.09381C12.0951 5.62296 12.325 5.18701 12.6448 4.82065C12.9646 4.45428 13.3656 4.16761 13.8157 3.98346C14.2658 3.7993 14.7526 3.72273 15.2375 3.75985C15.7224 3.79696 16.192 3.94674 16.6088 4.19725C17.0256 4.44777 17.3782 4.79211 17.6386 5.20288C17.8989 5.61366 18.0598 6.07952 18.1084 6.5634C18.157 7.04728 18.092 7.53583 17.9186 7.99017C17.7451 8.44452 17.468 8.85211 17.1094 9.18053C17.9592 9.54849 18.698 10.1324 19.2523 10.8743C19.3016 10.9401 19.3374 11.015 19.3576 11.0947C19.3779 11.1743 19.3822 11.2572 19.3704 11.3386C19.3585 11.4199 19.3308 11.4982 19.2887 11.5688C19.2466 11.6394 19.1909 11.701 19.125 11.7501ZM14.9156 16.5626C14.9593 16.6337 14.9882 16.7129 15.0007 16.7954C15.0133 16.8779 15.0092 16.9621 14.9886 17.043C14.9681 17.1239 14.9316 17.1999 14.8812 17.2664C14.8309 17.333 14.7677 17.3888 14.6954 17.4305C14.6232 17.4723 14.5433 17.4991 14.4605 17.5095C14.3776 17.5198 14.2936 17.5135 14.2133 17.4909C14.1329 17.4682 14.0579 17.4297 13.9927 17.3776C13.9275 17.3255 13.8734 17.2609 13.8336 17.1876C13.4398 16.5211 12.8791 15.9687 12.2068 15.5851C11.5345 15.2014 10.7737 14.9996 9.9996 14.9996C9.22549 14.9996 8.46475 15.2014 7.79242 15.5851C7.12008 15.9687 6.55938 16.5211 6.16562 17.1876C6.12655 17.2622 6.07277 17.3283 6.00752 17.3816C5.94228 17.435 5.86691 17.4746 5.78595 17.4981C5.705 17.5216 5.62013 17.5285 5.53645 17.5183C5.45277 17.5081 5.37202 17.4811 5.29904 17.439C5.22606 17.3968 5.16237 17.3403 5.1118 17.2728C5.06122 17.2054 5.02481 17.1284 5.00476 17.0465C4.98471 16.9647 4.98142 16.8796 4.9951 16.7964C5.00878 16.7132 5.03915 16.6337 5.08437 16.5626C5.6903 15.5214 6.61421 14.7021 7.7203 14.2251C7.0979 13.7485 6.64048 13.0889 6.41234 12.339C6.18419 11.589 6.19679 10.7865 6.44836 10.044C6.69994 9.30163 7.17784 8.65672 7.81489 8.19996C8.45194 7.7432 9.21611 7.49755 9.99999 7.49755C10.7839 7.49755 11.548 7.7432 12.1851 8.19996C12.8221 8.65672 13.3 9.30163 13.5516 10.044C13.8032 10.7865 13.8158 11.589 13.5876 12.339C13.3595 13.0889 12.9021 13.7485 12.2797 14.2251C13.3858 14.7021 14.3097 15.5214 14.9156 16.5626ZM9.99999 13.7501C10.4944 13.7501 10.9778 13.6034 11.3889 13.3287C11.8 13.054 12.1205 12.6636 12.3097 12.2068C12.4989 11.75 12.5484 11.2473 12.452 10.7623C12.3555 10.2774 12.1174 9.83192 11.7678 9.48229C11.4181 9.13266 10.9727 8.89456 10.4877 8.79809C10.0028 8.70163 9.5001 8.75114 9.04328 8.94036C8.58647 9.12958 8.19602 9.45001 7.92132 9.86113C7.64662 10.2723 7.49999 10.7556 7.49999 11.2501C7.49999 11.9131 7.76338 12.549 8.23223 13.0178C8.70107 13.4867 9.33695 13.7501 9.99999 13.7501ZM5.62499 9.37506C5.62499 9.2093 5.55914 9.05033 5.44193 8.93312C5.32472 8.81591 5.16575 8.75006 4.99999 8.75006C4.64931 8.75003 4.30567 8.65165 4.00809 8.46611C3.71052 8.28056 3.47094 8.01528 3.31658 7.7004C3.16222 7.38552 3.09925 7.03367 3.13484 6.68479C3.17042 6.33592 3.30313 6.00402 3.51789 5.72679C3.73265 5.44957 4.02085 5.23812 4.34976 5.11648C4.67866 4.99483 5.03509 4.96787 5.37856 5.03864C5.72203 5.10941 6.03876 5.27509 6.29279 5.51685C6.54681 5.75861 6.72795 6.06676 6.81562 6.40631C6.85706 6.56689 6.96059 6.70443 7.10344 6.78867C7.24629 6.87292 7.41676 6.89697 7.57734 6.85553C7.73792 6.81409 7.87546 6.71055 7.9597 6.5677C8.04395 6.42485 8.06799 6.25439 8.02655 6.09381C7.90487 5.62296 7.67497 5.18701 7.35516 4.82065C7.03534 4.45428 6.63443 4.16761 6.18433 3.98346C5.73423 3.7993 5.24736 3.72273 4.76246 3.75985C4.27756 3.79696 3.80801 3.94674 3.39119 4.19725C2.97436 4.44777 2.62175 4.79211 2.36142 5.20288C2.10108 5.61366 1.94021 6.07952 1.89161 6.5634C1.843 7.04728 1.908 7.53583 2.08143 7.99017C2.25486 8.44452 2.53194 8.85211 2.89062 9.18053C2.04162 9.54884 1.30368 10.1327 0.749993 10.8743C0.650433 11.0069 0.607629 11.1736 0.630998 11.3378C0.654367 11.5019 0.741994 11.6501 0.874602 11.7497C1.00721 11.8492 1.17394 11.892 1.3381 11.8687C1.50227 11.8453 1.65043 11.7577 1.74999 11.6251C2.1267 11.1187 2.61703 10.7079 3.18152 10.4256C3.74601 10.1434 4.36888 9.99761 4.99999 10.0001C5.16575 10.0001 5.32472 9.93421 5.44193 9.817C5.55914 9.69979 5.62499 9.54082 5.62499 9.37506Z"
                fill="#1C1C1C"
              />
            </svg>

            <p
              className="tabs-text"
              style={selectedTab == 4 ? { fontWeight: 700 } : {}}
              onClick={async () => {
                if (!isOnboarding || onboardingStep == 10) {
                  if (isOnboarding) {
                    await nextOnboardingStep();
                  }
                  navigation("/manager");
                }
              }}
            >
              Manager
            </p>
          </div>
        )}

        <div
          className="sidebar-tabs"
          style={
            isOnboarding && onboardingStep > 4 ? { filter: "blur(5px)" } : {}
          }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M17.5 10C17.5 11.4834 17.0601 12.9334 16.236 14.1668C15.4119 15.4001 14.2406 16.3614 12.8701 16.9291C11.4997 17.4968 9.99168 17.6453 8.53683 17.3559C7.08197 17.0665 5.7456 16.3522 4.6967 15.3033C3.64781 14.2544 2.9335 12.918 2.64411 11.4632C2.35472 10.0083 2.50325 8.50032 3.07091 7.12987C3.63856 5.75943 4.59986 4.58809 5.83323 3.76398C7.0666 2.93987 8.51664 2.5 10 2.5C11.9891 2.5 13.8968 3.29018 15.3033 4.6967C16.7098 6.10322 17.5 8.01088 17.5 10Z"
              fill="#1C1C1C"
              fill-opacity="0.1"
            />
            <path
              d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM10 16.875C8.64026 16.875 7.31105 16.4718 6.18046 15.7164C5.04987 14.9609 4.16868 13.8872 3.64833 12.6309C3.12798 11.3747 2.99183 9.99237 3.2571 8.65875C3.52238 7.32513 4.17716 6.10013 5.13864 5.13864C6.10013 4.17716 7.32514 3.52237 8.65876 3.2571C9.99238 2.99183 11.3747 3.12798 12.631 3.64833C13.8872 4.16868 14.9609 5.04987 15.7164 6.18045C16.4718 7.31104 16.875 8.64025 16.875 10C16.8729 11.8227 16.1479 13.5702 14.8591 14.8591C13.5702 16.1479 11.8227 16.8729 10 16.875ZM9.375 10.625V6.25C9.375 6.08424 9.44085 5.92527 9.55806 5.80806C9.67527 5.69085 9.83424 5.625 10 5.625C10.1658 5.625 10.3247 5.69085 10.4419 5.80806C10.5592 5.92527 10.625 6.08424 10.625 6.25V10.625C10.625 10.7908 10.5592 10.9497 10.4419 11.0669C10.3247 11.1842 10.1658 11.25 10 11.25C9.83424 11.25 9.67527 11.1842 9.55806 11.0669C9.44085 10.9497 9.375 10.7908 9.375 10.625ZM10.9375 13.4375C10.9375 13.6229 10.8825 13.8042 10.7795 13.9583C10.6765 14.1125 10.5301 14.2327 10.3588 14.3036C10.1875 14.3746 9.99896 14.3932 9.81711 14.357C9.63525 14.3208 9.4682 14.2315 9.33709 14.1004C9.20598 13.9693 9.11669 13.8023 9.08052 13.6204C9.04434 13.4385 9.06291 13.25 9.13387 13.0787C9.20482 12.9074 9.32499 12.761 9.47916 12.658C9.63333 12.555 9.81458 12.5 10 12.5C10.2486 12.5 10.4871 12.5988 10.6629 12.7746C10.8387 12.9504 10.9375 13.1889 10.9375 13.4375Z"
              fill="#1C1C1C"
            />
          </svg>

          <p
            className="tabs-text"
            onClick={() => {
              window.open("https://discord.gg/FGJPYGNp5w", "_blank");
            }}
          >
            Support
          </p>
        </div>
      </div> */}
    </div>
  );
}

export default Sidebar;
