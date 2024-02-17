import React, { useEffect, useState, useRef } from "react";
import "./Landing.css";
import { useNavigate, useLocation } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header/Header";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";
import image from "../../assets/landing/2.svg";
import image2 from "../../assets/landing/1.svg";
import image3 from "../../assets/landing/1-update.svg";
import image4 from "../../assets/landing/cross-platform.svg";
import image5 from "../../assets/landing/crm-choice.svg";

function Landing(props) {
  const [category, selectCategory] = useState("crm");
  const { state } = useLocation();
  const navigation = useNavigate();

  useEffect(() => {
    if (state) {
      const item = document.getElementById(state.id);
      item.scrollIntoView({ behavior: "smooth" });
    } else {
      console.log("none");
    }
  }, []);
  return (
    <>
      <BrowserView>
        <div className="landing-container">
          <Header isMobile={false} />
          <div className="landing-text-container">
            <span className="landing-text-big" style={{ fontSize: "60px" }}>
              Automations that simplify your work
            </span>
            <p className="landing-text-medium">
              Boondoggle <span style={{ fontWeight: "700" }}>summarizes</span>{" "}
              your social media messages, emails, <br /> and meeting notes,{" "}
              <span style={{ fontWeight: "700" }}>enriches</span> your contacts,
              then <span style={{ fontWeight: "700" }}>updates</span> your CRM
              daily.
            </p>
            <div className="landing-button-container">
              <button
                className="get-started-button"
                onClick={() => {
                  navigation("/signup");
                }}
              >
                <p className="landing-button-text">Get Started</p>
              </button>
              {/* <button
                className="get-started-button"
                onClick={() => {
                  // navigation("/signup");
                  window.open(
                    "https://ipk90u6jozo.typeform.com/to/dJcgJZAu",
                    "_blank"
                  );
                }}
              >
                <p className="landing-button-text">Join Waitlist</p>
              </button> */}
              <button className="demo-button">
                <p
                  className="landing-button-text"
                  style={{ color: "black" }}
                  onClick={() => {
                    window.open(
                      "https://calendly.com/blakefaulkner/meeting",
                      "_blank"
                    );
                  }}
                >
                  Book a demo
                </p>
              </button>
            </div>
            <img src={image} className="landing-1-img"></img>
            <span className="landing-text-big" style={{ marginTop: "125px" }}>
              Get back 10 hours every week
            </span>
            <p className="landing-text-medium">
              Boondoggle’s AI tooling allows you to automate your CRM entries
              and data collection.
            </p>
            <img src={image2} className="landing-2-img"></img>
            <span
              className="landing-text-big"
              style={{ marginTop: "125px" }}
              id="integrations"
            >
              Boondoggle integrates with your everyday tools
            </span>
            <p className="landing-text-medium">
              Boondoggle connects with{" "}
              <span style={{ fontWeight: "700" }}>50+ common workplace</span>{" "}
              tool integrations, powering our{" "}
              <span style={{ fontWeight: "700" }}>automations</span>.
            </p>
            <div className="integration-categories-container">
              <button
                onClick={() => {
                  selectCategory("crm");
                }}
                className={
                  category == "crm"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "crm" ? { color: "#fff" } : {}}
                >
                  CRM
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("enrichment");
                }}
                className={
                  category == "enrichment"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "enrichment" ? { color: "#fff" } : {}}
                >
                  Enrichment
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("social");
                }}
                className={
                  category == "social"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "social" ? { color: "#fff" } : {}}
                >
                  Social Media
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("email");
                }}
                className={
                  category == "email"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "email" ? { color: "#fff" } : {}}
                >
                  Email
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("meeting");
                }}
                className={
                  category == "meeting"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "meeting" ? { color: "#fff" } : {}}
                >
                  Meeting Notes
                </p>
              </button>
            </div>
            <div className="integration-table-container">
              {category == "crm" && (
                <>
                  <div className="integration-table-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="30"
                      viewBox="0 0 49 35"
                      fill="none"
                    >
                      <path
                        d="M20.2286 4.6349C21.7927 3.00511 23.9704 1.99435 26.3788 1.99435C29.5803 1.99435 32.3735 3.77959 33.861 6.4298C35.1536 5.85223 36.5844 5.53096 38.0899 5.53096C43.8642 5.53096 48.5456 10.2531 48.5456 16.0779C48.5456 21.9034 43.8642 26.6256 38.0899 26.6256C37.3852 26.6256 36.6964 26.5551 36.0303 26.4204C34.7204 28.7569 32.2243 30.3356 29.3592 30.3356C28.1598 30.3356 27.0254 30.0586 26.0154 29.566C24.6875 32.6894 21.5937 34.8795 17.988 34.8795C14.2331 34.8795 11.033 32.5036 9.80457 29.1715C9.26776 29.2855 8.7116 29.3449 8.14093 29.3449C3.67025 29.3449 0.0458984 25.6832 0.0458984 21.1656C0.0458984 18.1381 1.6743 15.4948 4.09376 14.0806C3.59564 12.9344 3.31859 11.6694 3.31859 10.3395C3.31859 5.14407 7.53641 0.932472 12.7387 0.932472C15.7931 0.932472 18.5076 2.3847 20.2286 4.6349Z"
                        fill="#00A1E0"
                      />
                      <path
                        d="M7.07053 18.5366C7.04013 18.616 7.08159 18.6326 7.09126 18.6464C7.18245 18.7127 7.27503 18.7604 7.3683 18.8136C7.86297 19.0761 8.33 19.1528 8.81846 19.1528C9.81332 19.1528 10.431 18.6236 10.431 17.7718V17.7552C10.431 16.9676 9.73387 16.6816 9.07961 16.475L8.99463 16.4473C8.50134 16.2871 8.07576 16.1489 8.07576 15.8242V15.8069C8.07576 15.5292 8.32448 15.3247 8.70999 15.3247C9.13833 15.3247 9.64682 15.467 9.9743 15.648C9.9743 15.648 10.0703 15.7102 10.1056 15.6169C10.1249 15.5672 10.2907 15.1209 10.308 15.0725C10.3266 15.02 10.2935 14.9813 10.2596 14.9606C9.88586 14.7333 9.36909 14.5778 8.83435 14.5778L8.73486 14.5785C7.82428 14.5785 7.18867 15.1285 7.18867 15.9168V15.9333C7.18867 16.7645 7.88991 17.0339 8.54694 17.2218L8.65264 17.2543C9.13142 17.4015 9.54388 17.5279 9.54388 17.865V17.8816C9.54388 18.1897 9.27582 18.4191 8.84333 18.4191C8.67544 18.4191 8.14001 18.4157 7.56175 18.0502C7.49197 18.0094 7.45121 17.9797 7.39732 17.9472C7.36899 17.9293 7.29783 17.8982 7.26674 17.9922L7.07053 18.5366Z"
                        fill="white"
                      />
                      <path
                        d="M21.635 18.5366C21.6046 18.616 21.646 18.6326 21.6557 18.6464C21.7469 18.7127 21.8395 18.7604 21.9328 18.8136C22.4274 19.0761 22.8945 19.1528 23.3829 19.1528C24.3778 19.1528 24.9954 18.6236 24.9954 17.7718V17.7552C24.9954 16.9676 24.2983 16.6816 23.6441 16.475L23.5591 16.4473C23.0658 16.2871 22.6402 16.1489 22.6402 15.8242V15.8069C22.6402 15.5292 22.8889 15.3247 23.2744 15.3247C23.7028 15.3247 24.2113 15.467 24.5387 15.648C24.5387 15.648 24.6348 15.7102 24.67 15.6169C24.6894 15.5672 24.8552 15.1209 24.8724 15.0725C24.8911 15.02 24.8579 14.9813 24.8241 14.9606C24.4503 14.7333 23.9335 14.5778 23.3988 14.5778L23.2993 14.5785C22.3887 14.5785 21.7531 15.1285 21.7531 15.9168V15.9333C21.7531 16.7645 22.4544 17.0339 23.1114 17.2218L23.2171 17.2543C23.6959 17.4015 24.109 17.5279 24.109 17.865V17.8816C24.109 18.1897 23.8403 18.4191 23.4078 18.4191C23.2399 18.4191 22.7045 18.4157 22.1262 18.0502C22.0564 18.0094 22.015 17.9811 21.9625 17.9472C21.9445 17.9355 21.8602 17.903 21.8312 17.9922L21.635 18.5366Z"
                        fill="white"
                      />
                      <path
                        d="M31.5771 16.8681C31.5771 17.3497 31.4872 17.729 31.3104 17.997C31.1356 18.2623 30.871 18.3915 30.5021 18.3915C30.1324 18.3915 29.8692 18.263 29.6972 17.997C29.5231 17.7296 29.4346 17.3497 29.4346 16.8681C29.4346 16.3873 29.5231 16.0087 29.6972 15.7434C29.8692 15.4808 30.1324 15.353 30.5021 15.353C30.871 15.353 31.1356 15.4808 31.3111 15.7434C31.4872 16.0087 31.5771 16.3873 31.5771 16.8681ZM32.4075 15.9755C32.326 15.6998 32.1989 15.4566 32.0296 15.2542C31.8603 15.0511 31.6461 14.8881 31.3919 14.7692C31.1384 14.6511 30.8385 14.591 30.5021 14.591C30.1649 14.591 29.8651 14.6511 29.6115 14.7692C29.3573 14.8881 29.1431 15.0511 28.9731 15.2542C28.8046 15.4573 28.6774 15.7005 28.5952 15.9755C28.5144 16.2498 28.4736 16.5496 28.4736 16.8681C28.4736 17.1866 28.5144 17.4871 28.5952 17.7607C28.6774 18.0357 28.8039 18.2789 28.9738 18.482C29.1431 18.6851 29.358 18.8475 29.6115 18.9629C29.8658 19.0782 30.1649 19.137 30.5021 19.137C30.8385 19.137 31.1377 19.0782 31.3919 18.9629C31.6455 18.8475 31.8603 18.6851 32.0296 18.482C32.1989 18.2796 32.326 18.0364 32.4075 17.7607C32.489 17.4865 32.5298 17.1859 32.5298 16.8681C32.5298 16.5503 32.489 16.2498 32.4075 15.9755Z"
                        fill="white"
                      />
                      <path
                        d="M39.2284 18.2626C39.2007 18.1818 39.1226 18.2122 39.1226 18.2122C39.0017 18.2585 38.8732 18.3013 38.7364 18.3227C38.5976 18.3442 38.4449 18.3552 38.2812 18.3552C37.8791 18.3552 37.5599 18.2357 37.3312 17.9994C37.1018 17.7631 36.9733 17.3811 36.9747 16.8643C36.9761 16.3938 37.0894 16.0401 37.2932 15.7706C37.4956 15.5026 37.8038 15.3651 38.2148 15.3651C38.5575 15.3651 38.8187 15.4045 39.0923 15.4908C39.0923 15.4908 39.1579 15.5192 39.189 15.4335C39.2615 15.2317 39.3154 15.0874 39.3928 14.8656C39.4149 14.8027 39.361 14.7758 39.3417 14.7682C39.2339 14.726 38.9796 14.6576 38.7876 14.6286C38.6079 14.601 38.3979 14.5865 38.1644 14.5865C37.8155 14.5865 37.5046 14.6459 37.2386 14.7647C36.9733 14.8828 36.7481 15.0459 36.5699 15.249C36.3916 15.4521 36.2562 15.6953 36.1657 15.9703C36.0759 16.2446 36.0303 16.5458 36.0303 16.8643C36.0303 17.5531 36.2161 18.1099 36.583 18.5176C36.9505 18.9266 37.5025 19.1345 38.2224 19.1345C38.648 19.1345 39.0847 19.0482 39.3983 18.9245C39.3983 18.9245 39.4584 18.8955 39.4322 18.8257L39.2284 18.2626Z"
                        fill="white"
                      />
                      <path
                        d="M40.6807 16.4066C40.7201 16.1393 40.794 15.9168 40.908 15.7434C41.08 15.4802 41.3425 15.3358 41.7115 15.3358C42.0804 15.3358 42.3243 15.4809 42.4991 15.7434C42.6151 15.9168 42.6656 16.1489 42.6856 16.4066H40.6807ZM43.4767 15.8187C43.4062 15.5527 43.2314 15.284 43.1167 15.161C42.9357 14.9662 42.7588 14.8301 42.5834 14.7541C42.354 14.656 42.079 14.591 41.7778 14.591C41.4268 14.591 41.1083 14.6497 40.8499 14.7713C40.5909 14.8929 40.3732 15.0587 40.2026 15.2653C40.0319 15.4712 39.9034 15.7165 39.8219 15.9949C39.7397 16.2719 39.6982 16.5738 39.6982 16.8923C39.6982 17.2164 39.7411 17.5183 39.8261 17.7898C39.9117 18.0634 40.0485 18.3045 40.2337 18.5042C40.4181 18.7052 40.6558 18.8627 40.9404 18.9726C41.223 19.0817 41.5664 19.1384 41.9609 19.1377C42.7727 19.1349 43.2003 18.9539 43.3765 18.8565C43.4076 18.8392 43.4373 18.8088 43.4 18.7218L43.2162 18.2071C43.1886 18.1304 43.1105 18.1587 43.1105 18.1587C42.9094 18.2333 42.6234 18.3674 41.9567 18.366C41.5208 18.3653 41.1975 18.2368 40.995 18.0357C40.7871 17.8299 40.6855 17.5272 40.6675 17.1003L43.4787 17.103C43.4787 17.103 43.5527 17.1017 43.5603 17.0298C43.563 16.9994 43.657 16.4522 43.4767 15.8187Z"
                        fill="white"
                      />
                      <path
                        d="M18.167 16.4066C18.2071 16.1393 18.2803 15.9168 18.3943 15.7434C18.5663 15.4802 18.8289 15.3358 19.1978 15.3358C19.5667 15.3358 19.8106 15.4809 19.9861 15.7434C20.1015 15.9168 20.1519 16.1489 20.1719 16.4066H18.167ZM20.9623 15.8187C20.8918 15.5527 20.7177 15.284 20.603 15.161C20.422 14.9662 20.2452 14.8301 20.0697 14.7541C19.8403 14.656 19.5653 14.591 19.2641 14.591C18.9138 14.591 18.5947 14.6497 18.3363 14.7713C18.0772 14.8929 17.8596 15.0587 17.6889 15.2653C17.5183 15.4712 17.3898 15.7165 17.3082 15.9949C17.2267 16.2719 17.1846 16.5738 17.1846 16.8923C17.1846 17.2164 17.2274 17.5183 17.3124 17.7898C17.3981 18.0634 17.5348 18.3045 17.72 18.5042C17.9045 18.7052 18.1421 18.8627 18.4268 18.9726C18.7093 19.0817 19.0527 19.1384 19.4472 19.1377C20.259 19.1349 20.6866 18.9539 20.8628 18.8565C20.8939 18.8392 20.9236 18.8088 20.8863 18.7218L20.7032 18.2071C20.6749 18.1304 20.5968 18.1587 20.5968 18.1587C20.3958 18.2333 20.1104 18.3674 19.4424 18.366C19.0071 18.3653 18.6838 18.2368 18.4814 18.0357C18.2734 17.8299 18.1718 17.5272 18.1539 17.1003L20.9651 17.103C20.9651 17.103 21.039 17.1017 21.0466 17.0298C21.0493 16.9994 21.1433 16.4522 20.9623 15.8187Z"
                        fill="white"
                      />
                      <path
                        d="M12.0898 18.2471C11.98 18.1594 11.9648 18.1373 11.9275 18.0806C11.8722 17.9942 11.8439 17.8713 11.8439 17.7151C11.8439 17.4678 11.9254 17.2902 12.0947 17.1707C12.0926 17.1714 12.3365 16.96 12.9099 16.9676C13.3127 16.9731 13.6726 17.0325 13.6726 17.0325V18.3107H13.6733C13.6733 18.3107 13.3161 18.3874 12.9141 18.4115C12.342 18.4461 12.0878 18.2464 12.0898 18.2471ZM13.2084 16.2719C13.0944 16.2636 12.9465 16.2588 12.7697 16.2588C12.5285 16.2588 12.2957 16.2892 12.0774 16.3479C11.8577 16.4066 11.6601 16.4985 11.4902 16.6201C11.3195 16.7424 11.182 16.8985 11.0825 17.0837C10.9831 17.2688 10.9326 17.4871 10.9326 17.7317C10.9326 17.9804 10.9755 18.1967 11.0611 18.3735C11.1468 18.5511 11.2705 18.6989 11.428 18.8129C11.5841 18.9269 11.7769 19.0105 12.0007 19.061C12.2211 19.1114 12.4712 19.137 12.7448 19.137C13.0329 19.137 13.3203 19.1135 13.5987 19.0658C13.8744 19.0188 14.2129 18.9504 14.3069 18.929C14.4001 18.9069 14.5038 18.8786 14.5038 18.8786C14.5736 18.8613 14.568 18.7867 14.568 18.7867L14.5666 16.2159C14.5666 15.6522 14.416 15.2342 14.1196 14.9751C13.8246 14.7167 13.3901 14.5861 12.8284 14.5861C12.6177 14.5861 12.2784 14.6152 12.0753 14.6559C12.0753 14.6559 11.4611 14.7747 11.2083 14.9723C11.2083 14.9723 11.153 15.0069 11.1834 15.0843L11.3824 15.619C11.4073 15.6881 11.4743 15.6646 11.4743 15.6646C11.4743 15.6646 11.4957 15.6563 11.5206 15.6418C12.0615 15.3475 12.7455 15.3565 12.7455 15.3565C13.0495 15.3565 13.283 15.4173 13.4405 15.5382C13.5939 15.6556 13.672 15.8332 13.672 16.2076V16.3265C13.4301 16.2919 13.2084 16.2719 13.2084 16.2719Z"
                        fill="white"
                      />
                      <path
                        d="M35.8827 14.8239C35.9042 14.7604 35.8593 14.73 35.8406 14.7231C35.7929 14.7044 35.5539 14.654 35.3694 14.6422C35.0164 14.6208 34.8202 14.6802 34.6447 14.759C34.4706 14.8378 34.2771 14.9649 34.1694 15.1093V14.7673C34.1694 14.7196 34.1355 14.6816 34.0885 14.6816H33.3679C33.321 14.6816 33.2871 14.7196 33.2871 14.7673V18.9602C33.2871 19.0072 33.3258 19.0459 33.3728 19.0459H34.1113C34.1583 19.0459 34.1963 19.0072 34.1963 18.9602V16.8655C34.1963 16.5843 34.2274 16.3038 34.2896 16.1276C34.3504 15.9535 34.4333 15.814 34.5355 15.7138C34.6385 15.6143 34.7552 15.5445 34.883 15.5051C35.0136 15.4651 35.158 15.4519 35.2603 15.4519C35.4074 15.4519 35.5691 15.4899 35.5691 15.4899C35.623 15.4962 35.6534 15.463 35.6713 15.4139C35.7197 15.2854 35.8565 14.9006 35.8827 14.8239Z"
                        fill="white"
                      />
                      <path
                        d="M28.9504 12.8803C28.8606 12.8527 28.7791 12.834 28.6727 12.814C28.5649 12.7946 28.4364 12.785 28.2906 12.785C27.7822 12.785 27.3814 12.9287 27.1003 13.2119C26.8204 13.4938 26.6305 13.9228 26.5351 14.4873L26.5006 14.6773H25.8622C25.8622 14.6773 25.7848 14.6745 25.7682 14.7588L25.6639 15.344C25.6563 15.3992 25.6805 15.4345 25.7551 15.4345H26.3762L25.7461 18.9524C25.6971 19.2357 25.6404 19.4685 25.5776 19.6454C25.5161 19.8195 25.456 19.9501 25.3813 20.0454C25.3095 20.1366 25.2418 20.2043 25.1243 20.2437C25.0276 20.2762 24.9157 20.2914 24.7934 20.2914C24.7257 20.2914 24.6352 20.2803 24.5682 20.2665C24.5019 20.2534 24.4666 20.2388 24.4162 20.2174C24.4162 20.2174 24.3436 20.1898 24.3146 20.2623C24.2918 20.3224 24.126 20.7777 24.106 20.8337C24.0866 20.8897 24.1143 20.9332 24.1495 20.9463C24.2324 20.9753 24.2939 20.9947 24.4065 21.0216C24.5627 21.0582 24.6946 21.0603 24.8183 21.0603C25.0767 21.0603 25.3129 21.0237 25.5085 20.9532C25.7047 20.8821 25.876 20.7584 26.028 20.5912C26.1917 20.4102 26.2947 20.2209 26.3928 19.9618C26.4902 19.7062 26.5738 19.3884 26.6401 19.0181L27.2737 15.4345H28.1994C28.1994 15.4345 28.2775 15.4372 28.2934 15.3523L28.3984 14.7678C28.4053 14.7118 28.3818 14.6773 28.3065 14.6773H27.4077C27.4125 14.6572 27.4533 14.3408 27.5562 14.043C27.6004 13.9166 27.6834 13.8137 27.7531 13.7432C27.8222 13.6741 27.9017 13.6251 27.9887 13.5967C28.0778 13.5677 28.1794 13.5539 28.2906 13.5539C28.3749 13.5539 28.4585 13.5636 28.5214 13.5767C28.6084 13.5954 28.6423 13.605 28.6651 13.6119C28.757 13.6396 28.7694 13.6126 28.7874 13.5684L29.0022 12.9784C29.0244 12.9148 28.9698 12.8879 28.9504 12.8803Z"
                        fill="white"
                      />
                      <path
                        d="M16.3908 18.9602C16.3908 19.0072 16.357 19.0452 16.31 19.0452H15.5645C15.5175 19.0452 15.4844 19.0072 15.4844 18.9602V12.9606C15.4844 12.9136 15.5175 12.8756 15.5645 12.8756H16.31C16.357 12.8756 16.3908 12.9136 16.3908 12.9606V18.9602Z"
                        fill="white"
                      />
                    </svg>
                    <p className="integration-table-cell-label">Salesforce</p>
                  </div>
                  <div className="integration-table-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 33 35"
                      fill="none"
                    >
                      <path
                        d="M25.33 12.1601V8.14209C25.8615 7.89326 26.3116 7.49882 26.6279 7.00453C26.9443 6.51025 27.114 5.93638 27.1174 5.34953V5.25494C27.1151 4.43473 26.7884 3.64874 26.2086 3.06863C25.6287 2.48852 24.8429 2.16145 24.0227 2.15884H23.9281C23.1079 2.16107 22.3219 2.48779 21.7418 3.06764C21.1617 3.64748 20.8346 4.43332 20.832 5.25353V5.34812C20.8346 5.93172 21.0018 6.50273 21.3145 6.99549C21.6272 7.48826 22.0727 7.88276 22.5996 8.13362L22.6179 8.14209V12.1686C21.0817 12.4033 19.6352 13.0415 18.4263 14.0181L18.4432 14.0053L7.39155 5.39895C7.60175 4.61057 7.53198 3.7737 7.19413 3.03102C6.85628 2.28834 6.27128 1.68584 5.53887 1.32627C4.80647 0.966689 3.97201 0.872294 3.17779 1.05918C2.38357 1.24606 1.67876 1.70265 1.18355 2.3511C0.688334 2.99954 0.433379 3.79968 0.462156 4.61509C0.490932 5.43049 0.801659 6.21067 1.34135 6.82259C1.88105 7.43451 2.61629 7.84028 3.42171 7.97071C4.22713 8.10114 5.05285 7.94815 5.75809 7.53784L5.74115 7.54631L16.6064 16.0045C15.6458 17.4447 15.1357 19.1383 15.141 20.8696C15.141 22.7656 15.741 24.5233 16.7603 25.9606L16.742 25.9337L13.4355 29.2402C13.1708 29.1548 12.8948 29.1095 12.6167 29.1061H12.6138C12.0462 29.1061 11.4912 29.2744 11.0192 29.5898C10.5472 29.9052 10.1794 30.3534 9.96211 30.8779C9.74487 31.4024 9.68803 31.9795 9.79878 32.5362C9.90953 33.093 10.1829 33.6044 10.5843 34.0058C10.9857 34.4072 11.4971 34.6806 12.0539 34.7914C12.6107 34.9021 13.1878 34.8453 13.7122 34.628C14.2367 34.4108 14.685 34.0429 15.0003 33.5709C15.3157 33.0989 15.4841 32.544 15.4841 31.9763C15.4807 31.6908 15.4335 31.4075 15.3443 31.1363L15.3499 31.156L18.6211 27.8849C19.6872 28.6989 20.925 29.2591 22.2402 29.5227C23.5554 29.7863 24.9134 29.7465 26.2109 29.4062C27.5084 29.0659 28.7111 28.4342 29.7277 27.559C30.7442 26.6839 31.5478 25.5884 32.0772 24.3559C32.6066 23.1234 32.8479 21.7864 32.7827 20.4466C32.7175 19.1069 32.3476 17.7996 31.7011 16.6243C31.0546 15.449 30.1486 14.4367 29.0519 13.6643C27.9552 12.892 26.6968 12.3799 25.3724 12.1672L25.3216 12.1601H25.33ZM23.969 25.3987C23.0743 25.3964 22.2003 25.1291 21.4575 24.6304C20.7146 24.1317 20.1362 23.424 19.7954 22.5967C19.4545 21.7695 19.3665 20.8597 19.5424 19.9825C19.7183 19.1052 20.1503 18.2998 20.7838 17.6679C21.4172 17.036 22.2237 16.606 23.1014 16.4323C23.9791 16.2586 24.8886 16.3489 25.7151 16.6918C26.5415 17.0347 27.2477 17.6148 27.7446 18.3589C28.2414 19.103 28.5066 19.9777 28.5066 20.8724V20.8752C28.5066 22.0757 28.0297 23.2269 27.1809 24.0758C26.332 24.9246 25.1808 25.4015 23.9803 25.4015L23.969 25.3987Z"
                        fill="#FF9D2A"
                      />
                    </svg>
                    <p className="integration-table-cell-label">HubSpot</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/airtable.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Airtable</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/sheets.png")}
                    ></img>
                    <p className="integration-table-cell-label">
                      Google Sheets
                    </p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/aff.png")}
                    ></img>
                    <p className="integration-table-cell-label">Affinity</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/fresh.png")}
                    ></img>
                    <p className="integration-table-cell-label">Freshsales</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/attio.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Attio</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/bullrun.png")}
                    ></img>
                    <p className="integration-table-cell-label">Bullrun</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/close.png")}
                    ></img>
                    <p className="integration-table-cell-label">Close.io</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/copper.png")}
                    ></img>
                    <p className="integration-table-cell-label">Copper</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/suite.png")}
                    ></img>
                    <p className="integration-table-cell-label">NetSuite</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/outreach.png")}
                    ></img>
                    <p className="integration-table-cell-label">Outreach</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/pipedrive.png")}
                    ></img>
                    <p className="integration-table-cell-label">Pipedrive</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/recruit.png")}
                    ></img>
                    <p className="integration-table-cell-label">RecruitCRM</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/high.png")}
                    ></img>
                    <p className="integration-table-cell-label">HighLevel</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/zen.png")}
                    ></img>
                    <p className="integration-table-cell-label">ZendeskSell</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/zoho.png")}
                    ></img>
                    <p className="integration-table-cell-label">ZohoCRM</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/salesloft.png")}
                    ></img>
                    <p className="integration-table-cell-label">Salesloft</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/salesflare.png")}
                    ></img>
                    <p className="integration-table-cell-label">Salesflare</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/crm/notion.png")}
                    ></img>
                    <p className="integration-table-cell-label">Notion</p>
                  </div>
                </>
              )}
              {category == "enrichment" && (
                <>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/apollo.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Apollo.io</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/clearbit.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Clearbit</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/contactout.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ContactOut</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/crunchbase.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Crunchbase</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/crystal.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">CrystalKnows</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/datagma.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Datagma</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/drop.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">DropContact</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/exact.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ExactBuyer</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/fullcontact.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">FullContact</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/prospect.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Get Prospect</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/humantic.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Humantic.ai</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/hunter.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Hunter.io</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/leadsift.png")}
                      className="integration-table-img"
                      style={{ width: "50px" }}
                    ></img>
                    <p className="integration-table-cell-label">LeadSift</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/lusha.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Lusha</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/mattermark.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Mattermark</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/peopledata.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">
                      PeopleDataLabs
                    </p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/slintel.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Slintel</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/x.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Twitter</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/pipi.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Pipl</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/pitchbook.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Pitchbook</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/up.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">UpLead</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/zoominfo.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ZoomInfo</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/recept.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Receptiviti</p>
                  </div>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/enrichments/rocket.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">RocketReach</p>
                  </div>
                </>
              )}
              {category == "social" && (
                <>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/social/linkedin.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">LinkedIn</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/social/x.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Twitter</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/social/instagram.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Instagram</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/social/telegram.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Telegram</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/social/discord.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Discord</p>
                  </div>
                </>
              )}
              {category == "email" && (
                <>
                  <div className="integration-table-cell">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="16"
                      viewBox="0 0 21 16"
                      fill="none"
                    >
                      <path
                        d="M1.99054 15.5156H5.1723V7.78855L0.626953 4.37952L0.626953 14.152C0.626953 14.9065 1.2383 15.5156 1.99054 15.5156Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M16.0811 15.5156H19.2628C20.0173 15.5156 20.6264 14.9043 20.6264 14.152V4.37952L16.0811 7.78855"
                        fill="#34A853"
                      />
                      <path
                        d="M16.0811 1.87969V7.78863L20.6264 4.37963V2.56148C20.6264 0.875141 18.7014 -0.0861629 17.3538 0.92514"
                        fill="#FBBC04"
                      />
                      <path
                        d="M5.17188 7.78845V1.87952L10.6263 5.97034L16.0807 1.87952V7.78845L10.6263 11.8793"
                        fill="#EA4335"
                      />
                      <path
                        d="M0.626953 2.56148V4.37963L5.1723 7.78863V1.87969L3.8996 0.92514C2.54964 -0.0861629 0.626953 0.875141 0.626953 2.56148Z"
                        fill="#C5221F"
                      />
                    </svg>
                    <p className="integration-table-cell-label">Gmail</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/email/outlook.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Outlook</p>
                  </div>

                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/email/Google.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">
                      Google Workspace
                    </p>
                  </div>
                </>
              )}
              {category == "meeting" && (
                <>
                  <div className="integration-table-cell">
                    <img
                      src={require("../../assets/landing/integrations/meeting/otter.png")}
                      className="integration-table-img"
                      style={{ width: "40px", height: "20px" }}
                    ></img>
                    <p className="integration-table-cell-label">Otter.ai</p>
                  </div>
                </>
              )}
            </div>
            <div className="features-container" id="features">
              <div style={{ flexDirection: "column" }}>
                <span
                  className="landing-text-big"
                  style={{ fontSize: "35px", textAlign: "left" }}
                >
                  Go inbox zero across email and socials
                </span>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Reads your in/outbound emails and messages
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Generates professional responses for pasting
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Summarizes business-related daily conversations
                </p>
              </div>
              <img src={image3} className="landing-3-img"></img>
            </div>

            <div className="features-container">
              <img
                src={image4}
                className="landing-3-img"
                style={{ marginRight: "3vw" }}
              ></img>
              <div style={{ flexDirection: "column" }}>
                <span
                  className="landing-text-big"
                  style={{ fontSize: "35px", textAlign: "left" }}
                >
                  Enrich your cross-platform contacts
                </span>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Connect your lead enrichment integrations
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Enrich your contacts with cross-platform info
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Access new info on your existing leads
                </p>
              </div>
            </div>

            <div className="features-container">
              <div style={{ flexDirection: "column" }}>
                <span
                  className="landing-text-big"
                  style={{ fontSize: "35px", textAlign: "left" }}
                >
                  Passively update your CRM of choice
                </span>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Daily interactions entered as CRM updates
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Identifies existing contacts and new leads
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "30px" }}
                >
                  Entries match your CRM’s set formatting
                </p>
              </div>
              <img
                src={image5}
                className="landing-3-img"
                style={{ marginLeft: "3vw" }}
              ></img>
            </div>
            <p className="landing-text-big" id="pricing">
              Built for teams of any size
            </p>
            <div className="pricing-container">
              <div className="pricing-box-black">
                <span className="pricing-box-header-small">STARTER</span>
                <span className="pricing-box-subheader-small">
                  for individuals and startups
                </span>
                <div className="pricing-box-price-container">
                  <span className="pricing-box-price-small">$25</span>
                  <span className="pricing-box-price-subheader-small">
                    /user <br /> /month
                  </span>
                </div>
                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Single user access
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Automated lead enrichment
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      In/outbound insights
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Early feature access
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Single social integration per user
                    </span>
                  </div>
                </div>
                {/* <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Get Started</p>
            </button> */}
              </div>
              <div className="pricing-box-white">
                <span
                  className="pricing-box-header-small"
                  style={{ fontSize: "23.314px", color: "black" }}
                >
                  GROWTH
                </span>
                <span
                  className="pricing-box-subheader-small"
                  style={{ fontSize: "16.653px", color: "black" }}
                >
                  for growing teams
                </span>
                <div className="pricing-box-price-container">
                  <span
                    className="pricing-box-price-small"
                    style={{ fontSize: "53.29px", color: "black" }}
                  >
                    $30
                  </span>
                  <span
                    className="pricing-box-price-subheader-small"
                    style={{
                      color: "var(--black-40, rgba(28, 28, 28, 0.40))",
                      fontSize: "18.318px",
                    }}
                  >
                    /user <br /> /month
                  </span>
                </div>
                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Up to 10 user licenses
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Team management
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Centralized billing
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Meeting note platform integrations
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Multiple social integrations per user
                    </span>
                  </div>
                </div>
                {/* <button
              className="pricing-box-button-small"
              style={{ background: "var(--black-100, #1C1C1C)" }}
            >
              <p
                className="pricing-box-button-text-small"
                style={{
                  fontSize: "19.984px",
                  color: "var(--white-100, #FFF)",
                }}
              >
                Get Started
              </p>
            </button> */}
              </div>
              <div className="pricing-box-black">
                <span className="pricing-box-header-small">ENTERPRISES</span>
                <span className="pricing-box-subheader-small">
                  for larger teams
                </span>
                <span
                  className="pricing-box-price-small"
                  style={{ fontSize: "24px" }}
                >
                  Custom Pricing
                </span>

                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      10+ user licenses
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Custom compliance needs
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Custom integration requests
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Priority support and guidance
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Annual & quarterly billing available
                    </span>
                  </div>
                </div>
                {/* <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Book a demo</p>
            </button> */}
              </div>
            </div>
            <div className="upper-footer-container">
              <p className="upper-footer-header">
                Automate your <br /> CRM Entry <br />
                with AI
              </p>
              <div className="upper-footer-pages">
                <div className="upper-footer-column">
                  <span className="upper-footer-column-header">Product</span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const integrations =
                        document.getElementById("integrations");
                      integrations.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Integrations
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const features = document.getElementById("features");
                      features.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Features
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const pricing = document.getElementById("pricing");
                      pricing.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Pricing
                  </span>
                </div>
                <div className="upper-footer-column">
                  <span className="upper-footer-column-header">Legal</span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/privacy");
                    }}
                  >
                    Privacy Policy
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/terms");
                    }}
                  >
                    Terms of Service
                  </span>
                </div>
              </div>
            </div>
            <div className="lower-footer-container">
              <div className="logo-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="26"
                  viewBox="0 0 25 26"
                  fill="none"
                >
                  <path
                    d="M13.2812 17.0658C13.2812 17.2203 13.2354 17.3713 13.1496 17.4998C13.0637 17.6283 12.9417 17.7284 12.799 17.7876C12.6562 17.8467 12.4991 17.8622 12.3476 17.832C12.196 17.8019 12.0568 17.7275 11.9476 17.6182C11.8383 17.5089 11.7639 17.3697 11.7338 17.2182C11.7036 17.0666 11.7191 16.9096 11.7782 16.7668C11.8373 16.6241 11.9375 16.502 12.066 16.4162C12.1944 16.3303 12.3455 16.2845 12.5 16.2845C12.7072 16.2845 12.9059 16.3668 13.0524 16.5134C13.1989 16.6599 13.2812 16.8586 13.2812 17.0658ZM20.7031 11.9877V15.5033C20.7031 17.6789 19.8389 19.7654 18.3005 21.3038C16.7621 22.8422 14.6756 23.7064 12.5 23.7064C10.3244 23.7064 8.2379 22.8422 6.69951 21.3038C5.16113 19.7654 4.29688 17.6789 4.29688 15.5033V8.08141C4.29722 7.62912 4.42843 7.18659 4.67467 6.80721C4.92091 6.42782 5.27167 6.12779 5.68462 5.94331C6.09757 5.75882 6.55508 5.69776 7.00197 5.76749C7.44885 5.83722 7.86601 6.03476 8.20312 6.33629V4.95641C8.20392 4.35056 8.43928 3.76857 8.85985 3.33248C9.28041 2.8964 9.8535 2.64011 10.4589 2.61738C11.0643 2.59464 11.655 2.80722 12.1071 3.21053C12.5592 3.61384 12.8376 4.17655 12.8838 4.78062C13.2203 4.47729 13.6374 4.27798 14.0848 4.20678C14.5322 4.13559 14.9906 4.19558 15.4046 4.37949C15.8186 4.5634 16.1705 4.86335 16.4175 5.24304C16.6646 5.62273 16.7964 6.06589 16.7969 6.51891V10.2425C17.134 9.94101 17.5512 9.74347 17.998 9.67374C18.4449 9.60401 18.9024 9.66507 19.3154 9.84955C19.7283 10.034 20.0791 10.3341 20.3253 10.7135C20.5716 11.0928 20.7028 11.5354 20.7031 11.9877ZM19.9219 11.9877C19.9219 11.5733 19.7573 11.1758 19.4642 10.8828C19.1712 10.5898 18.7738 10.4252 18.3594 10.4252C17.945 10.4252 17.5475 10.5898 17.2545 10.8828C16.9615 11.1758 16.7969 11.5733 16.7969 11.9877V12.3783C16.7969 12.4819 16.7557 12.5812 16.6825 12.6545C16.6092 12.7278 16.5099 12.7689 16.4062 12.7689C16.3026 12.7689 16.2033 12.7278 16.13 12.6545C16.0568 12.5812 16.0156 12.4819 16.0156 12.3783V6.51891C16.0156 6.1045 15.851 5.70708 15.558 5.41405C15.265 5.12103 14.8675 4.95641 14.4531 4.95641C14.0387 4.95641 13.6413 5.12103 13.3483 5.41405C13.0552 5.70708 12.8906 6.1045 12.8906 6.51891V10.8158C12.8906 10.9194 12.8495 11.0187 12.7762 11.092C12.703 11.1653 12.6036 11.2064 12.5 11.2064C12.3964 11.2064 12.297 11.1653 12.2238 11.092C12.1505 11.0187 12.1094 10.9194 12.1094 10.8158V4.95641C12.1094 4.542 11.9448 4.14458 11.6517 3.85155C11.3587 3.55853 10.9613 3.39391 10.5469 3.39391C10.1325 3.39391 9.73505 3.55853 9.44202 3.85155C9.149 4.14458 8.98438 4.542 8.98438 4.95641V11.597C8.98438 11.7006 8.94322 11.8 8.86996 11.8732C8.79671 11.9465 8.69735 11.9877 8.59375 11.9877C8.49015 11.9877 8.39079 11.9465 8.31754 11.8732C8.24428 11.8 8.20312 11.7006 8.20312 11.597V8.08141C8.20312 7.66701 8.0385 7.26958 7.74548 6.97655C7.45245 6.68353 7.05503 6.51891 6.64062 6.51891C6.22622 6.51891 5.8288 6.68353 5.53577 6.97655C5.24274 7.26958 5.07812 7.66701 5.07812 8.08141V15.5033C5.07812 17.4717 5.86007 19.3595 7.25194 20.7513C8.64381 22.1432 10.5316 22.9252 12.5 22.9252C14.4684 22.9252 16.3562 22.1432 17.7481 20.7513C19.1399 19.3595 19.9219 17.4717 19.9219 15.5033V11.9877ZM17.5371 16.891C17.5643 16.9452 17.5784 17.0051 17.5784 17.0658C17.5784 17.1265 17.5643 17.1863 17.5371 17.2406C17.4688 17.3773 15.8281 20.5814 12.5 20.5814C9.17188 20.5814 7.53125 17.3773 7.46289 17.2406C7.43573 17.1863 7.4216 17.1265 7.4216 17.0658C7.4216 17.0051 7.43573 16.9452 7.46289 16.891C7.53125 16.7543 9.17188 13.5502 12.5 13.5502C15.8281 13.5502 17.4688 16.7543 17.5371 16.891ZM16.7402 17.0668C16.3662 16.4388 14.9287 14.3324 12.5 14.3324C10.0713 14.3324 8.63281 16.4369 8.25977 17.0668C8.63477 17.6957 10.0713 19.8011 12.5 19.8011C14.9287 19.8011 16.3672 17.6957 16.7402 17.0658V17.0668Z"
                    fill="#1C1C1C"
                  />
                </svg>
                <p className="logo-text">boondoggle ai</p>
              </div>
              <div className="lower-footer-logos">
                <svg
                  onClick={() => {
                    window.open("https://twitter.com/boondoggleai", "blank");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M37.9247 12.0635L33.3696 16.6186C32.4494 27.2857 23.4535 35.5763 12.6874 35.5763C10.4754 35.5763 8.65182 35.2259 7.26702 34.5342C6.15034 33.9751 5.69331 33.3764 5.57905 33.2058C5.47717 33.053 5.41113 32.8792 5.38588 32.6973C5.36062 32.5154 5.3768 32.3301 5.4332 32.1553C5.4896 31.9806 5.58476 31.8208 5.71158 31.688C5.8384 31.5552 5.9936 31.4527 6.16557 31.3883C6.20518 31.3731 9.85839 29.97 12.1786 27.2994C10.8919 26.2415 9.76862 24.9992 8.8453 23.6127C6.95624 20.808 4.8417 15.9361 5.49374 8.65559C5.5144 8.42425 5.60075 8.20363 5.74259 8.01971C5.88444 7.8358 6.07589 7.69625 6.29439 7.61749C6.51289 7.53873 6.74935 7.52405 6.97591 7.57518C7.20248 7.6263 7.40972 7.7411 7.57323 7.90606C7.62655 7.95938 12.6432 12.9486 18.7766 14.5665V13.6388C18.7743 12.6659 18.9666 11.7024 19.3423 10.805C19.718 9.90755 20.2695 9.09439 20.9642 8.41336C21.639 7.73958 22.4418 7.20778 23.3254 6.84931C24.209 6.49085 25.1554 6.313 26.1089 6.32625C27.3879 6.33887 28.6419 6.68221 29.7489 7.32289C30.856 7.96358 31.7784 8.87981 32.4266 9.9825H37.0624C37.3036 9.98231 37.5394 10.0537 37.74 10.1876C37.9406 10.3215 38.097 10.5119 38.1893 10.7347C38.2816 10.9575 38.3058 11.2027 38.2586 11.4393C38.2115 11.6758 38.0953 11.8931 37.9247 12.0635Z"
                    fill="#1C1C1C"
                  />
                </svg>
                <svg
                  onClick={() => {
                    window.open(
                      "https://www.linkedin.com/company/boondoggleai/",
                      "blank"
                    );
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M33.4062 3.88867H6.59375C5.94728 3.88867 5.3273 4.14548 4.87018 4.6026C4.41306 5.05972 4.15625 5.67971 4.15625 6.32617V33.1387C4.15625 33.7851 4.41306 34.4051 4.87018 34.8622C5.3273 35.3194 5.94728 35.5762 6.59375 35.5762H33.4062C34.0527 35.5762 34.6727 35.3194 35.1298 34.8622C35.5869 34.4051 35.8438 33.7851 35.8438 33.1387V6.32617C35.8438 5.67971 35.5869 5.05972 35.1298 4.6026C34.6727 4.14548 34.0527 3.88867 33.4062 3.88867ZM15.125 27.0449C15.125 27.3682 14.9966 27.6782 14.768 27.9067C14.5395 28.1353 14.2295 28.2637 13.9062 28.2637C13.583 28.2637 13.273 28.1353 13.0445 27.9067C12.8159 27.6782 12.6875 27.3682 12.6875 27.0449V17.2949C12.6875 16.9717 12.8159 16.6617 13.0445 16.4331C13.273 16.2046 13.583 16.0762 13.9062 16.0762C14.2295 16.0762 14.5395 16.2046 14.768 16.4331C14.9966 16.6617 15.125 16.9717 15.125 17.2949V27.0449ZM13.9062 14.8574C13.5447 14.8574 13.1912 14.7502 12.8906 14.5493C12.59 14.3485 12.3556 14.0629 12.2173 13.7289C12.0789 13.3948 12.0427 13.0273 12.1133 12.6726C12.1838 12.318 12.3579 11.9923 12.6136 11.7366C12.8692 11.4809 13.195 11.3068 13.5496 11.2363C13.9042 11.1658 14.2718 11.202 14.6058 11.3403C14.9399 11.4787 15.2254 11.713 15.4263 12.0136C15.6272 12.3143 15.7344 12.6677 15.7344 13.0293C15.7344 13.5141 15.5418 13.9791 15.1989 14.322C14.8561 14.6648 14.3911 14.8574 13.9062 14.8574ZM28.5312 27.0449C28.5312 27.3682 28.4028 27.6782 28.1743 27.9067C27.9457 28.1353 27.6357 28.2637 27.3125 28.2637C26.9893 28.2637 26.6793 28.1353 26.4507 27.9067C26.2222 27.6782 26.0938 27.3682 26.0938 27.0449V21.5605C26.0938 20.7525 25.7727 19.9775 25.2013 19.4061C24.6299 18.8347 23.855 18.5137 23.0469 18.5137C22.2388 18.5137 21.4638 18.8347 20.8924 19.4061C20.321 19.9775 20 20.7525 20 21.5605V27.0449C20 27.3682 19.8716 27.6782 19.643 27.9067C19.4145 28.1353 19.1045 28.2637 18.7812 28.2637C18.458 28.2637 18.148 28.1353 17.9195 27.9067C17.6909 27.6782 17.5625 27.3682 17.5625 27.0449V17.2949C17.564 16.9964 17.675 16.7088 17.8745 16.4867C18.074 16.2646 18.3481 16.1235 18.6447 16.09C18.9414 16.0566 19.24 16.1332 19.4839 16.3053C19.7278 16.4774 19.9001 16.7331 19.968 17.0238C20.7925 16.4645 21.7537 16.1403 22.7485 16.0861C23.7433 16.0319 24.7341 16.2497 25.6144 16.7161C26.4948 17.1825 27.2314 17.8799 27.7453 18.7334C28.2592 19.5869 28.5309 20.5643 28.5312 21.5605V27.0449Z"
                    fill="#1C1C1C"
                  />
                </svg>
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M38.2061 26.7997L33.7104 9.0684C33.5921 8.60679 33.3417 8.18971 32.99 7.86825C32.6382 7.54679 32.2003 7.33491 31.7299 7.25855L26.2364 6.35668C25.6308 6.25927 25.0106 6.3906 24.4965 6.7251C23.9823 7.05961 23.611 7.57339 23.4546 8.16652L23.4226 8.29602C23.4019 8.37829 23.3986 8.46397 23.4129 8.5476C23.4272 8.63122 23.4589 8.71093 23.5058 8.78163C23.5527 8.85233 23.6138 8.91246 23.6853 8.95816C23.7567 9.00387 23.837 9.03415 23.9208 9.04707C25.1814 9.23207 26.425 9.51839 27.6395 9.90324C27.9432 9.99486 28.2006 10.1985 28.3596 10.473C28.5186 10.7474 28.5672 11.072 28.4957 11.381C28.4546 11.542 28.381 11.6929 28.2794 11.8244C28.1778 11.9559 28.0504 12.0653 27.905 12.1458C27.7596 12.2262 27.5993 12.2761 27.4339 12.2924C27.2685 12.3086 27.1016 12.2909 26.9433 12.2402C22.4367 10.8581 17.6201 10.8528 13.1105 12.225C12.8053 12.3276 12.4723 12.3087 12.1807 12.1722C11.8891 12.0358 11.6612 11.7922 11.5444 11.4922C11.4889 11.3382 11.465 11.1746 11.4741 11.0112C11.4831 10.8478 11.525 10.6879 11.5973 10.541C11.6695 10.3942 11.7706 10.2634 11.8944 10.1564C12.0183 10.0494 12.1625 9.96852 12.3183 9.91848C13.548 9.52678 14.8075 9.23536 16.0842 9.04707C16.1681 9.03415 16.2483 9.00387 16.3198 8.95816C16.3913 8.91246 16.4524 8.85233 16.4993 8.78163C16.5462 8.71093 16.5778 8.63122 16.5921 8.5476C16.6064 8.46397 16.6031 8.37829 16.5824 8.29602L16.5504 8.16652C16.394 7.57289 16.0222 7.05878 15.5073 6.72445C14.9924 6.39013 14.3715 6.25956 13.7656 6.3582L8.26901 7.26008C7.79884 7.33632 7.36109 7.54798 7.00934 7.86915C6.65759 8.19032 6.40711 8.60707 6.28854 9.0684L1.79288 26.7997C1.65192 27.357 1.71327 27.9463 1.96601 28.4627C2.21875 28.979 2.64649 29.389 3.17311 29.6196L13.3801 34.1457C13.6871 34.2821 14.0186 34.3544 14.3545 34.358C14.6903 34.3616 15.0234 34.2965 15.3331 34.1666C15.6429 34.0368 15.9229 33.845 16.1558 33.603C16.3887 33.361 16.5696 33.0739 16.6875 32.7594L17.2192 31.3197C17.2509 31.2335 17.2627 31.1412 17.2537 31.0498C17.2446 30.9584 17.2151 30.8702 17.1672 30.7918C17.1193 30.7134 17.0542 30.6469 16.977 30.5971C16.8997 30.5474 16.8122 30.5158 16.721 30.5047C15.2411 30.3255 13.781 30.0093 12.3594 29.5602C12.0571 29.4683 11.8007 29.2652 11.6422 28.9918C11.4836 28.7184 11.4345 28.3951 11.5048 28.087C11.5455 27.9255 11.619 27.7741 11.7205 27.6421C11.822 27.5102 11.9495 27.4004 12.0951 27.3196C12.2408 27.2388 12.4014 27.1887 12.5671 27.1724C12.7328 27.156 12.9001 27.1739 13.0587 27.2247C17.5822 28.61 22.4168 28.61 26.9403 27.2247C27.0986 27.1741 27.2657 27.1564 27.4312 27.1727C27.5966 27.1891 27.757 27.2391 27.9024 27.3197C28.0478 27.4003 28.1752 27.5099 28.2767 27.6416C28.3782 27.7732 28.4517 27.9243 28.4926 28.0855C28.5638 28.3938 28.5151 28.7177 28.3564 28.9915C28.1977 29.2653 27.9409 29.4686 27.638 29.5602C26.217 30.0094 24.7574 30.3256 23.2779 30.5047C23.1867 30.5158 23.0992 30.5474 23.022 30.5971C22.9447 30.6469 22.8797 30.7134 22.8318 30.7918C22.7839 30.8702 22.7543 30.9584 22.7453 31.0498C22.7363 31.1412 22.7481 31.2335 22.7798 31.3197L23.3114 32.7594C23.4295 33.0737 23.6106 33.3607 23.8435 33.6025C24.0765 33.8444 24.3564 34.0362 24.6661 34.166C24.9758 34.2958 25.3088 34.361 25.6445 34.3575C25.9803 34.354 26.3119 34.2819 26.6188 34.1457L36.8258 29.6196C37.3525 29.389 37.7802 28.979 38.033 28.4627C38.2857 27.9463 38.347 27.357 38.2061 26.7997ZM14.5151 23.3887C14.1535 23.3887 13.8001 23.2815 13.4995 23.0806C13.1988 22.8797 12.9645 22.5942 12.8261 22.2602C12.6878 21.9261 12.6516 21.5586 12.7221 21.2039C12.7926 20.8493 12.9668 20.5236 13.2224 20.2679C13.4781 20.0122 13.8038 19.8381 14.1585 19.7676C14.5131 19.697 14.8807 19.7333 15.2147 19.8716C15.5487 20.01 15.8343 20.2443 16.0351 20.5449C16.236 20.8456 16.3432 21.199 16.3432 21.5606C16.3432 22.0454 16.1506 22.5104 15.8078 22.8533C15.4649 23.1961 15 23.3887 14.5151 23.3887ZM25.4839 23.3887C25.1223 23.3887 24.7688 23.2815 24.4682 23.0806C24.1676 22.8797 23.9333 22.5942 23.7949 22.2602C23.6565 21.9261 23.6203 21.5586 23.6909 21.2039C23.7614 20.8493 23.9355 20.5236 24.1912 20.2679C24.4468 20.0122 24.7726 19.8381 25.1272 19.7676C25.4818 19.697 25.8494 19.7333 26.1834 19.8716C26.5175 20.01 26.803 20.2443 27.0039 20.5449C27.2048 20.8456 27.312 21.199 27.312 21.5606C27.312 22.0454 27.1194 22.5104 26.7765 22.8533C26.4337 23.1961 25.9687 23.3887 25.4839 23.3887Z"
                fill="#1C1C1C"
              />
            </svg> */}
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M36.1987 10.8234C36.0552 10.2617 35.7801 9.7423 35.3963 9.3079C35.0125 8.87349 34.5309 8.53657 33.9912 8.32493C28.7689 6.3079 20.457 6.32618 20 6.32618C19.543 6.32618 11.2311 6.3079 6.00875 8.32493C5.46909 8.53657 4.98749 8.87349 4.60368 9.3079C4.21986 9.7423 3.94484 10.2617 3.80129 10.8234C3.40672 12.3438 2.9375 15.1225 2.9375 19.7324C2.9375 24.3424 3.40672 27.1211 3.80129 28.6415C3.94462 29.2034 4.21955 29.7231 4.60338 30.1578C4.9872 30.5925 5.46892 30.9297 6.00875 31.1414C11.0117 33.0716 18.8422 33.1387 19.8995 33.1387H20.1005C21.1578 33.1387 28.9929 33.0716 33.9912 31.1414C34.5311 30.9297 35.0128 30.5925 35.3966 30.1578C35.7804 29.7231 36.0554 29.2034 36.1987 28.6415C36.5933 27.1181 37.0625 24.3424 37.0625 19.7324C37.0625 15.1225 36.5933 12.3438 36.1987 10.8234ZM25.2132 20.2397L17.9007 25.1147C17.8089 25.176 17.7022 25.2111 17.592 25.2165C17.4818 25.2218 17.3722 25.1971 17.2749 25.1451C17.1776 25.093 17.0963 25.0154 17.0396 24.9208C16.9829 24.8261 16.9531 24.7178 16.9531 24.6074V14.8574C16.9531 14.7471 16.9829 14.6388 17.0396 14.5441C17.0963 14.4494 17.1776 14.3719 17.2749 14.3198C17.3722 14.2677 17.4818 14.243 17.592 14.2484C17.7022 14.2537 17.8089 14.2889 17.9007 14.3501L25.2132 19.2251C25.2968 19.2807 25.3653 19.3562 25.4127 19.4447C25.4602 19.5332 25.485 19.632 25.485 19.7324C25.485 19.8328 25.4602 19.9317 25.4127 20.0202C25.3653 20.1087 25.2968 20.1841 25.2132 20.2397Z"
                fill="#1C1C1C"
              />
            </svg> */}
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="landing-container">
          <Header isMobile={true} />
          <div className="landing-text-container" style={{ width: "100vw" }}>
            <span className="landing-text-big" style={{ fontSize: "30px" }}>
              Automations that simplify your work
            </span>
            <p className="landing-text-medium" style={{ fontSize: "20px" }}>
              Boondoggle <span style={{ fontWeight: "700" }}>summarizes</span>{" "}
              your social media messages, emails, <br /> and meeting notes,{" "}
              <span style={{ fontWeight: "700" }}>enriches</span> your contacts,
              then <span style={{ fontWeight: "700" }}>updates</span> your CRM
              daily.
            </p>
            <div className="landing-button-container">
              <button
                className="get-started-button"
                onClick={() => {
                  // navigation("/signup");
                  window.open(
                    "https://ipk90u6jozo.typeform.com/to/dJcgJZAu",
                    "_blank"
                  );
                }}
              >
                <p className="landing-button-text" style={{ fontSize: "14px" }}>
                  Get Started
                </p>
              </button>
              <button
                className="demo-button"
                onClick={() => {
                  window.open(
                    "https://calendly.com/blakefaulkner/meeting",
                    "_blank"
                  );
                }}
              >
                <p
                  className="landing-button-text"
                  style={{ fontSize: "14px", color: "black" }}
                >
                  Book a demo
                </p>
              </button>
            </div>
            <img
              src={require("../../assets/landing/1.png")}
              className="landing-1-img"
              style={{ width: "100%" }}
            ></img>
            <span
              className="landing-text-big"
              style={{ marginTop: "50px", fontSize: "25px" }}
            >
              Get back 10 hours every week
            </span>
            <p className="landing-text-medium" style={{ fontSize: "20px" }}>
              Boondoggle’s AI tooling allows you to automate your CRM entries
              and data collection.
            </p>
            <img
              src={require("../../assets/landing/2.png")}
              className="landing-2-img"
              style={{ width: "100vw" }}
            ></img>
            <span
              className="landing-text-big"
              style={{ marginTop: "50px", fontSize: "25px" }}
              id="integrations"
            >
              Boondoggle integrates with your everyday tools
            </span>
            <p className="landing-text-medium" style={{ fontSize: "20px" }}>
              Boondoggle connects with{" "}
              <span style={{ fontWeight: "700" }}>50+ common workplace</span>{" "}
              tool integrations, powering our{" "}
              <span style={{ fontWeight: "700" }}>automations</span>.
            </p>
            <div className="integration-categories-container">
              <button
                onClick={() => {
                  selectCategory("crm");
                }}
                className={
                  category == "crm"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "crm" ? { color: "#fff" } : {}}
                >
                  CRM
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("enrichment");
                }}
                className={
                  category == "enrichment"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "enrichment" ? { color: "#fff" } : {}}
                >
                  Enrichment
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("social");
                }}
                className={
                  category == "social"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "social" ? { color: "#fff" } : {}}
                >
                  Social Media
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("email");
                }}
                className={
                  category == "email"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "email" ? { color: "#fff" } : {}}
                >
                  Email
                </p>
              </button>
              <button
                onClick={() => {
                  selectCategory("meeting");
                }}
                className={
                  category == "meeting"
                    ? "integration-category-button-selected"
                    : "integration-category-button"
                }
              >
                <p
                  className="integration-category-button-text"
                  style={category == "meeting" ? { color: "#fff" } : {}}
                >
                  Meeting Notes
                </p>
              </button>
            </div>
            <div
              className="integration-table-container"
              style={{ width: "100vw" }}
            >
              {category == "crm" && (
                <>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="30"
                      viewBox="0 0 49 35"
                      fill="none"
                    >
                      <path
                        d="M20.2286 4.6349C21.7927 3.00511 23.9704 1.99435 26.3788 1.99435C29.5803 1.99435 32.3735 3.77959 33.861 6.4298C35.1536 5.85223 36.5844 5.53096 38.0899 5.53096C43.8642 5.53096 48.5456 10.2531 48.5456 16.0779C48.5456 21.9034 43.8642 26.6256 38.0899 26.6256C37.3852 26.6256 36.6964 26.5551 36.0303 26.4204C34.7204 28.7569 32.2243 30.3356 29.3592 30.3356C28.1598 30.3356 27.0254 30.0586 26.0154 29.566C24.6875 32.6894 21.5937 34.8795 17.988 34.8795C14.2331 34.8795 11.033 32.5036 9.80457 29.1715C9.26776 29.2855 8.7116 29.3449 8.14093 29.3449C3.67025 29.3449 0.0458984 25.6832 0.0458984 21.1656C0.0458984 18.1381 1.6743 15.4948 4.09376 14.0806C3.59564 12.9344 3.31859 11.6694 3.31859 10.3395C3.31859 5.14407 7.53641 0.932472 12.7387 0.932472C15.7931 0.932472 18.5076 2.3847 20.2286 4.6349Z"
                        fill="#00A1E0"
                      />
                      <path
                        d="M7.07053 18.5366C7.04013 18.616 7.08159 18.6326 7.09126 18.6464C7.18245 18.7127 7.27503 18.7604 7.3683 18.8136C7.86297 19.0761 8.33 19.1528 8.81846 19.1528C9.81332 19.1528 10.431 18.6236 10.431 17.7718V17.7552C10.431 16.9676 9.73387 16.6816 9.07961 16.475L8.99463 16.4473C8.50134 16.2871 8.07576 16.1489 8.07576 15.8242V15.8069C8.07576 15.5292 8.32448 15.3247 8.70999 15.3247C9.13833 15.3247 9.64682 15.467 9.9743 15.648C9.9743 15.648 10.0703 15.7102 10.1056 15.6169C10.1249 15.5672 10.2907 15.1209 10.308 15.0725C10.3266 15.02 10.2935 14.9813 10.2596 14.9606C9.88586 14.7333 9.36909 14.5778 8.83435 14.5778L8.73486 14.5785C7.82428 14.5785 7.18867 15.1285 7.18867 15.9168V15.9333C7.18867 16.7645 7.88991 17.0339 8.54694 17.2218L8.65264 17.2543C9.13142 17.4015 9.54388 17.5279 9.54388 17.865V17.8816C9.54388 18.1897 9.27582 18.4191 8.84333 18.4191C8.67544 18.4191 8.14001 18.4157 7.56175 18.0502C7.49197 18.0094 7.45121 17.9797 7.39732 17.9472C7.36899 17.9293 7.29783 17.8982 7.26674 17.9922L7.07053 18.5366Z"
                        fill="white"
                      />
                      <path
                        d="M21.635 18.5366C21.6046 18.616 21.646 18.6326 21.6557 18.6464C21.7469 18.7127 21.8395 18.7604 21.9328 18.8136C22.4274 19.0761 22.8945 19.1528 23.3829 19.1528C24.3778 19.1528 24.9954 18.6236 24.9954 17.7718V17.7552C24.9954 16.9676 24.2983 16.6816 23.6441 16.475L23.5591 16.4473C23.0658 16.2871 22.6402 16.1489 22.6402 15.8242V15.8069C22.6402 15.5292 22.8889 15.3247 23.2744 15.3247C23.7028 15.3247 24.2113 15.467 24.5387 15.648C24.5387 15.648 24.6348 15.7102 24.67 15.6169C24.6894 15.5672 24.8552 15.1209 24.8724 15.0725C24.8911 15.02 24.8579 14.9813 24.8241 14.9606C24.4503 14.7333 23.9335 14.5778 23.3988 14.5778L23.2993 14.5785C22.3887 14.5785 21.7531 15.1285 21.7531 15.9168V15.9333C21.7531 16.7645 22.4544 17.0339 23.1114 17.2218L23.2171 17.2543C23.6959 17.4015 24.109 17.5279 24.109 17.865V17.8816C24.109 18.1897 23.8403 18.4191 23.4078 18.4191C23.2399 18.4191 22.7045 18.4157 22.1262 18.0502C22.0564 18.0094 22.015 17.9811 21.9625 17.9472C21.9445 17.9355 21.8602 17.903 21.8312 17.9922L21.635 18.5366Z"
                        fill="white"
                      />
                      <path
                        d="M31.5771 16.8681C31.5771 17.3497 31.4872 17.729 31.3104 17.997C31.1356 18.2623 30.871 18.3915 30.5021 18.3915C30.1324 18.3915 29.8692 18.263 29.6972 17.997C29.5231 17.7296 29.4346 17.3497 29.4346 16.8681C29.4346 16.3873 29.5231 16.0087 29.6972 15.7434C29.8692 15.4808 30.1324 15.353 30.5021 15.353C30.871 15.353 31.1356 15.4808 31.3111 15.7434C31.4872 16.0087 31.5771 16.3873 31.5771 16.8681ZM32.4075 15.9755C32.326 15.6998 32.1989 15.4566 32.0296 15.2542C31.8603 15.0511 31.6461 14.8881 31.3919 14.7692C31.1384 14.6511 30.8385 14.591 30.5021 14.591C30.1649 14.591 29.8651 14.6511 29.6115 14.7692C29.3573 14.8881 29.1431 15.0511 28.9731 15.2542C28.8046 15.4573 28.6774 15.7005 28.5952 15.9755C28.5144 16.2498 28.4736 16.5496 28.4736 16.8681C28.4736 17.1866 28.5144 17.4871 28.5952 17.7607C28.6774 18.0357 28.8039 18.2789 28.9738 18.482C29.1431 18.6851 29.358 18.8475 29.6115 18.9629C29.8658 19.0782 30.1649 19.137 30.5021 19.137C30.8385 19.137 31.1377 19.0782 31.3919 18.9629C31.6455 18.8475 31.8603 18.6851 32.0296 18.482C32.1989 18.2796 32.326 18.0364 32.4075 17.7607C32.489 17.4865 32.5298 17.1859 32.5298 16.8681C32.5298 16.5503 32.489 16.2498 32.4075 15.9755Z"
                        fill="white"
                      />
                      <path
                        d="M39.2284 18.2626C39.2007 18.1818 39.1226 18.2122 39.1226 18.2122C39.0017 18.2585 38.8732 18.3013 38.7364 18.3227C38.5976 18.3442 38.4449 18.3552 38.2812 18.3552C37.8791 18.3552 37.5599 18.2357 37.3312 17.9994C37.1018 17.7631 36.9733 17.3811 36.9747 16.8643C36.9761 16.3938 37.0894 16.0401 37.2932 15.7706C37.4956 15.5026 37.8038 15.3651 38.2148 15.3651C38.5575 15.3651 38.8187 15.4045 39.0923 15.4908C39.0923 15.4908 39.1579 15.5192 39.189 15.4335C39.2615 15.2317 39.3154 15.0874 39.3928 14.8656C39.4149 14.8027 39.361 14.7758 39.3417 14.7682C39.2339 14.726 38.9796 14.6576 38.7876 14.6286C38.6079 14.601 38.3979 14.5865 38.1644 14.5865C37.8155 14.5865 37.5046 14.6459 37.2386 14.7647C36.9733 14.8828 36.7481 15.0459 36.5699 15.249C36.3916 15.4521 36.2562 15.6953 36.1657 15.9703C36.0759 16.2446 36.0303 16.5458 36.0303 16.8643C36.0303 17.5531 36.2161 18.1099 36.583 18.5176C36.9505 18.9266 37.5025 19.1345 38.2224 19.1345C38.648 19.1345 39.0847 19.0482 39.3983 18.9245C39.3983 18.9245 39.4584 18.8955 39.4322 18.8257L39.2284 18.2626Z"
                        fill="white"
                      />
                      <path
                        d="M40.6807 16.4066C40.7201 16.1393 40.794 15.9168 40.908 15.7434C41.08 15.4802 41.3425 15.3358 41.7115 15.3358C42.0804 15.3358 42.3243 15.4809 42.4991 15.7434C42.6151 15.9168 42.6656 16.1489 42.6856 16.4066H40.6807ZM43.4767 15.8187C43.4062 15.5527 43.2314 15.284 43.1167 15.161C42.9357 14.9662 42.7588 14.8301 42.5834 14.7541C42.354 14.656 42.079 14.591 41.7778 14.591C41.4268 14.591 41.1083 14.6497 40.8499 14.7713C40.5909 14.8929 40.3732 15.0587 40.2026 15.2653C40.0319 15.4712 39.9034 15.7165 39.8219 15.9949C39.7397 16.2719 39.6982 16.5738 39.6982 16.8923C39.6982 17.2164 39.7411 17.5183 39.8261 17.7898C39.9117 18.0634 40.0485 18.3045 40.2337 18.5042C40.4181 18.7052 40.6558 18.8627 40.9404 18.9726C41.223 19.0817 41.5664 19.1384 41.9609 19.1377C42.7727 19.1349 43.2003 18.9539 43.3765 18.8565C43.4076 18.8392 43.4373 18.8088 43.4 18.7218L43.2162 18.2071C43.1886 18.1304 43.1105 18.1587 43.1105 18.1587C42.9094 18.2333 42.6234 18.3674 41.9567 18.366C41.5208 18.3653 41.1975 18.2368 40.995 18.0357C40.7871 17.8299 40.6855 17.5272 40.6675 17.1003L43.4787 17.103C43.4787 17.103 43.5527 17.1017 43.5603 17.0298C43.563 16.9994 43.657 16.4522 43.4767 15.8187Z"
                        fill="white"
                      />
                      <path
                        d="M18.167 16.4066C18.2071 16.1393 18.2803 15.9168 18.3943 15.7434C18.5663 15.4802 18.8289 15.3358 19.1978 15.3358C19.5667 15.3358 19.8106 15.4809 19.9861 15.7434C20.1015 15.9168 20.1519 16.1489 20.1719 16.4066H18.167ZM20.9623 15.8187C20.8918 15.5527 20.7177 15.284 20.603 15.161C20.422 14.9662 20.2452 14.8301 20.0697 14.7541C19.8403 14.656 19.5653 14.591 19.2641 14.591C18.9138 14.591 18.5947 14.6497 18.3363 14.7713C18.0772 14.8929 17.8596 15.0587 17.6889 15.2653C17.5183 15.4712 17.3898 15.7165 17.3082 15.9949C17.2267 16.2719 17.1846 16.5738 17.1846 16.8923C17.1846 17.2164 17.2274 17.5183 17.3124 17.7898C17.3981 18.0634 17.5348 18.3045 17.72 18.5042C17.9045 18.7052 18.1421 18.8627 18.4268 18.9726C18.7093 19.0817 19.0527 19.1384 19.4472 19.1377C20.259 19.1349 20.6866 18.9539 20.8628 18.8565C20.8939 18.8392 20.9236 18.8088 20.8863 18.7218L20.7032 18.2071C20.6749 18.1304 20.5968 18.1587 20.5968 18.1587C20.3958 18.2333 20.1104 18.3674 19.4424 18.366C19.0071 18.3653 18.6838 18.2368 18.4814 18.0357C18.2734 17.8299 18.1718 17.5272 18.1539 17.1003L20.9651 17.103C20.9651 17.103 21.039 17.1017 21.0466 17.0298C21.0493 16.9994 21.1433 16.4522 20.9623 15.8187Z"
                        fill="white"
                      />
                      <path
                        d="M12.0898 18.2471C11.98 18.1594 11.9648 18.1373 11.9275 18.0806C11.8722 17.9942 11.8439 17.8713 11.8439 17.7151C11.8439 17.4678 11.9254 17.2902 12.0947 17.1707C12.0926 17.1714 12.3365 16.96 12.9099 16.9676C13.3127 16.9731 13.6726 17.0325 13.6726 17.0325V18.3107H13.6733C13.6733 18.3107 13.3161 18.3874 12.9141 18.4115C12.342 18.4461 12.0878 18.2464 12.0898 18.2471ZM13.2084 16.2719C13.0944 16.2636 12.9465 16.2588 12.7697 16.2588C12.5285 16.2588 12.2957 16.2892 12.0774 16.3479C11.8577 16.4066 11.6601 16.4985 11.4902 16.6201C11.3195 16.7424 11.182 16.8985 11.0825 17.0837C10.9831 17.2688 10.9326 17.4871 10.9326 17.7317C10.9326 17.9804 10.9755 18.1967 11.0611 18.3735C11.1468 18.5511 11.2705 18.6989 11.428 18.8129C11.5841 18.9269 11.7769 19.0105 12.0007 19.061C12.2211 19.1114 12.4712 19.137 12.7448 19.137C13.0329 19.137 13.3203 19.1135 13.5987 19.0658C13.8744 19.0188 14.2129 18.9504 14.3069 18.929C14.4001 18.9069 14.5038 18.8786 14.5038 18.8786C14.5736 18.8613 14.568 18.7867 14.568 18.7867L14.5666 16.2159C14.5666 15.6522 14.416 15.2342 14.1196 14.9751C13.8246 14.7167 13.3901 14.5861 12.8284 14.5861C12.6177 14.5861 12.2784 14.6152 12.0753 14.6559C12.0753 14.6559 11.4611 14.7747 11.2083 14.9723C11.2083 14.9723 11.153 15.0069 11.1834 15.0843L11.3824 15.619C11.4073 15.6881 11.4743 15.6646 11.4743 15.6646C11.4743 15.6646 11.4957 15.6563 11.5206 15.6418C12.0615 15.3475 12.7455 15.3565 12.7455 15.3565C13.0495 15.3565 13.283 15.4173 13.4405 15.5382C13.5939 15.6556 13.672 15.8332 13.672 16.2076V16.3265C13.4301 16.2919 13.2084 16.2719 13.2084 16.2719Z"
                        fill="white"
                      />
                      <path
                        d="M35.8827 14.8239C35.9042 14.7604 35.8593 14.73 35.8406 14.7231C35.7929 14.7044 35.5539 14.654 35.3694 14.6422C35.0164 14.6208 34.8202 14.6802 34.6447 14.759C34.4706 14.8378 34.2771 14.9649 34.1694 15.1093V14.7673C34.1694 14.7196 34.1355 14.6816 34.0885 14.6816H33.3679C33.321 14.6816 33.2871 14.7196 33.2871 14.7673V18.9602C33.2871 19.0072 33.3258 19.0459 33.3728 19.0459H34.1113C34.1583 19.0459 34.1963 19.0072 34.1963 18.9602V16.8655C34.1963 16.5843 34.2274 16.3038 34.2896 16.1276C34.3504 15.9535 34.4333 15.814 34.5355 15.7138C34.6385 15.6143 34.7552 15.5445 34.883 15.5051C35.0136 15.4651 35.158 15.4519 35.2603 15.4519C35.4074 15.4519 35.5691 15.4899 35.5691 15.4899C35.623 15.4962 35.6534 15.463 35.6713 15.4139C35.7197 15.2854 35.8565 14.9006 35.8827 14.8239Z"
                        fill="white"
                      />
                      <path
                        d="M28.9504 12.8803C28.8606 12.8527 28.7791 12.834 28.6727 12.814C28.5649 12.7946 28.4364 12.785 28.2906 12.785C27.7822 12.785 27.3814 12.9287 27.1003 13.2119C26.8204 13.4938 26.6305 13.9228 26.5351 14.4873L26.5006 14.6773H25.8622C25.8622 14.6773 25.7848 14.6745 25.7682 14.7588L25.6639 15.344C25.6563 15.3992 25.6805 15.4345 25.7551 15.4345H26.3762L25.7461 18.9524C25.6971 19.2357 25.6404 19.4685 25.5776 19.6454C25.5161 19.8195 25.456 19.9501 25.3813 20.0454C25.3095 20.1366 25.2418 20.2043 25.1243 20.2437C25.0276 20.2762 24.9157 20.2914 24.7934 20.2914C24.7257 20.2914 24.6352 20.2803 24.5682 20.2665C24.5019 20.2534 24.4666 20.2388 24.4162 20.2174C24.4162 20.2174 24.3436 20.1898 24.3146 20.2623C24.2918 20.3224 24.126 20.7777 24.106 20.8337C24.0866 20.8897 24.1143 20.9332 24.1495 20.9463C24.2324 20.9753 24.2939 20.9947 24.4065 21.0216C24.5627 21.0582 24.6946 21.0603 24.8183 21.0603C25.0767 21.0603 25.3129 21.0237 25.5085 20.9532C25.7047 20.8821 25.876 20.7584 26.028 20.5912C26.1917 20.4102 26.2947 20.2209 26.3928 19.9618C26.4902 19.7062 26.5738 19.3884 26.6401 19.0181L27.2737 15.4345H28.1994C28.1994 15.4345 28.2775 15.4372 28.2934 15.3523L28.3984 14.7678C28.4053 14.7118 28.3818 14.6773 28.3065 14.6773H27.4077C27.4125 14.6572 27.4533 14.3408 27.5562 14.043C27.6004 13.9166 27.6834 13.8137 27.7531 13.7432C27.8222 13.6741 27.9017 13.6251 27.9887 13.5967C28.0778 13.5677 28.1794 13.5539 28.2906 13.5539C28.3749 13.5539 28.4585 13.5636 28.5214 13.5767C28.6084 13.5954 28.6423 13.605 28.6651 13.6119C28.757 13.6396 28.7694 13.6126 28.7874 13.5684L29.0022 12.9784C29.0244 12.9148 28.9698 12.8879 28.9504 12.8803Z"
                        fill="white"
                      />
                      <path
                        d="M16.3908 18.9602C16.3908 19.0072 16.357 19.0452 16.31 19.0452H15.5645C15.5175 19.0452 15.4844 19.0072 15.4844 18.9602V12.9606C15.4844 12.9136 15.5175 12.8756 15.5645 12.8756H16.31C16.357 12.8756 16.3908 12.9136 16.3908 12.9606V18.9602Z"
                        fill="white"
                      />
                    </svg>
                    <p className="integration-table-cell-label">Salesforce</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 33 35"
                      fill="none"
                    >
                      <path
                        d="M25.33 12.1601V8.14209C25.8615 7.89326 26.3116 7.49882 26.6279 7.00453C26.9443 6.51025 27.114 5.93638 27.1174 5.34953V5.25494C27.1151 4.43473 26.7884 3.64874 26.2086 3.06863C25.6287 2.48852 24.8429 2.16145 24.0227 2.15884H23.9281C23.1079 2.16107 22.3219 2.48779 21.7418 3.06764C21.1617 3.64748 20.8346 4.43332 20.832 5.25353V5.34812C20.8346 5.93172 21.0018 6.50273 21.3145 6.99549C21.6272 7.48826 22.0727 7.88276 22.5996 8.13362L22.6179 8.14209V12.1686C21.0817 12.4033 19.6352 13.0415 18.4263 14.0181L18.4432 14.0053L7.39155 5.39895C7.60175 4.61057 7.53198 3.7737 7.19413 3.03102C6.85628 2.28834 6.27128 1.68584 5.53887 1.32627C4.80647 0.966689 3.97201 0.872294 3.17779 1.05918C2.38357 1.24606 1.67876 1.70265 1.18355 2.3511C0.688334 2.99954 0.433379 3.79968 0.462156 4.61509C0.490932 5.43049 0.801659 6.21067 1.34135 6.82259C1.88105 7.43451 2.61629 7.84028 3.42171 7.97071C4.22713 8.10114 5.05285 7.94815 5.75809 7.53784L5.74115 7.54631L16.6064 16.0045C15.6458 17.4447 15.1357 19.1383 15.141 20.8696C15.141 22.7656 15.741 24.5233 16.7603 25.9606L16.742 25.9337L13.4355 29.2402C13.1708 29.1548 12.8948 29.1095 12.6167 29.1061H12.6138C12.0462 29.1061 11.4912 29.2744 11.0192 29.5898C10.5472 29.9052 10.1794 30.3534 9.96211 30.8779C9.74487 31.4024 9.68803 31.9795 9.79878 32.5362C9.90953 33.093 10.1829 33.6044 10.5843 34.0058C10.9857 34.4072 11.4971 34.6806 12.0539 34.7914C12.6107 34.9021 13.1878 34.8453 13.7122 34.628C14.2367 34.4108 14.685 34.0429 15.0003 33.5709C15.3157 33.0989 15.4841 32.544 15.4841 31.9763C15.4807 31.6908 15.4335 31.4075 15.3443 31.1363L15.3499 31.156L18.6211 27.8849C19.6872 28.6989 20.925 29.2591 22.2402 29.5227C23.5554 29.7863 24.9134 29.7465 26.2109 29.4062C27.5084 29.0659 28.7111 28.4342 29.7277 27.559C30.7442 26.6839 31.5478 25.5884 32.0772 24.3559C32.6066 23.1234 32.8479 21.7864 32.7827 20.4466C32.7175 19.1069 32.3476 17.7996 31.7011 16.6243C31.0546 15.449 30.1486 14.4367 29.0519 13.6643C27.9552 12.892 26.6968 12.3799 25.3724 12.1672L25.3216 12.1601H25.33ZM23.969 25.3987C23.0743 25.3964 22.2003 25.1291 21.4575 24.6304C20.7146 24.1317 20.1362 23.424 19.7954 22.5967C19.4545 21.7695 19.3665 20.8597 19.5424 19.9825C19.7183 19.1052 20.1503 18.2998 20.7838 17.6679C21.4172 17.036 22.2237 16.606 23.1014 16.4323C23.9791 16.2586 24.8886 16.3489 25.7151 16.6918C26.5415 17.0347 27.2477 17.6148 27.7446 18.3589C28.2414 19.103 28.5066 19.9777 28.5066 20.8724V20.8752C28.5066 22.0757 28.0297 23.2269 27.1809 24.0758C26.332 24.9246 25.1808 25.4015 23.9803 25.4015L23.969 25.3987Z"
                        fill="#FF9D2A"
                      />
                    </svg>
                    <p className="integration-table-cell-label">HubSpot</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/airtable.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Airtable</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/sheets.png")}
                    ></img>
                    <p className="integration-table-cell-label">
                      Google Sheets
                    </p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/aff.png")}
                    ></img>
                    <p className="integration-table-cell-label">Affinity</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/fresh.png")}
                    ></img>
                    <p className="integration-table-cell-label">Freshsales</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/attio.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Attio</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/bullrun.png")}
                    ></img>
                    <p className="integration-table-cell-label">Bullrun</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/close.png")}
                    ></img>
                    <p className="integration-table-cell-label">Close.io</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/copper.png")}
                    ></img>
                    <p className="integration-table-cell-label">Copper</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/suite.png")}
                    ></img>
                    <p className="integration-table-cell-label">NetSuite</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/outreach.png")}
                    ></img>
                    <p className="integration-table-cell-label">Outreach</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/pipedrive.png")}
                    ></img>
                    <p className="integration-table-cell-label">Pipedrive</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/recruit.png")}
                    ></img>
                    <p className="integration-table-cell-label">RecruitCRM</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/high.png")}
                    ></img>
                    <p className="integration-table-cell-label">HighLevel</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/zen.png")}
                    ></img>
                    <p className="integration-table-cell-label">ZendeskSell</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/zoho.png")}
                    ></img>
                    <p className="integration-table-cell-label">ZohoCRM</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/salesloft.png")}
                    ></img>
                    <p className="integration-table-cell-label">Salesloft</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/salesflare.png")}
                    ></img>
                    <p className="integration-table-cell-label">Salesflare</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/crm/notion.png")}
                    ></img>
                    <p className="integration-table-cell-label">Notion</p>
                  </div>
                </>
              )}
              {category == "enrichment" && (
                <>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/apollo.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Apollo.io</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/clearbit.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Clearbit</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/contactout.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ContactOut</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/crunchbase.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Crunchbase</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/crystal.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">CrystalKnows</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/datagma.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Datagma</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/drop.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">DropContact</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/exact.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ExactBuyer</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/fullcontact.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">FullContact</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/prospect.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Get Prospect</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/humantic.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Humantic.ai</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/hunter.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Hunter.io</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/leadsift.png")}
                      className="integration-table-img"
                      style={{ width: "50px" }}
                    ></img>
                    <p className="integration-table-cell-label">LeadSift</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/lusha.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Lusha</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/mattermark.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Mattermark</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/peopledata.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">
                      PeopleDataLabs
                    </p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/slintel.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Slintel</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/x.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Twitter</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/pipi.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Pipl</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/pitchbook.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Pitchbook</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/up.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">UpLead</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/zoominfo.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">ZoomInfo</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/recept.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Receptiviti</p>
                  </div>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/enrichments/rocket.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">RocketReach</p>
                  </div>
                </>
              )}
              {category == "social" && (
                <>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/social/linkedin.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">LinkedIn</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/social/x.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Twitter</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/social/instagram.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Instagram</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/social/telegram.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Telegram</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/social/discord.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Discord</p>
                  </div>
                </>
              )}
              {category == "email" && (
                <>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="16"
                      viewBox="0 0 21 16"
                      fill="none"
                    >
                      <path
                        d="M1.99054 15.5156H5.1723V7.78855L0.626953 4.37952L0.626953 14.152C0.626953 14.9065 1.2383 15.5156 1.99054 15.5156Z"
                        fill="#4285F4"
                      />
                      <path
                        d="M16.0811 15.5156H19.2628C20.0173 15.5156 20.6264 14.9043 20.6264 14.152V4.37952L16.0811 7.78855"
                        fill="#34A853"
                      />
                      <path
                        d="M16.0811 1.87969V7.78863L20.6264 4.37963V2.56148C20.6264 0.875141 18.7014 -0.0861629 17.3538 0.92514"
                        fill="#FBBC04"
                      />
                      <path
                        d="M5.17188 7.78845V1.87952L10.6263 5.97034L16.0807 1.87952V7.78845L10.6263 11.8793"
                        fill="#EA4335"
                      />
                      <path
                        d="M0.626953 2.56148V4.37963L5.1723 7.78863V1.87969L3.8996 0.92514C2.54964 -0.0861629 0.626953 0.875141 0.626953 2.56148Z"
                        fill="#C5221F"
                      />
                    </svg>
                    <p className="integration-table-cell-label">Gmail</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/email/outlook.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Outlook</p>
                  </div>

                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/email/Google.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">
                      Google Workspace
                    </p>
                  </div>
                </>
              )}
              {category == "meeting" && (
                <>
                  <div
                    className="integration-table-cell"
                    style={{ width: "30vw", padding: "20px" }}
                  >
                    <img
                      src={require("../../assets/landing/integrations/meeting/otter.png")}
                      className="integration-table-img"
                    ></img>
                    <p className="integration-table-cell-label">Otter.ai</p>
                  </div>
                </>
              )}
            </div>
            <div
              className="features-container"
              style={{ flexDirection: "column", marginTop: "50px" }}
              id="features"
            >
              <span
                className="landing-text-big"
                style={{ fontSize: "30px", textAlign: "center" }}
              >
                Go inbox zero across email and socials
              </span>
              <p
                className="landing-text-medium"
                style={{ textAlign: "left", fontSize: "20px" }}
              >
                Reads your in/outbound emails and messages
              </p>
              <p
                className="landing-text-medium"
                style={{ textAlign: "left", fontSize: "20px" }}
              >
                Generates professional responses for pasting
              </p>
              <p
                className="landing-text-medium"
                style={{ textAlign: "left", fontSize: "20px" }}
              >
                Summarizes business-related daily conversations
              </p>

              <img
                src={require("../../assets/landing/8.png")}
                className="landing-3-img"
                style={{ width: "100vw" }}
              ></img>
            </div>

            <div
              className="features-container"
              style={{ flexDirection: "column", marginTop: "50px" }}
            >
              <div style={{ flexDirection: "column" }}>
                <p
                  className="landing-text-big"
                  style={{ fontSize: "30px", textAlign: "center" }}
                >
                  Enrich your cross-platform contacts
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Connect your lead enrichment integrations
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Enrich your contacts with cross-platform info
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Access new info on your existing leads
                </p>
              </div>
              <img
                src={require("../../assets/landing/4.png")}
                className="landing-3-img"
                style={{ width: "100vw" }}
              ></img>
            </div>

            <div
              className="features-container"
              style={{ flexDirection: "column", marginTop: "50px" }}
            >
              <div style={{ flexDirection: "column" }}>
                <p
                  className="landing-text-big"
                  style={{ fontSize: "30px", textAlign: "center" }}
                >
                  Passively update your CRM of choice
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Daily interactions entered as CRM updates
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Identifies existing contacts and new leads
                </p>
                <p
                  className="landing-text-medium"
                  style={{ textAlign: "left", fontSize: "20px" }}
                >
                  Entries match your CRM’s set formatting
                </p>
              </div>
              <img
                src={require("../../assets/landing/5.png")}
                className="landing-3-img"
                style={{ width: "100vw" }}
              ></img>
            </div>
            <p
              className="landing-text-big"
              id="pricing"
              style={{ fontSize: "30px" }}
            >
              Built for teams of any size
            </p>
            <div
              className="pricing-container"
              style={{ flexDirection: "column" }}
            >
              <div className="pricing-box-black" style={{ width: "80vw" }}>
                <span className="pricing-box-header-small">STARTER</span>
                <span className="pricing-box-subheader-small">
                  for individuals and startups
                </span>
                <div className="pricing-box-price-container">
                  <span className="pricing-box-price-small">$25</span>
                  <span className="pricing-box-price-subheader-small">
                    /user <br /> /month
                  </span>
                </div>
                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Single user access
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Automated lead enrichment
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      In/outbound insights
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Early feature access
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Single social integration per user
                    </span>
                  </div>
                </div>
                {/* <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Get Started</p>
            </button> */}
              </div>
              <div className="pricing-box-white" style={{ width: "80vw" }}>
                <span
                  className="pricing-box-header-small"
                  style={{ fontSize: "23.314px", color: "black" }}
                >
                  GROWTH
                </span>
                <span
                  className="pricing-box-subheader-small"
                  style={{ fontSize: "16.653px", color: "black" }}
                >
                  for growing teams
                </span>
                <div className="pricing-box-price-container">
                  <span
                    className="pricing-box-price-small"
                    style={{ fontSize: "53.29px", color: "black" }}
                  >
                    $30
                  </span>
                  <span
                    className="pricing-box-price-subheader-small"
                    style={{
                      color: "var(--black-40, rgba(28, 28, 28, 0.40))",
                      fontSize: "18.318px",
                    }}
                  >
                    /user <br /> /month
                  </span>
                </div>
                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Up to 10 user licenses
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Team management
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Centralized billing
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Meeting note platform integrations
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M15.8138 5.62875L7.09046 14.3521C7.03983 14.4027 6.97969 14.443 6.91351 14.4704C6.84732 14.4978 6.77638 14.512 6.70473 14.512C6.63308 14.512 6.56213 14.4978 6.49595 14.4704C6.42976 14.443 6.36963 14.4027 6.31899 14.3521L2.50255 10.5356C2.40025 10.4333 2.34277 10.2946 2.34277 10.1499C2.34277 10.0052 2.40025 9.86644 2.50255 9.76414C2.60485 9.66184 2.7436 9.60436 2.88828 9.60436C3.03296 9.60436 3.17171 9.66184 3.27402 9.76414L6.70473 13.1955L15.0423 4.85729C15.1446 4.75498 15.2833 4.69751 15.428 4.69751C15.5727 4.69751 15.7115 4.75498 15.8138 4.85729C15.9161 4.95959 15.9735 5.09834 15.9735 5.24302C15.9735 5.3877 15.9161 5.52645 15.8138 5.62875Z"
                        fill="#1C1C1C"
                      />
                    </svg>
                    <span
                      className="pricing-box-features-text-small"
                      style={{
                        color: "var(--black-100, #1C1C1C)",
                        fontSize: "16px",
                      }}
                    >
                      Multiple social integrations per user
                    </span>
                  </div>
                </div>
                {/* <button
              className="pricing-box-button-small"
              style={{ background: "var(--black-100, #1C1C1C)" }}
            >
              <p
                className="pricing-box-button-text-small"
                style={{
                  fontSize: "19.984px",
                  color: "var(--white-100, #FFF)",
                }}
              >
                Get Started
              </p>
            </button> */}
              </div>
              <div className="pricing-box-black" style={{ width: "80vw" }}>
                <span className="pricing-box-header-small">ENTERPRISES</span>
                <span className="pricing-box-subheader-small">
                  for larger teams
                </span>
                <span
                  className="pricing-box-price-small"
                  style={{ fontSize: "24px" }}
                >
                  Custom Pricing
                </span>

                <div className="pricing-box-features-container-small">
                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      10+ user licenses
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Custom compliance needs
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Custom integration requests
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Priority support and guidance
                    </span>
                  </div>

                  <div className="pricing-box-features-row">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="15"
                      viewBox="0 0 16 15"
                      fill="none"
                    >
                      <path
                        d="M13.8917 4.54259L6.65021 11.7841C6.60818 11.8262 6.55826 11.8596 6.50332 11.8824C6.44838 11.9051 6.38948 11.9169 6.33 11.9169C6.27053 11.9169 6.21163 11.9051 6.15669 11.8824C6.10174 11.8596 6.05183 11.8262 6.00979 11.7841L2.84162 8.61595C2.75669 8.53103 2.70898 8.41584 2.70898 8.29574C2.70898 8.17564 2.75669 8.06045 2.84162 7.97553C2.92655 7.8906 3.04173 7.84289 3.16183 7.84289C3.28193 7.84289 3.39712 7.8906 3.48204 7.97553L6.33 10.8241L13.2513 3.90217C13.3363 3.81724 13.4514 3.76953 13.5715 3.76953C13.6916 3.76953 13.8068 3.81724 13.8917 3.90217C13.9767 3.98709 14.0244 4.10228 14.0244 4.22238C14.0244 4.34248 13.9767 4.45767 13.8917 4.54259Z"
                        fill="white"
                      />
                    </svg>
                    <span className="pricing-box-features-text-small">
                      Annual & quarterly billing available
                    </span>
                  </div>
                </div>
                {/* <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Book a demo</p>
            </button> */}
              </div>
            </div>
            <div
              className="upper-footer-container"
              style={{ width: "100vw", justifyContent: "center" }}
            >
              {/* <span
                className="upper-footer-header"
                style={{ fontSize: "10px" }}
              >
                Automate your <br /> CRM Entry <br />
                with AI
              </span> */}
              <div className="upper-footer-pages">
                <div className="upper-footer-column">
                  <span className="upper-footer-column-header">Product</span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const integrations =
                        document.getElementById("integrations");
                      integrations.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Integrations
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const features = document.getElementById("features");
                      features.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Features
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      const pricing = document.getElementById("pricing");
                      pricing.scrollIntoView({ behavior: "smooth" });
                    }}
                  >
                    Pricing
                  </span>
                </div>
                <div className="upper-footer-column">
                  <span className="upper-footer-column-header">Legal</span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/privacy");
                    }}
                  >
                    Privacy Policy
                  </span>
                  <span className="upper-footer-column-text">
                    Terms of Service
                  </span>
                </div>
              </div>
            </div>
            <div className="lower-footer-container" style={{ width: "100vw" }}>
              <div className="logo-container">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="26"
                  viewBox="0 0 25 26"
                  fill="none"
                >
                  <path
                    d="M13.2812 17.0658C13.2812 17.2203 13.2354 17.3713 13.1496 17.4998C13.0637 17.6283 12.9417 17.7284 12.799 17.7876C12.6562 17.8467 12.4991 17.8622 12.3476 17.832C12.196 17.8019 12.0568 17.7275 11.9476 17.6182C11.8383 17.5089 11.7639 17.3697 11.7338 17.2182C11.7036 17.0666 11.7191 16.9096 11.7782 16.7668C11.8373 16.6241 11.9375 16.502 12.066 16.4162C12.1944 16.3303 12.3455 16.2845 12.5 16.2845C12.7072 16.2845 12.9059 16.3668 13.0524 16.5134C13.1989 16.6599 13.2812 16.8586 13.2812 17.0658ZM20.7031 11.9877V15.5033C20.7031 17.6789 19.8389 19.7654 18.3005 21.3038C16.7621 22.8422 14.6756 23.7064 12.5 23.7064C10.3244 23.7064 8.2379 22.8422 6.69951 21.3038C5.16113 19.7654 4.29688 17.6789 4.29688 15.5033V8.08141C4.29722 7.62912 4.42843 7.18659 4.67467 6.80721C4.92091 6.42782 5.27167 6.12779 5.68462 5.94331C6.09757 5.75882 6.55508 5.69776 7.00197 5.76749C7.44885 5.83722 7.86601 6.03476 8.20312 6.33629V4.95641C8.20392 4.35056 8.43928 3.76857 8.85985 3.33248C9.28041 2.8964 9.8535 2.64011 10.4589 2.61738C11.0643 2.59464 11.655 2.80722 12.1071 3.21053C12.5592 3.61384 12.8376 4.17655 12.8838 4.78062C13.2203 4.47729 13.6374 4.27798 14.0848 4.20678C14.5322 4.13559 14.9906 4.19558 15.4046 4.37949C15.8186 4.5634 16.1705 4.86335 16.4175 5.24304C16.6646 5.62273 16.7964 6.06589 16.7969 6.51891V10.2425C17.134 9.94101 17.5512 9.74347 17.998 9.67374C18.4449 9.60401 18.9024 9.66507 19.3154 9.84955C19.7283 10.034 20.0791 10.3341 20.3253 10.7135C20.5716 11.0928 20.7028 11.5354 20.7031 11.9877ZM19.9219 11.9877C19.9219 11.5733 19.7573 11.1758 19.4642 10.8828C19.1712 10.5898 18.7738 10.4252 18.3594 10.4252C17.945 10.4252 17.5475 10.5898 17.2545 10.8828C16.9615 11.1758 16.7969 11.5733 16.7969 11.9877V12.3783C16.7969 12.4819 16.7557 12.5812 16.6825 12.6545C16.6092 12.7278 16.5099 12.7689 16.4062 12.7689C16.3026 12.7689 16.2033 12.7278 16.13 12.6545C16.0568 12.5812 16.0156 12.4819 16.0156 12.3783V6.51891C16.0156 6.1045 15.851 5.70708 15.558 5.41405C15.265 5.12103 14.8675 4.95641 14.4531 4.95641C14.0387 4.95641 13.6413 5.12103 13.3483 5.41405C13.0552 5.70708 12.8906 6.1045 12.8906 6.51891V10.8158C12.8906 10.9194 12.8495 11.0187 12.7762 11.092C12.703 11.1653 12.6036 11.2064 12.5 11.2064C12.3964 11.2064 12.297 11.1653 12.2238 11.092C12.1505 11.0187 12.1094 10.9194 12.1094 10.8158V4.95641C12.1094 4.542 11.9448 4.14458 11.6517 3.85155C11.3587 3.55853 10.9613 3.39391 10.5469 3.39391C10.1325 3.39391 9.73505 3.55853 9.44202 3.85155C9.149 4.14458 8.98438 4.542 8.98438 4.95641V11.597C8.98438 11.7006 8.94322 11.8 8.86996 11.8732C8.79671 11.9465 8.69735 11.9877 8.59375 11.9877C8.49015 11.9877 8.39079 11.9465 8.31754 11.8732C8.24428 11.8 8.20312 11.7006 8.20312 11.597V8.08141C8.20312 7.66701 8.0385 7.26958 7.74548 6.97655C7.45245 6.68353 7.05503 6.51891 6.64062 6.51891C6.22622 6.51891 5.8288 6.68353 5.53577 6.97655C5.24274 7.26958 5.07812 7.66701 5.07812 8.08141V15.5033C5.07812 17.4717 5.86007 19.3595 7.25194 20.7513C8.64381 22.1432 10.5316 22.9252 12.5 22.9252C14.4684 22.9252 16.3562 22.1432 17.7481 20.7513C19.1399 19.3595 19.9219 17.4717 19.9219 15.5033V11.9877ZM17.5371 16.891C17.5643 16.9452 17.5784 17.0051 17.5784 17.0658C17.5784 17.1265 17.5643 17.1863 17.5371 17.2406C17.4688 17.3773 15.8281 20.5814 12.5 20.5814C9.17188 20.5814 7.53125 17.3773 7.46289 17.2406C7.43573 17.1863 7.4216 17.1265 7.4216 17.0658C7.4216 17.0051 7.43573 16.9452 7.46289 16.891C7.53125 16.7543 9.17188 13.5502 12.5 13.5502C15.8281 13.5502 17.4688 16.7543 17.5371 16.891ZM16.7402 17.0668C16.3662 16.4388 14.9287 14.3324 12.5 14.3324C10.0713 14.3324 8.63281 16.4369 8.25977 17.0668C8.63477 17.6957 10.0713 19.8011 12.5 19.8011C14.9287 19.8011 16.3672 17.6957 16.7402 17.0658V17.0668Z"
                    fill="#1C1C1C"
                  />
                </svg>
                <p className="logo-text">boondoggle ai</p>
              </div>
              <div className="lower-footer-logos" style={{ gap: "5px" }}>
                <svg
                  onClick={() => {
                    window.open("https://twitter.com/boondoggleai", "blank");
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M37.9247 12.0635L33.3696 16.6186C32.4494 27.2857 23.4535 35.5763 12.6874 35.5763C10.4754 35.5763 8.65182 35.2259 7.26702 34.5342C6.15034 33.9751 5.69331 33.3764 5.57905 33.2058C5.47717 33.053 5.41113 32.8792 5.38588 32.6973C5.36062 32.5154 5.3768 32.3301 5.4332 32.1553C5.4896 31.9806 5.58476 31.8208 5.71158 31.688C5.8384 31.5552 5.9936 31.4527 6.16557 31.3883C6.20518 31.3731 9.85839 29.97 12.1786 27.2994C10.8919 26.2415 9.76862 24.9992 8.8453 23.6127C6.95624 20.808 4.8417 15.9361 5.49374 8.65559C5.5144 8.42425 5.60075 8.20363 5.74259 8.01971C5.88444 7.8358 6.07589 7.69625 6.29439 7.61749C6.51289 7.53873 6.74935 7.52405 6.97591 7.57518C7.20248 7.6263 7.40972 7.7411 7.57323 7.90606C7.62655 7.95938 12.6432 12.9486 18.7766 14.5665V13.6388C18.7743 12.6659 18.9666 11.7024 19.3423 10.805C19.718 9.90755 20.2695 9.09439 20.9642 8.41336C21.639 7.73958 22.4418 7.20778 23.3254 6.84931C24.209 6.49085 25.1554 6.313 26.1089 6.32625C27.3879 6.33887 28.6419 6.68221 29.7489 7.32289C30.856 7.96358 31.7784 8.87981 32.4266 9.9825H37.0624C37.3036 9.98231 37.5394 10.0537 37.74 10.1876C37.9406 10.3215 38.097 10.5119 38.1893 10.7347C38.2816 10.9575 38.3058 11.2027 38.2586 11.4393C38.2115 11.6758 38.0953 11.8931 37.9247 12.0635Z"
                    fill="#1C1C1C"
                  />
                </svg>
                <svg
                  onClick={() => {
                    window.open(
                      "https://www.linkedin.com/company/boondoggleai/",
                      "blank"
                    );
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                >
                  <path
                    d="M33.4062 3.88867H6.59375C5.94728 3.88867 5.3273 4.14548 4.87018 4.6026C4.41306 5.05972 4.15625 5.67971 4.15625 6.32617V33.1387C4.15625 33.7851 4.41306 34.4051 4.87018 34.8622C5.3273 35.3194 5.94728 35.5762 6.59375 35.5762H33.4062C34.0527 35.5762 34.6727 35.3194 35.1298 34.8622C35.5869 34.4051 35.8438 33.7851 35.8438 33.1387V6.32617C35.8438 5.67971 35.5869 5.05972 35.1298 4.6026C34.6727 4.14548 34.0527 3.88867 33.4062 3.88867ZM15.125 27.0449C15.125 27.3682 14.9966 27.6782 14.768 27.9067C14.5395 28.1353 14.2295 28.2637 13.9062 28.2637C13.583 28.2637 13.273 28.1353 13.0445 27.9067C12.8159 27.6782 12.6875 27.3682 12.6875 27.0449V17.2949C12.6875 16.9717 12.8159 16.6617 13.0445 16.4331C13.273 16.2046 13.583 16.0762 13.9062 16.0762C14.2295 16.0762 14.5395 16.2046 14.768 16.4331C14.9966 16.6617 15.125 16.9717 15.125 17.2949V27.0449ZM13.9062 14.8574C13.5447 14.8574 13.1912 14.7502 12.8906 14.5493C12.59 14.3485 12.3556 14.0629 12.2173 13.7289C12.0789 13.3948 12.0427 13.0273 12.1133 12.6726C12.1838 12.318 12.3579 11.9923 12.6136 11.7366C12.8692 11.4809 13.195 11.3068 13.5496 11.2363C13.9042 11.1658 14.2718 11.202 14.6058 11.3403C14.9399 11.4787 15.2254 11.713 15.4263 12.0136C15.6272 12.3143 15.7344 12.6677 15.7344 13.0293C15.7344 13.5141 15.5418 13.9791 15.1989 14.322C14.8561 14.6648 14.3911 14.8574 13.9062 14.8574ZM28.5312 27.0449C28.5312 27.3682 28.4028 27.6782 28.1743 27.9067C27.9457 28.1353 27.6357 28.2637 27.3125 28.2637C26.9893 28.2637 26.6793 28.1353 26.4507 27.9067C26.2222 27.6782 26.0938 27.3682 26.0938 27.0449V21.5605C26.0938 20.7525 25.7727 19.9775 25.2013 19.4061C24.6299 18.8347 23.855 18.5137 23.0469 18.5137C22.2388 18.5137 21.4638 18.8347 20.8924 19.4061C20.321 19.9775 20 20.7525 20 21.5605V27.0449C20 27.3682 19.8716 27.6782 19.643 27.9067C19.4145 28.1353 19.1045 28.2637 18.7812 28.2637C18.458 28.2637 18.148 28.1353 17.9195 27.9067C17.6909 27.6782 17.5625 27.3682 17.5625 27.0449V17.2949C17.564 16.9964 17.675 16.7088 17.8745 16.4867C18.074 16.2646 18.3481 16.1235 18.6447 16.09C18.9414 16.0566 19.24 16.1332 19.4839 16.3053C19.7278 16.4774 19.9001 16.7331 19.968 17.0238C20.7925 16.4645 21.7537 16.1403 22.7485 16.0861C23.7433 16.0319 24.7341 16.2497 25.6144 16.7161C26.4948 17.1825 27.2314 17.8799 27.7453 18.7334C28.2592 19.5869 28.5309 20.5643 28.5312 21.5605V27.0449Z"
                    fill="#1C1C1C"
                  />
                </svg>
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M38.2061 26.7997L33.7104 9.0684C33.5921 8.60679 33.3417 8.18971 32.99 7.86825C32.6382 7.54679 32.2003 7.33491 31.7299 7.25855L26.2364 6.35668C25.6308 6.25927 25.0106 6.3906 24.4965 6.7251C23.9823 7.05961 23.611 7.57339 23.4546 8.16652L23.4226 8.29602C23.4019 8.37829 23.3986 8.46397 23.4129 8.5476C23.4272 8.63122 23.4589 8.71093 23.5058 8.78163C23.5527 8.85233 23.6138 8.91246 23.6853 8.95816C23.7567 9.00387 23.837 9.03415 23.9208 9.04707C25.1814 9.23207 26.425 9.51839 27.6395 9.90324C27.9432 9.99486 28.2006 10.1985 28.3596 10.473C28.5186 10.7474 28.5672 11.072 28.4957 11.381C28.4546 11.542 28.381 11.6929 28.2794 11.8244C28.1778 11.9559 28.0504 12.0653 27.905 12.1458C27.7596 12.2262 27.5993 12.2761 27.4339 12.2924C27.2685 12.3086 27.1016 12.2909 26.9433 12.2402C22.4367 10.8581 17.6201 10.8528 13.1105 12.225C12.8053 12.3276 12.4723 12.3087 12.1807 12.1722C11.8891 12.0358 11.6612 11.7922 11.5444 11.4922C11.4889 11.3382 11.465 11.1746 11.4741 11.0112C11.4831 10.8478 11.525 10.6879 11.5973 10.541C11.6695 10.3942 11.7706 10.2634 11.8944 10.1564C12.0183 10.0494 12.1625 9.96852 12.3183 9.91848C13.548 9.52678 14.8075 9.23536 16.0842 9.04707C16.1681 9.03415 16.2483 9.00387 16.3198 8.95816C16.3913 8.91246 16.4524 8.85233 16.4993 8.78163C16.5462 8.71093 16.5778 8.63122 16.5921 8.5476C16.6064 8.46397 16.6031 8.37829 16.5824 8.29602L16.5504 8.16652C16.394 7.57289 16.0222 7.05878 15.5073 6.72445C14.9924 6.39013 14.3715 6.25956 13.7656 6.3582L8.26901 7.26008C7.79884 7.33632 7.36109 7.54798 7.00934 7.86915C6.65759 8.19032 6.40711 8.60707 6.28854 9.0684L1.79288 26.7997C1.65192 27.357 1.71327 27.9463 1.96601 28.4627C2.21875 28.979 2.64649 29.389 3.17311 29.6196L13.3801 34.1457C13.6871 34.2821 14.0186 34.3544 14.3545 34.358C14.6903 34.3616 15.0234 34.2965 15.3331 34.1666C15.6429 34.0368 15.9229 33.845 16.1558 33.603C16.3887 33.361 16.5696 33.0739 16.6875 32.7594L17.2192 31.3197C17.2509 31.2335 17.2627 31.1412 17.2537 31.0498C17.2446 30.9584 17.2151 30.8702 17.1672 30.7918C17.1193 30.7134 17.0542 30.6469 16.977 30.5971C16.8997 30.5474 16.8122 30.5158 16.721 30.5047C15.2411 30.3255 13.781 30.0093 12.3594 29.5602C12.0571 29.4683 11.8007 29.2652 11.6422 28.9918C11.4836 28.7184 11.4345 28.3951 11.5048 28.087C11.5455 27.9255 11.619 27.7741 11.7205 27.6421C11.822 27.5102 11.9495 27.4004 12.0951 27.3196C12.2408 27.2388 12.4014 27.1887 12.5671 27.1724C12.7328 27.156 12.9001 27.1739 13.0587 27.2247C17.5822 28.61 22.4168 28.61 26.9403 27.2247C27.0986 27.1741 27.2657 27.1564 27.4312 27.1727C27.5966 27.1891 27.757 27.2391 27.9024 27.3197C28.0478 27.4003 28.1752 27.5099 28.2767 27.6416C28.3782 27.7732 28.4517 27.9243 28.4926 28.0855C28.5638 28.3938 28.5151 28.7177 28.3564 28.9915C28.1977 29.2653 27.9409 29.4686 27.638 29.5602C26.217 30.0094 24.7574 30.3256 23.2779 30.5047C23.1867 30.5158 23.0992 30.5474 23.022 30.5971C22.9447 30.6469 22.8797 30.7134 22.8318 30.7918C22.7839 30.8702 22.7543 30.9584 22.7453 31.0498C22.7363 31.1412 22.7481 31.2335 22.7798 31.3197L23.3114 32.7594C23.4295 33.0737 23.6106 33.3607 23.8435 33.6025C24.0765 33.8444 24.3564 34.0362 24.6661 34.166C24.9758 34.2958 25.3088 34.361 25.6445 34.3575C25.9803 34.354 26.3119 34.2819 26.6188 34.1457L36.8258 29.6196C37.3525 29.389 37.7802 28.979 38.033 28.4627C38.2857 27.9463 38.347 27.357 38.2061 26.7997ZM14.5151 23.3887C14.1535 23.3887 13.8001 23.2815 13.4995 23.0806C13.1988 22.8797 12.9645 22.5942 12.8261 22.2602C12.6878 21.9261 12.6516 21.5586 12.7221 21.2039C12.7926 20.8493 12.9668 20.5236 13.2224 20.2679C13.4781 20.0122 13.8038 19.8381 14.1585 19.7676C14.5131 19.697 14.8807 19.7333 15.2147 19.8716C15.5487 20.01 15.8343 20.2443 16.0351 20.5449C16.236 20.8456 16.3432 21.199 16.3432 21.5606C16.3432 22.0454 16.1506 22.5104 15.8078 22.8533C15.4649 23.1961 15 23.3887 14.5151 23.3887ZM25.4839 23.3887C25.1223 23.3887 24.7688 23.2815 24.4682 23.0806C24.1676 22.8797 23.9333 22.5942 23.7949 22.2602C23.6565 21.9261 23.6203 21.5586 23.6909 21.2039C23.7614 20.8493 23.9355 20.5236 24.1912 20.2679C24.4468 20.0122 24.7726 19.8381 25.1272 19.7676C25.4818 19.697 25.8494 19.7333 26.1834 19.8716C26.5175 20.01 26.803 20.2443 27.0039 20.5449C27.2048 20.8456 27.312 21.199 27.312 21.5606C27.312 22.0454 27.1194 22.5104 26.7765 22.8533C26.4337 23.1961 25.9687 23.3887 25.4839 23.3887Z"
                fill="#1C1C1C"
              />
            </svg> */}
                {/* <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M36.1987 10.8234C36.0552 10.2617 35.7801 9.7423 35.3963 9.3079C35.0125 8.87349 34.5309 8.53657 33.9912 8.32493C28.7689 6.3079 20.457 6.32618 20 6.32618C19.543 6.32618 11.2311 6.3079 6.00875 8.32493C5.46909 8.53657 4.98749 8.87349 4.60368 9.3079C4.21986 9.7423 3.94484 10.2617 3.80129 10.8234C3.40672 12.3438 2.9375 15.1225 2.9375 19.7324C2.9375 24.3424 3.40672 27.1211 3.80129 28.6415C3.94462 29.2034 4.21955 29.7231 4.60338 30.1578C4.9872 30.5925 5.46892 30.9297 6.00875 31.1414C11.0117 33.0716 18.8422 33.1387 19.8995 33.1387H20.1005C21.1578 33.1387 28.9929 33.0716 33.9912 31.1414C34.5311 30.9297 35.0128 30.5925 35.3966 30.1578C35.7804 29.7231 36.0554 29.2034 36.1987 28.6415C36.5933 27.1181 37.0625 24.3424 37.0625 19.7324C37.0625 15.1225 36.5933 12.3438 36.1987 10.8234ZM25.2132 20.2397L17.9007 25.1147C17.8089 25.176 17.7022 25.2111 17.592 25.2165C17.4818 25.2218 17.3722 25.1971 17.2749 25.1451C17.1776 25.093 17.0963 25.0154 17.0396 24.9208C16.9829 24.8261 16.9531 24.7178 16.9531 24.6074V14.8574C16.9531 14.7471 16.9829 14.6388 17.0396 14.5441C17.0963 14.4494 17.1776 14.3719 17.2749 14.3198C17.3722 14.2677 17.4818 14.243 17.592 14.2484C17.7022 14.2537 17.8089 14.2889 17.9007 14.3501L25.2132 19.2251C25.2968 19.2807 25.3653 19.3562 25.4127 19.4447C25.4602 19.5332 25.485 19.632 25.485 19.7324C25.485 19.8328 25.4602 19.9317 25.4127 20.0202C25.3653 20.1087 25.2968 20.1841 25.2132 20.2397Z"
                fill="#1C1C1C"
              />
            </svg> */}
              </div>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  );
}

export default Landing;
