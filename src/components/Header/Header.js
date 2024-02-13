import React, { useEffect, useState } from "react";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";

function Header(props) {
  const navigation = useNavigate();
  return (
    <div
      className="header-container"
      style={props.isMobile ? { justifyContent: "center" } : {}}
    >
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
      {/* <div className="pages-container">
        <p className="page-text">Privacy</p>
        <p className="page-text">Integrations</p>
        <p className="page-text">Pricing</p>
      </div> */}
      <div className="action-container">
        <button
          className="sign-up-header-container"
          onClick={() => {
            navigation("/signup");
          }}
        >
          <p className="action-text">Sign Up</p>
        </button>
        <button
          className="sign-in-header-container"
          onClick={() => {
            navigation("/login");
          }}
        >
          <p className="action-text" style={{ color: "#fff" }}>
            Sign In
          </p>
        </button>
      </div>
    </div>
  );
}

export default Header;
