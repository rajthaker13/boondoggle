import React, { useEffect, useState } from "react";
import "./Landing.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header/Header";

function Landing(props) {
  const [category, selectCategory] = useState("crm");
  return (
    <div className="landing-container">
      <Header />
      <div className="landing-text-container">
        <span className="landing-text-big" style={{ fontSize: "60px" }}>
          Automations that simplify your work
        </span>
        <p className="landing-text-medium">
          Boondoggle summarizes your business-related social media messages,
          emails, <br /> meeting notes, enriches your contacts, and updates your
          CRM daily.
        </p>
        <div className="landing-button-container">
          <button className="get-started-button">
            <p className="landing-button-text">Get Started</p>
          </button>
          <button className="demo-button">
            <p className="landing-button-text" style={{ color: "black" }}>
              Book a demo
            </p>
          </button>
        </div>
        <img
          src={require("../../assets/landing/1.png")}
          className="landing-1-img"
        ></img>
        <span className="landing-text-big" style={{ marginTop: "125px" }}>
          Get back 10 hours every week
        </span>
        <p className="landing-text-medium">
          Boondoggle’s AI tooling allows you to automate your CRM entries and
          data collection.
        </p>
        <img
          src={require("../../assets/landing/2.png")}
          className="landing-2-img"
        ></img>
        <span className="landing-text-big" style={{ marginTop: "125px" }}>
          Boondoggle integrates with your everyday tools
        </span>
        <p className="landing-text-medium">
          Boondoggle connects with 50+ common workplace tool integrations,
          powering our automations.
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
                <p className="integration-table-cell-label">Google Sheets</p>
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
                <p className="integration-table-cell-label">PeopleDataLabs</p>
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
        </div>
        <div className="features-container">
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
          <img
            src={require("../../assets/landing/8.png")}
            className="landing-3-img"
          ></img>
        </div>

        <div className="features-container">
          <img
            src={require("../../assets/landing/4.png")}
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
            src={require("../../assets/landing/5.png")}
            className="landing-3-img"
            style={{ marginLeft: "3vw" }}
          ></img>
        </div>
        <p className="landing-text-big">Built for teams of any size</p>
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
            <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Get Started</p>
            </button>
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
            <button
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
            </button>
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
            <button className="pricing-box-button-small">
              <p className="pricing-box-button-text-small">Book a demo</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
