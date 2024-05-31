import React, { useEffect, useState } from "react";
import Sidebar from "../../../components/Header";
import "./Manager.css";

function Manager(props) {
  const percentage = (98 / 150) * 100;
  const [isOnboarding, setIsOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [emailInvite, setEmailInvite] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [errorMessage, setErrorMessage] = useState("Press Enter to Invite");
  const [teamMembers, setTeamMembers] = useState([]);

  const type = localStorage.getItem("crmType");
  const invite_id =
    type == "crm"
      ? localStorage.getItem("connection_id")
      : localStorage.getItem("uid");
  const invite_link = `https://www.boondoggle.ai/${invite_id}`;

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

    async function getTeamMembers() {
      const uid = localStorage.getItem("uid");
      const { data, error } = await props.db
        .from("users")
        .select("")
        .eq("id", uid);
      setTeamMembers(data[0].teamMembers);
    }

    checkOnBoarding();
    getTeamMembers();
  }, []);

  async function inviteMember(event) {
    if (event.key == "Enter" || isOnboarding) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmailTest = emailRegex.test(emailInvite);
      if (isValidEmailTest) {
        const { data, error } = await props.db.auth.admin.inviteUserByEmail(
          emailInvite
        );
        if (error) {
          setErrorMessage("A User with this Email has Already been Registered");
          setIsValidEmail(false);
        } else {
          const uid = localStorage.getItem("uid");
          await props.db.from("users").insert({
            id: data.user.id,
            crm_id: invite_id,
            manager_id: uid,
            isAdmin: false,
          });
          let new_member_array = [
            ...teamMembers,
            {
              uid: data.user.id,
              email: emailInvite,
              isAdmin: false,
            },
          ];
          await props.db
            .from("users")
            .update({
              teamMembers: new_member_array,
            })
            .eq("id", uid);
          setEmailInvite("");
          setTeamMembers(new_member_array);
          setIsValidEmail(true);
          setErrorMessage("Press Enter to Invite");
        }
      } else {
        setIsValidEmail(false);
        setErrorMessage("Please Enter a Valid Email");
      }
    }
  }

  return (
    <div className="container">
      <div className="content-container">
        <Sidebar
          selectedTab={4}
          db={props.db}
          onboardingStep={onboardingStep}
        />
        <div
          style={{
            flexDirection: "column",
          }}
        >
          <div className="dashboard-header">
            <div className="header-text-container">
              <span className="header-text-2">Manager</span>
            </div>
          </div>
          <div className="manager-content">
            <div className="manager-info-container">
              <div className="manager-info-header-container">
                <div className="manager-info-header-text-container">
                  <span className="manager-info-header">Overview</span>
                </div>
                <div className="manager-info-header-button-container"></div>
              </div>

              {/* <div className="manager-info-members-header-container">
                <span className="manager-info-members-header-text">
                  Increase credits via add-ons
                </span>
                <span className="manager-info-members-subheader-text">
                  2 of 10 Used
                </span>
              </div>

              <div className="team-members-count-text-container">
                <span className="team-members-count-text">
                  Growth Subscription, unlimited team members. Avg. member
                  usage: 1500/credits/mo
                </span>
              </div>

              <div className="team-members-count-container">
                <div className="filled-member" />
                <div className="filled-member" />
                <div className="unfilled-member" />
                <div className="unfilled-member" />
                <div className="unfilled-member" />
                <div className="unfilled-member" />
                <div className="unfilled-member" />
                <div className="unfilled-member" />
              </div> */}

              <div className="manager-info-members-header-container">
                <span className="manager-info-members-header-text">
                  Invite Team Members
                </span>
              </div>

              <div
                className="manager-invite-link-container"
                style={!isValidEmail ? { border: "1px solid red" } : {}}
              >
                <div className="manager-invite-link-content">
                  <input
                    className="manager-invite-link-text-container"
                    placeholder="Enter Email of Invitee"
                    value={emailInvite}
                    onChange={(event) => {
                      setEmailInvite(event.target.value);
                    }}
                    onKeyDown={async (event) => {
                      await inviteMember(event);
                    }}
                  ></input>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M10.5 9.49991C10.5 9.63252 10.4473 9.75969 10.3536 9.85346C10.2598 9.94723 10.1326 9.99991 10 9.99991H6C5.86739 9.99991 5.74021 9.94723 5.64645 9.85346C5.55268 9.75969 5.5 9.63252 5.5 9.49991C5.5 9.3673 5.55268 9.24012 5.64645 9.14636C5.74021 9.05259 5.86739 8.99991 6 8.99991H10C10.1326 8.99991 10.2598 9.05259 10.3536 9.14636C10.4473 9.24012 10.5 9.3673 10.5 9.49991ZM10 6.99991H6C5.86739 6.99991 5.74021 7.05259 5.64645 7.14636C5.55268 7.24012 5.5 7.3673 5.5 7.49991C5.5 7.63252 5.55268 7.75969 5.64645 7.85346C5.74021 7.94723 5.86739 7.99991 6 7.99991H10C10.1326 7.99991 10.2598 7.94723 10.3536 7.85346C10.4473 7.75969 10.5 7.63252 10.5 7.49991C10.5 7.3673 10.4473 7.24012 10.3536 7.14636C10.2598 7.05259 10.1326 6.99991 10 6.99991ZM13.5 2.99991V13.4999C13.5 13.7651 13.3946 14.0195 13.2071 14.207C13.0196 14.3946 12.7652 14.4999 12.5 14.4999H3.5C3.23478 14.4999 2.98043 14.3946 2.79289 14.207C2.60536 14.0195 2.5 13.7651 2.5 13.4999V2.99991C2.5 2.73469 2.60536 2.48034 2.79289 2.2928C2.98043 2.10527 3.23478 1.99991 3.5 1.99991H5.76625C6.04719 1.68536 6.39139 1.4337 6.77633 1.26138C7.16127 1.08907 7.57826 1 8 1C8.42174 1 8.83873 1.08907 9.22367 1.26138C9.6086 1.4337 9.95281 1.68536 10.2338 1.99991H12.5C12.7652 1.99991 13.0196 2.10527 13.2071 2.2928C13.3946 2.48034 13.5 2.73469 13.5 2.99991ZM6 3.99991H10C10 3.46948 9.78929 2.96077 9.41421 2.5857C9.03914 2.21062 8.53043 1.99991 8 1.99991C7.46957 1.99991 6.96086 2.21062 6.58579 2.5857C6.21071 2.96077 6 3.46948 6 3.99991ZM12.5 2.99991H10.8281C10.9419 3.32104 11 3.65923 11 3.99991V4.49991C11 4.63252 10.9473 4.75969 10.8536 4.85346C10.7598 4.94723 10.6326 4.99991 10.5 4.99991H5.5C5.36739 4.99991 5.24021 4.94723 5.14645 4.85346C5.05268 4.75969 5 4.63252 5 4.49991V3.99991C5.00001 3.65923 5.05814 3.32104 5.17188 2.99991H3.5V13.4999H12.5V2.99991Z"
                      fill="#1C1C1C"
                      fill-opacity="0.4"
                    />
                  </svg> */}
                </div>
              </div>

              <div className="team-members-count-text-container">
                <span
                  className="team-members-count-text"
                  style={!isValidEmail ? { color: "red" } : {}}
                >
                  {errorMessage}
                </span>
              </div>

              {/* <div className="manager-info-members-header-container">
                <span className="manager-info-members-header-text">
                  Active until Dec 9, 2022
                </span>
              </div>

              <div className="team-members-count-text-container">
                <span className="team-members-count-text">
                  We will send you a notification upon monthly subscription
                  renewal.
                </span>
              </div> */}

              {/* <div className="manager-info-members-header-container">
                <span className="manager-info-members-header-text">
                  $30.00 Per User{" "}
                  <span style={{ fontWeight: 400 }}>(billing $60/mo)</span>
                </span>
              </div>

              <div className="team-members-count-text-container">
                <span className="team-members-count-text">
                  Growth Subscription, billable up to 10 users. Upgrade for 10+
                  users to Enterprise.
                </span>
              </div> */}

              <div className="manager-info-members-header-container">
                <span className="manager-info-members-header-text">
                  Connected Users
                </span>
              </div>

              <div className="manager-connected-users-container">
                {teamMembers.map((member) => {
                  return (
                    <div className="connected-user-card">
                      <div className="connected-user-card-content">
                        <div className="connected-user-card-text-container">
                          <span className="connected-user-card-text-header">
                            {member.email}
                          </span>
                          {/* <span className="connected-user-card-text-subheader">
                            raj@boondoggle.ai
                          </span> */}
                        </div>
                      </div>

                      {/* <div className="connected-users-card-button-container">
                        <button className="connected-users-card-pause-button">
                          <span className="connected-users-card-button-text">
                            Pause
                          </span>
                        </button>
                        <button className="connected-users-card-deactivate-button">
                          <span className="connected-users-card-button-text">
                            Deactivate
                          </span>
                        </button>
                      </div> */}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Manager;
