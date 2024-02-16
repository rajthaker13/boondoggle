import React, { useEffect, useState, useRef } from "react";
import "./Privacy.css";
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";
import axios from "axios";
import Header from "../../components/Header/Header";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile,
} from "react-device-detect";

function Privacy(props) {
  const navigation = useNavigate();

  useEffect(() => {
    const information = document.getElementById("information");
    information.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <>
      <BrowserView>
        <div className="landing-container" id="information">
          <Header isMobile={false} />
          <div className="landing-text-container">
            <span className="landing-text-big" style={{ fontSize: "60px" }}>
              Privacy Policy
            </span>
            <p className="privacy-text">
              Privacy Policy
              <br />
              Last Updated: February 12, 2024
              <br />
              <br />
              <br />
              Welcome to Boondoggle AI, a service provided by Crewmate
              Technologies Inc. ("Boondoggle", “Boondoggle AI”, "we", "us", or
              "our").
              <br />
              <br />
              <br />
              This Privacy Policy explains how we collect, disclose and
              otherwise process Personal Data (defined below) when you use our
              website (the "Site"), mobile application (the "App"), and all
              related services provided by Boondoggle AI (collectively, the
              "Service"), and your choices concerning our data practices.
              <br />
              <br />
              <br />
              "You" or "your", as used in this Privacy Policy, refers to the
              individual to whom Personal Data relates.
              <br />
              <br />
              <br />
              This Privacy Policy is incorporated into and forms part of our
              Terms of Service. Please read this Privacy Policy before using our
              Service or submitting any Personal Data to Boondoggle AI and
              contact us if you have any questions.
              <br />
              <br />
              <br />
              1. INFORMATION WE COLLECT
              <br />
              <br />
              <br />
              When you contact us or interact with our Service we collect
              information that alone or in combination with other information
              could be used to identify you ("Personal Data") as follows:
              <br />
              <br />
              <br />
              Personal Data You Provide:
              <br />
              <br />
              <br />
              We may collect your name, email address, phone number, and payment
              information when you register for our Service, sign up for our
              mailing list, or otherwise communicate with us. We may also
              collect any communications between you and Boondoggle AI and any
              other information you provide to the Boondoggle AI.
              <br />
              <br />
              <br />
              We also have pages on social media sites like Facebook and Twitter
              ("Social Media Pages"). When you interact with our Social Media
              Pages, we may collect Personal Data that you elect to provide to
              us through your settings on the Social Media Site, such as your
              contact details. In addition, the companies that host our Social
              Media Pages may provide us with aggregate information and
              analytics regarding the use of our Social Media Pages.
              <br />
              <br />
              <br />
              Personal Data Collected Automatically:
              <br />
              <br />
              <br />
              Boondoggle AI Content. We collect information from Boondoggle AI
              product features, including the content of drafts or snippets you
              create in the Service and read receipts.
              <br />
              <br />
              <br />
              Authentication Tokens. When you sign in to the Service, we collect
              and store encrypted Google or Microsoft authentication tokens.
              <br />
              <br />
              <br />
              Use of the Site and App: When you visit, use and interact with the
              Site or App, we may receive certain information about your visit,
              use or interactions. For example, we may monitor the number of
              people that visit our Site or App, peak hours of visits, which
              page(s) are visited on our Site, the domains our visitors come
              from (e.g., google.com, yahoo.com, etc.), and which browsers
              people use to access and visit our Site (e.g., Firefox, Microsoft
              Internet Explorer, etc.), broad geographical information, and
              Site-navigation pattern. In particular, the following information
              is created and automatically logged in our systems:
              <br />
              <br />
              <br />
              • Log data: Information that your browser automatically sends
              whenever you visit the Site ("log data"). Log data includes your
              Internet Protocol ("IP") address (so we understand which country
              you are connecting from when you visit the Site), browser type and
              settings, the date and time of your request, and how you
              interacted with the Site.
              <br />
              <br />
              <br />
              • Cookies: Please see the "Cookies" section below to learn more
              about how we use cookies on the Site.
              <br />
              <br />
              <br />
              • Device information: Includes the operating system and browser
              you are using. Information collected may depend on the type of
              device you use and its settings.
              <br />
              <br />
              <br />
              • Usage Information: We collect information about how you use our
              Site and App, such as the types of content that you view or engage
              with, the features you use, the actions you take, and the time,
              frequency and duration of your activities.
              <br />
              <br />
              <br />
              • Anonymous Email Information. We collect and store anonymous
              information about emails you send and receive through the Service.
              This includes numeric identifiers and timestamps, but does not
              include Email Content Data (as defined below) or other information
              that could identify the sender, the recipient or the subject of
              the email.
              <br />
              <br />
              <br />
              Personal Data We Receive From Third Parties: From time to time we
              may receive information about you from third parties and other
              users, including your job title, employer, and location. We may
              also collect information about you that is publicly available.
              This may include your publicly available social media information,
              or your contacts' publicly available social media information. The
              data we receive is dependent upon your and your contacts' privacy
              settings with the relevant social network.
              <br />
              <br />
              <br />
              Personal Data We Process on Your Behalf: we process the contents
              of emails you send and receive through the Service, as well as the
              email addresses of the people you communicate with through the
              Service (collectively "Email Content Data"), on your behalf and
              subject to your instructions. The use and transfer to any other
              app of information received from Google APIs will adhere to the
              Google API Services User Data Policy, including the Limited Use
              requirements. Personal Data We Process on Behalf of Business
              Customers: If one of our business customers (such as your
              employer) provides you with access to the Service, we process your
              information pursuant to our Terms of Service and other agreements
              with the applicable business customer. If you are such an
              individual and would no longer like your data to be used by one of
              our business customers that use our Services or you would like to
              access, correct or request deletion of your data, please contact
              the business customer that you interact with directly.
              <br />
              <br />
              <br />
              2. HOW WE USE PERSONAL DATA
              <br />
              <br />
              <br />
              We use Personal Data to provide the Service and improve your email
              experience. This processing is necessary to perform our contract
              with you.
              <br />
              <br />
              <br />
              We also use Personal Data as necessary for the following
              legitimate business interests:
              <br />
              <br />
              <br />
              • To update and synchronize Service features across multiple
              devices (i.e., so a draft email you begin on one device will be
              available on your other device(s));
              <br />
              <br />
              <br />
              • To display information in the Service (such as emails and
              insights (such as job titles and profile photos) about other
              individuals with whom you communicate through the Service);
              <br />
              <br />
              <br />
              • To respond to your inquiries, comments, feedback or questions
              and provide onboarding support;
              <br />
              <br />
              <br />
              • To solicit referrals for new users from current users and to
              contact such referrals and other potential users;
              <br />
              <br />
              <br />
              • To manage our relationship with you, which includes sending
              administrative information to you relating to our Service and
              changes to our terms, conditions, and policies and sending account
              verification or technical/security notices;
              <br />
              <br />
              <br />
              • To analyze how you interact with our Service and provide,
              maintain and improve the content and functionality of the Service
              and our customer relationships and experiences, develop our
              business and inform our marketing strategy;
              <br />
              <br />
              <br />
              • To administer and protect our business and the Site, prevent
              fraud, criminal activity, or misuses of our Site, and to ensure
              the security of our IT systems, architecture and networks
              (including troubleshooting, testing, system maintenance, support
              and hosting of data); and
              <br />
              <br />
              <br />• To comply with legal obligations and legal process and to
              protect our rights, privacy, safety or property, and/or that of
              our affiliates, you or other third parties, and recover debts due
              to us.
              <br />
              <br />
              <br />
              For information about what we mean by legitimate interests and the
              rights of individuals in the European Union ("EU"), please see the
              "EU Users" section below.
              <br />
              <br />
              <br />
              Aggregated Information. We may aggregate Personal Data and use the
              aggregated information to analyze the effectiveness of our
              Service, to improve and add features to our Service, and for other
              similar purposes. In addition, from time to time, we may analyze
              the general behavior and characteristics of users of our Services.
              We may collect aggregated information through the Service, through
              cookies, and through other means described in this Privacy Policy.
              <br />
              <br />
              <br />
              Marketing. We may contact you to provide information we believe
              will be of interest to you. For instance, if you elect to provide
              your email address, we may use that information to send you
              promotional information about our products and services. If we do,
              where required by law, for example if you are in the EU, we will
              only send you such emails if you consent to us doing so at the
              time you provide us with your Personal Data. You may opt out of
              receiving emails by following the instructions contained in each
              promotional email we send you or by contacting us. If you
              unsubscribe from our marketing lists, you will no longer receive
              marketing communications but we will continue to contact you
              regarding our Site and Services and to respond to your requests.
              <br />
              <br />
              <br />
              3. HOW WE SHARE AND DISCLOSE PERSONAL DATA
              <br />
              <br />
              <br />
              In certain circumstances we may share your Personal Data with
              third parties without further notice to you, unless required by
              the law, as set forth below:
              <br />
              <br />
              <br />
              Vendors and Service Providers: To assist us in meeting business
              operations needs and to perform certain services and functions, we
              may share Personal Data with service providers, including web
              hosting, debugging services, email and productivity services,
              survey providers, data base and sales/customer relationship
              management services, customer service providers, payment
              processors; web and app analytics services, and data brokers.
              Notwithstanding the foregoing, we only share Email Content Data
              with our hosting provider (Google, Inc.) and, if you opt in, with
              our AI provider (OpenAI, Inc.). Pursuant to our instructions,
              these parties will access, process or store Personal Data in the
              course of performing their duties to us.
              <br />
              <br />
              <br />
              We use OpenAI to provide you with Boondoggle AI's AI features,
              which are designed to help you create and edit emails with the
              help of machine learning algorithms. In order to use OpenAI's
              service, we need to collect, process, and transfer data, including
              personal data, the processes which are subject to this Privacy
              Policy. We use OpenAI and Boondoggle AI features based on your
              consent. By using Boondoggle's AI features, you consent to the
              processing of your personal data by us as described in this
              Privacy Policy. If you do not consent to the use of the OpenAI
              service, you should not switch on Boondoggle’s AI features.
              <br />
              <br />
              <br />
              Your email content and requests you make to Boondoggle's AI
              features are private and encrypted in accordance with our standard
              privacy and information security practices.
              <br />
              <br />
              <br />
              Your private data will not be used to train any machine learning
              models for Boondoggle AI or OpenAI when you use Boondoggle's AI
              features. Any information, including personal data, that you
              furnish while using Boondoggle's AI features will be shared with
              OpenAI solely for the purpose of functioning of Boondoggle's AI
              features.
              <br />
              <br />
              <br />
              Business Transfers: If we are involved in a merger, acquisition,
              financing due diligence, reorganization, bankruptcy, receivership,
              sale of all or a portion of our assets, or transition of service
              to another provider, your Personal Data and other information may
              be shared in the diligence process with counterparties and others
              assisting with the transaction and transferred to a successor or
              affiliate as part of that transaction along with other assets.
              <br />
              <br />
              <br />
              Legal Requirements: If required to do so by law or in the good
              faith belief that such action is necessary to (i) comply with
              legal or regulatory obligations, (ii) protect and defend our
              rights or property, (iii) prevent fraud, (iv) act in urgent
              circumstances to protect the personal safety of users of the Site,
              or the public, or (v) protect against legal liability.
              <br />
              <br />
              <br />
              4. DATA RETENTION
              <br />
              <br />
              <br />
              We keep Personal Data for as long as reasonably necessary for the
              purposes described in this Privacy Policy, while we have a
              legitimate business need to do so, or as required by law (e.g. for
              tax, legal, accounting or other purposes), whichever is the
              longer.
              <br />
              <br />
              <br />
              If you have elected to receive marketing communications from us,
              we retain information about your marketing preferences until you
              opt out of receiving these communications and in accordance with
              our policies.
              <br />
              <br />
              <br />
              To determine the appropriate retention period for your Personal
              Data, we will consider the amount, nature, and sensitivity of the
              Personal Data, the potential risk of harm from unauthorized use or
              disclosure of your Personal Data, the purposes for which we use
              your Personal Data and whether we can achieve those purposes
              through other means, and the applicable legal requirements.
              <br />
              <br />
              <br />
              5. UPDATE YOUR INFORMATION
              <br />
              <br />
              <br />
              If you need to change or correct your Personal Data, or wish to
              have it deleted from our systems, you may contact us. We will
              address your request as required by applicable law.
              <br />
              <br />
              <br />
              6. CALIFORNIA PRIVACY RIGHTS DISCLOSURES
              <br />
              <br />
              <br />
              Online Tracking and Do Not Track Signals: We may allow third party
              service providers to use cookies or other tracking technologies to
              collect information about your browsing activities over time and
              across different websites following your use of the Site. Our Site
              currently does not respond to "Do Not Track" ("DNT") signals and
              operates as described in this Privacy Policy whether or not a DNT
              signal is received. If we do respond to DNT signals in the future,
              we will describe how we do so in this Privacy Policy.
              <br />
              <br />
              <br />
              7. CHILDREN
              <br />
              <br />
              <br />
              Our Service is not directed to children who are under the age of
              13. Boondoggle does not knowingly collect Personal Data from
              children under the age of 13. If you have reason to believe that a
              child under the age of 13 has provided Personal Data to Boondoggle
              through the Service please contact us and we will endeavor to
              delete that information from our databases.
              <br />
              <br />
              <br />
              8. EU USERS
              <br />
              <br />
              <br />
              Scope. This section applies to individuals in the EU (for these
              purposes, reference to the EU also includes the European Economic
              Area countries of Iceland, Liechtenstein and Norway, the United
              Kingdom, and, to the extent applicable, Switzerland).
              <br />
              <br />
              <br />
              Data Controller. Data protection laws in the EU differentiate
              between the "data controller" and "data processor" of Personal
              Data. If you signed up for the Service on your own, Boondoggle is
              the data controller for the processing of your Personal Data. You
              can find our contact information, and the contact information of
              our EU-based representative, in the "Contact Us" section below.
              <br />
              <br />
              <br />
              Data Processor. If one of Boondoggle's business customers has
              granted you access to the Service, Boondoggle is the data
              processor for the processing of your Personal Data. To exercise
              the rights described below in relation to such processing of
              Personal Data, please contact the applicable business customer.
              Boondoggle is also the data processor for the processing of Email
              Content Data on your behalf.
              <br />
              <br />
              <br />
              Legal Bases for Processing. This Privacy Policy (the paragraph
              "How We Use Personal Data") describes the legal bases we rely on
              for the processing of your Personal Data. Please contact us if you
              have any questions about the specific legal basis we are relying
              on to process your Personal Data.
              <br />
              <br />
              <br />
              As used in this Privacy Policy, "legitimate interests" means our
              interests in conducting our business and developing a business
              relationship with you. This Privacy Policy describes when we
              process your Personal Data for our legitimate interests, what
              these interests are and your rights. We will not use your Personal
              Data for activities where the impact on you overrides our
              interests, unless we have your consent or those activities are
              otherwise required or permitted by law.
              <br />
              <br />
              <br />
              Your Rights. Pursuant to the European Union General Data
              Protection Regulation (or GDPR), you have the following rights in
              relation to your Personal Data, under certain circumstances:
              <br />
              <br />
              <br />
              • Right of access: If you ask us, we will confirm whether we are
              processing your Personal Data and, if so, provide you with a copy
              of that Personal Data along with certain other details. If you
              require additional copies, we may need to charge a reasonable fee.
              <br />
              <br />
              <br />
              • Right to rectification: If your Personal Data is inaccurate or
              incomplete, you are entitled to ask that we correct or complete
              it. If we shared your Personal Data with others, we will tell them
              about the correction where possible. If you ask us, and where
              possible and lawful to do so, we will also tell you with whom we
              shared your Personal Data so you can contact them directly.
              <br />
              <br />
              <br />
              • Right to erasure: You may ask us to delete or remove your
              Personal Data, such as where you withdraw your consent. If we
              shared your data with others, we will tell them about the erasure
              where possible. If you ask us, and where possible and lawful to do
              so, we will also tell you with whom we shared your Personal Data
              with so you can contact them directly.
              <br />
              <br />
              <br />
              • Right to restrict processing: You may ask us to restrict or
              'block' the processing of your Personal Data in certain
              circumstances, such as where you contest the accuracy of the data
              or object to us processing it (please read below for information
              on your right to object). We will tell you before we lift any
              restriction on processing. If we shared your Personal Data with
              others, we will tell them about the restriction where possible. If
              you ask us, and where possible and lawful to do so, we will also
              tell you with whom we shared your Personal Data so you can contact
              them directly.
              <br />
              <br />
              <br />
              • Right to data portability: You have the right to obtain your
              Personal Data from us that you consented to give us or that was
              provided to us as necessary in connection with our contract with
              you, and that is processed by automated means. We will give you
              your Personal Data in a structured, commonly used and
              machine-readable format. You may reuse it elsewhere.
              <br />
              <br />
              <br />
              • Right to object: You may ask us at any time to stop processing
              your Personal Data, and we will do so:
              <br />
              <br />
              <br />
              - If we are relying on a legitimate interest to process your
              Personal Data -- unless we demonstrate compelling legitimate
              grounds for the processing or we need to process your data in
              order to establish, exercise, or defend legal claims;
              <br />
              <br />
              <br />
              - If we are processing your Personal Data for direct marketing. We
              may keep minimum information about you in a suppression list in
              order to ensure your choices are respected in the future and to
              comply with data protection laws (such processing is necessary for
              our and your legitimate interest in pursuing the purposes
              described above);
              <br />
              <br />
              <br />
              • Right to withdraw consent: If we rely on your consent to process
              your Personal Data, you have the right to withdraw that consent at
              any time. Withdrawal of consent will not affect any processing of
              your data before we received notice that you wished to withdraw
              consent.
              <br />
              <br />
              <br />
              •Right to lodge a complaint with the data protection authority: If
              you have a concern about our privacy practices, including the way
              we handled your Personal Data, you can report it to the data
              protection authority that is authorized to hear those concerns (in
              the UK, the Information Commissioner's Office (ICO), who can be
              contacted at https://ico.org.uk/concerns, and in other EU
              countries the data protection authority of the country in which
              you are located).
              <br />
              <br />
              <br />
              Please see the "Contact Us" section below for information on how
              to exercise your rights.
              <br />
              <br />
              <br />
              Data Transfers.We rely on our EU-U.S. and Swiss-U.S. Privacy
              Shield certification to transfer Personal Data that we receive
              from the EU and Switzerland to Boondoggle in the U.S. (for more
              information, please read the "Privacy Shield" section below).
              <br />
              <br />
              <br />
              9. PRIVACY SHIELD
              <br />
              <br />
              <br />
              Boondoggle complies with the EU-U.S. and Swiss-U.S. Privacy Shield
              frameworks ("Frameworks") as set forth by the U.S. Department of
              Commerce regarding the processing of Personal Data transferred
              from the EU and Switzerland to the U.S. (for these purposes,
              reference to the EU also includes the European Economic Area
              countries of Iceland, Liechtenstein and Norway). Boondoggle has
              certified that it adheres to the Privacy Shield Principles
              (described below). If there is any conflict between the policies
              in this Privacy Policy and the EU or Swiss Privacy Shield
              Principles, the Privacy Shield Principles shall govern. To learn
              more about the Frameworks and to view our certification page,
              please visit https://www.privacyshield.gov/.
              <br />
              <br />
              <br />
              General. We rely on our Privacy Shield certification to transfer
              Personal Data that we receive from the EU and Switzerland to
              Boondoggle in the U.S. and we process such Personal Data in
              accordance with the Privacy Shield Principles of Notice, Choice,
              Accountability for Onward Transfer, Security, Data Integrity and
              Purpose Limitation, Access, and Recourse, Enforcement and
              Liability ("Privacy Shield Principles"), as described below.
              <br />
              <br />
              <br />
              Notice and Choice. This Privacy Policy provides notice of the
              Personal Data collected and transferred under the Privacy Shield
              and the choice that you have with respect to such Personal Data.
              It also provides information about other Privacy Shield Principles
              that are set forth below.
              <br />
              <br />
              <br />
              Accountability for Onward Transfers. We may be accountable for the
              Personal Data we receive under the Privacy Shield that we may
              transfer to third-party service providers (described in the
              section "How We Share and Disclose Personal Data" above). If such
              service providers process Personal Data in a manner inconsistent
              with the Privacy Shield Principles, we are responsible for the
              harm caused.
              <br />
              <br />
              <br />
              Security. We maintain security measures to protect Personal Data
              as described in the "Security" section of this Privacy Policy.
              <br />
              <br />
              <br />
              Data Integrity and Purpose Limitation. We take reasonable steps to
              ensure that Personal Data is reliable for its intended use, and
              that it is accurate, complete and current for as long as we retain
              it. Our data retention practices are described in the "Data
              Retention" section of this Privacy Policy.
              <br />
              <br />
              <br />
              Access. EU users have certain rights to access, correct, amend, or
              delete Personal Data where it is inaccurate, or has been processed
              in violation of the Privacy Shield Principles. Please see the
              "Your Rights" section above for more information on the rights of
              users in the EU (and, to the extent applicable, users in
              Switzerland).
              <br />
              <br />
              <br />
              Recourse, Enforcement, Liability. In compliance with the Privacy
              Shield Principles, Boondoggle commits to resolve complaints about
              our processing of your Personal Data. EU and Swiss users with
              inquiries or complaints regarding this Private Shield Policy
              should first contact Boondoggle at: team@boondoggle.ai.
              <br />
              <br />
              <br />
              We have further committed to refer unresolved Privacy Shield
              complaints to an alternative dispute resolution provider. If you
              have an unresolved privacy or data use concern that we have not
              addressed satisfactorily, please contact our U.S.-based third
              party dispute resolution provider JAMS (free of charge) at
              https://www.jamsadr.com/eu-us-privacy-shield.
              <br />
              <br />
              <br />
              If your complaint is not resolved through these channels, under
              certain conditions a binding arbitration option may be available
              before a Privacy Shield Panel. For additional information, please
              visit:
              https://www.privacyshield.gov/article?id=ANNEX-I-introduction.
              <br />
              <br />
              <br />
              We are subject to the investigatory and enforcement powers of the
              Federal Trade Commission with respect to Personal Data received or
              transferred pursuant to the Frameworks.
              <br />
              <br />
              <br />
              10. LINKS TO OTHER WEBSITES
              <br />
              <br />
              <br />
              The Site may contain links to other websites not operated or
              controlled by Boondoggle, including social media services ("Third
              Party Sites"). The information that you share with Third Party
              Sites will be governed by the specific privacy policies and terms
              of service of the Third Party Sites and not by this Privacy
              Policy. By providing these links we do not imply that we endorse
              or have reviewed these sites. Please contact the Third Party Sites
              directly for information on their privacy practices and policies.
              <br />
              <br />
              <br />
              11. COOKIES
              <br />
              <br />
              <br />
              A "cookie" is a piece of information sent to your browser by a
              website you visit. By choosing to use the Site after having been
              notified of our use of cookies and other technologies in the ways
              described in this Privacy Policy, and, in applicable
              jurisdictions, through notice and unambiguous acknowledgement of
              your consent, you agree to such use.
              <br />
              <br />
              <br />
              Cookies can be stored on your computer for different periods of
              time. Some cookies expire after a certain amount of time, or upon
              logging out (session cookies), others survive after your browser
              is closed until a defined expiration date set in the cookie (as
              determined by the third party placing it) and help recognize your
              computer when you open your browser and browse the Internet again
              (persistent cookies). Our Site uses cookies from the third
              parties. For more details, reach out to team@boondoggle.ai.
            </p>
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
                      navigation("/", {
                        state: {
                          id: "integrations",
                        },
                      });
                    }}
                  >
                    Integrations
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/", {
                        state: {
                          id: "features",
                        },
                      });
                    }}
                  >
                    Features
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/", {
                        state: {
                          id: "pricing",
                        },
                      });
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
              </div>
            </div>
          </div>
        </div>
      </BrowserView>
      <MobileView>
        <div className="landing-container" id="information">
          <Header isMobile={true} />
          <div className="landing-text-container">
            <span className="landing-text-big" style={{ fontSize: "40px" }}>
              Privacy Policy
            </span>
            <p className="privacy-text" style={{ fontSize: "16px" }}>
              Privacy Policy
              <br />
              Last Updated: February 12, 2024
              <br />
              <br />
              <br />
              Welcome to Boondoggle AI, a service provided by Crewmate
              Technologies Inc. ("Boondoggle", “Boondoggle AI”, "we", "us", or
              "our").
              <br />
              <br />
              <br />
              This Privacy Policy explains how we collect, disclose and
              otherwise process Personal Data (defined below) when you use our
              website (the "Site"), mobile application (the "App"), and all
              related services provided by Boondoggle AI (collectively, the
              "Service"), and your choices concerning our data practices.
              <br />
              <br />
              <br />
              "You" or "your", as used in this Privacy Policy, refers to the
              individual to whom Personal Data relates.
              <br />
              <br />
              <br />
              This Privacy Policy is incorporated into and forms part of our
              Terms of Service. Please read this Privacy Policy before using our
              Service or submitting any Personal Data to Boondoggle AI and
              contact us if you have any questions.
              <br />
              <br />
              <br />
              1. INFORMATION WE COLLECT
              <br />
              <br />
              <br />
              When you contact us or interact with our Service we collect
              information that alone or in combination with other information
              could be used to identify you ("Personal Data") as follows:
              <br />
              <br />
              <br />
              Personal Data You Provide:
              <br />
              <br />
              <br />
              We may collect your name, email address, phone number, and payment
              information when you register for our Service, sign up for our
              mailing list, or otherwise communicate with us. We may also
              collect any communications between you and Boondoggle AI and any
              other information you provide to the Boondoggle AI.
              <br />
              <br />
              <br />
              We also have pages on social media sites like Facebook and Twitter
              ("Social Media Pages"). When you interact with our Social Media
              Pages, we may collect Personal Data that you elect to provide to
              us through your settings on the Social Media Site, such as your
              contact details. In addition, the companies that host our Social
              Media Pages may provide us with aggregate information and
              analytics regarding the use of our Social Media Pages.
              <br />
              <br />
              <br />
              Personal Data Collected Automatically:
              <br />
              <br />
              <br />
              Boondoggle AI Content. We collect information from Boondoggle AI
              product features, including the content of drafts or snippets you
              create in the Service and read receipts.
              <br />
              <br />
              <br />
              Authentication Tokens. When you sign in to the Service, we collect
              and store encrypted Google or Microsoft authentication tokens.
              <br />
              <br />
              <br />
              Use of the Site and App: When you visit, use and interact with the
              Site or App, we may receive certain information about your visit,
              use or interactions. For example, we may monitor the number of
              people that visit our Site or App, peak hours of visits, which
              page(s) are visited on our Site, the domains our visitors come
              from (e.g., google.com, yahoo.com, etc.), and which browsers
              people use to access and visit our Site (e.g., Firefox, Microsoft
              Internet Explorer, etc.), broad geographical information, and
              Site-navigation pattern. In particular, the following information
              is created and automatically logged in our systems:
              <br />
              <br />
              <br />
              • Log data: Information that your browser automatically sends
              whenever you visit the Site ("log data"). Log data includes your
              Internet Protocol ("IP") address (so we understand which country
              you are connecting from when you visit the Site), browser type and
              settings, the date and time of your request, and how you
              interacted with the Site.
              <br />
              <br />
              <br />
              • Cookies: Please see the "Cookies" section below to learn more
              about how we use cookies on the Site.
              <br />
              <br />
              <br />
              • Device information: Includes the operating system and browser
              you are using. Information collected may depend on the type of
              device you use and its settings.
              <br />
              <br />
              <br />
              • Usage Information: We collect information about how you use our
              Site and App, such as the types of content that you view or engage
              with, the features you use, the actions you take, and the time,
              frequency and duration of your activities.
              <br />
              <br />
              <br />
              • Anonymous Email Information. We collect and store anonymous
              information about emails you send and receive through the Service.
              This includes numeric identifiers and timestamps, but does not
              include Email Content Data (as defined below) or other information
              that could identify the sender, the recipient or the subject of
              the email.
              <br />
              <br />
              <br />
              Personal Data We Receive From Third Parties: From time to time we
              may receive information about you from third parties and other
              users, including your job title, employer, and location. We may
              also collect information about you that is publicly available.
              This may include your publicly available social media information,
              or your contacts' publicly available social media information. The
              data we receive is dependent upon your and your contacts' privacy
              settings with the relevant social network.
              <br />
              <br />
              <br />
              Personal Data We Process on Your Behalf: we process the contents
              of emails you send and receive through the Service, as well as the
              email addresses of the people you communicate with through the
              Service (collectively "Email Content Data"), on your behalf and
              subject to your instructions. The use and transfer to any other
              app of information received from Google APIs will adhere to the
              Google API Services User Data Policy, including the Limited Use
              requirements. Personal Data We Process on Behalf of Business
              Customers: If one of our business customers (such as your
              employer) provides you with access to the Service, we process your
              information pursuant to our Terms of Service and other agreements
              with the applicable business customer. If you are such an
              individual and would no longer like your data to be used by one of
              our business customers that use our Services or you would like to
              access, correct or request deletion of your data, please contact
              the business customer that you interact with directly.
              <br />
              <br />
              <br />
              2. HOW WE USE PERSONAL DATA
              <br />
              <br />
              <br />
              We use Personal Data to provide the Service and improve your email
              experience. This processing is necessary to perform our contract
              with you.
              <br />
              <br />
              <br />
              We also use Personal Data as necessary for the following
              legitimate business interests:
              <br />
              <br />
              <br />
              • To update and synchronize Service features across multiple
              devices (i.e., so a draft email you begin on one device will be
              available on your other device(s));
              <br />
              <br />
              <br />
              • To display information in the Service (such as emails and
              insights (such as job titles and profile photos) about other
              individuals with whom you communicate through the Service);
              <br />
              <br />
              <br />
              • To respond to your inquiries, comments, feedback or questions
              and provide onboarding support;
              <br />
              <br />
              <br />
              • To solicit referrals for new users from current users and to
              contact such referrals and other potential users;
              <br />
              <br />
              <br />
              • To manage our relationship with you, which includes sending
              administrative information to you relating to our Service and
              changes to our terms, conditions, and policies and sending account
              verification or technical/security notices;
              <br />
              <br />
              <br />
              • To analyze how you interact with our Service and provide,
              maintain and improve the content and functionality of the Service
              and our customer relationships and experiences, develop our
              business and inform our marketing strategy;
              <br />
              <br />
              <br />
              • To administer and protect our business and the Site, prevent
              fraud, criminal activity, or misuses of our Site, and to ensure
              the security of our IT systems, architecture and networks
              (including troubleshooting, testing, system maintenance, support
              and hosting of data); and
              <br />
              <br />
              <br />• To comply with legal obligations and legal process and to
              protect our rights, privacy, safety or property, and/or that of
              our affiliates, you or other third parties, and recover debts due
              to us.
              <br />
              <br />
              <br />
              For information about what we mean by legitimate interests and the
              rights of individuals in the European Union ("EU"), please see the
              "EU Users" section below.
              <br />
              <br />
              <br />
              Aggregated Information. We may aggregate Personal Data and use the
              aggregated information to analyze the effectiveness of our
              Service, to improve and add features to our Service, and for other
              similar purposes. In addition, from time to time, we may analyze
              the general behavior and characteristics of users of our Services.
              We may collect aggregated information through the Service, through
              cookies, and through other means described in this Privacy Policy.
              <br />
              <br />
              <br />
              Marketing. We may contact you to provide information we believe
              will be of interest to you. For instance, if you elect to provide
              your email address, we may use that information to send you
              promotional information about our products and services. If we do,
              where required by law, for example if you are in the EU, we will
              only send you such emails if you consent to us doing so at the
              time you provide us with your Personal Data. You may opt out of
              receiving emails by following the instructions contained in each
              promotional email we send you or by contacting us. If you
              unsubscribe from our marketing lists, you will no longer receive
              marketing communications but we will continue to contact you
              regarding our Site and Services and to respond to your requests.
              <br />
              <br />
              <br />
              3. HOW WE SHARE AND DISCLOSE PERSONAL DATA
              <br />
              <br />
              <br />
              In certain circumstances we may share your Personal Data with
              third parties without further notice to you, unless required by
              the law, as set forth below:
              <br />
              <br />
              <br />
              Vendors and Service Providers: To assist us in meeting business
              operations needs and to perform certain services and functions, we
              may share Personal Data with service providers, including web
              hosting, debugging services, email and productivity services,
              survey providers, data base and sales/customer relationship
              management services, customer service providers, payment
              processors; web and app analytics services, and data brokers.
              Notwithstanding the foregoing, we only share Email Content Data
              with our hosting provider (Google, Inc.) and, if you opt in, with
              our AI provider (OpenAI, Inc.). Pursuant to our instructions,
              these parties will access, process or store Personal Data in the
              course of performing their duties to us.
              <br />
              <br />
              <br />
              We use OpenAI to provide you with Boondoggle AI's AI features,
              which are designed to help you create and edit emails with the
              help of machine learning algorithms. In order to use OpenAI's
              service, we need to collect, process, and transfer data, including
              personal data, the processes which are subject to this Privacy
              Policy. We use OpenAI and Boondoggle AI features based on your
              consent. By using Boondoggle's AI features, you consent to the
              processing of your personal data by us as described in this
              Privacy Policy. If you do not consent to the use of the OpenAI
              service, you should not switch on Boondoggle’s AI features.
              <br />
              <br />
              <br />
              Your email content and requests you make to Boondoggle's AI
              features are private and encrypted in accordance with our standard
              privacy and information security practices.
              <br />
              <br />
              <br />
              Your private data will not be used to train any machine learning
              models for Boondoggle AI or OpenAI when you use Boondoggle's AI
              features. Any information, including personal data, that you
              furnish while using Boondoggle's AI features will be shared with
              OpenAI solely for the purpose of functioning of Boondoggle's AI
              features.
              <br />
              <br />
              <br />
              Business Transfers: If we are involved in a merger, acquisition,
              financing due diligence, reorganization, bankruptcy, receivership,
              sale of all or a portion of our assets, or transition of service
              to another provider, your Personal Data and other information may
              be shared in the diligence process with counterparties and others
              assisting with the transaction and transferred to a successor or
              affiliate as part of that transaction along with other assets.
              <br />
              <br />
              <br />
              Legal Requirements: If required to do so by law or in the good
              faith belief that such action is necessary to (i) comply with
              legal or regulatory obligations, (ii) protect and defend our
              rights or property, (iii) prevent fraud, (iv) act in urgent
              circumstances to protect the personal safety of users of the Site,
              or the public, or (v) protect against legal liability.
              <br />
              <br />
              <br />
              4. DATA RETENTION
              <br />
              <br />
              <br />
              We keep Personal Data for as long as reasonably necessary for the
              purposes described in this Privacy Policy, while we have a
              legitimate business need to do so, or as required by law (e.g. for
              tax, legal, accounting or other purposes), whichever is the
              longer.
              <br />
              <br />
              <br />
              If you have elected to receive marketing communications from us,
              we retain information about your marketing preferences until you
              opt out of receiving these communications and in accordance with
              our policies.
              <br />
              <br />
              <br />
              To determine the appropriate retention period for your Personal
              Data, we will consider the amount, nature, and sensitivity of the
              Personal Data, the potential risk of harm from unauthorized use or
              disclosure of your Personal Data, the purposes for which we use
              your Personal Data and whether we can achieve those purposes
              through other means, and the applicable legal requirements.
              <br />
              <br />
              <br />
              5. UPDATE YOUR INFORMATION
              <br />
              <br />
              <br />
              If you need to change or correct your Personal Data, or wish to
              have it deleted from our systems, you may contact us. We will
              address your request as required by applicable law.
              <br />
              <br />
              <br />
              6. CALIFORNIA PRIVACY RIGHTS DISCLOSURES
              <br />
              <br />
              <br />
              Online Tracking and Do Not Track Signals: We may allow third party
              service providers to use cookies or other tracking technologies to
              collect information about your browsing activities over time and
              across different websites following your use of the Site. Our Site
              currently does not respond to "Do Not Track" ("DNT") signals and
              operates as described in this Privacy Policy whether or not a DNT
              signal is received. If we do respond to DNT signals in the future,
              we will describe how we do so in this Privacy Policy.
              <br />
              <br />
              <br />
              7. CHILDREN
              <br />
              <br />
              <br />
              Our Service is not directed to children who are under the age of
              13. Boondoggle does not knowingly collect Personal Data from
              children under the age of 13. If you have reason to believe that a
              child under the age of 13 has provided Personal Data to Boondoggle
              through the Service please contact us and we will endeavor to
              delete that information from our databases.
              <br />
              <br />
              <br />
              8. EU USERS
              <br />
              <br />
              <br />
              Scope. This section applies to individuals in the EU (for these
              purposes, reference to the EU also includes the European Economic
              Area countries of Iceland, Liechtenstein and Norway, the United
              Kingdom, and, to the extent applicable, Switzerland).
              <br />
              <br />
              <br />
              Data Controller. Data protection laws in the EU differentiate
              between the "data controller" and "data processor" of Personal
              Data. If you signed up for the Service on your own, Boondoggle is
              the data controller for the processing of your Personal Data. You
              can find our contact information, and the contact information of
              our EU-based representative, in the "Contact Us" section below.
              <br />
              <br />
              <br />
              Data Processor. If one of Boondoggle's business customers has
              granted you access to the Service, Boondoggle is the data
              processor for the processing of your Personal Data. To exercise
              the rights described below in relation to such processing of
              Personal Data, please contact the applicable business customer.
              Boondoggle is also the data processor for the processing of Email
              Content Data on your behalf.
              <br />
              <br />
              <br />
              Legal Bases for Processing. This Privacy Policy (the paragraph
              "How We Use Personal Data") describes the legal bases we rely on
              for the processing of your Personal Data. Please contact us if you
              have any questions about the specific legal basis we are relying
              on to process your Personal Data.
              <br />
              <br />
              <br />
              As used in this Privacy Policy, "legitimate interests" means our
              interests in conducting our business and developing a business
              relationship with you. This Privacy Policy describes when we
              process your Personal Data for our legitimate interests, what
              these interests are and your rights. We will not use your Personal
              Data for activities where the impact on you overrides our
              interests, unless we have your consent or those activities are
              otherwise required or permitted by law.
              <br />
              <br />
              <br />
              Your Rights. Pursuant to the European Union General Data
              Protection Regulation (or GDPR), you have the following rights in
              relation to your Personal Data, under certain circumstances:
              <br />
              <br />
              <br />
              • Right of access: If you ask us, we will confirm whether we are
              processing your Personal Data and, if so, provide you with a copy
              of that Personal Data along with certain other details. If you
              require additional copies, we may need to charge a reasonable fee.
              <br />
              <br />
              <br />
              • Right to rectification: If your Personal Data is inaccurate or
              incomplete, you are entitled to ask that we correct or complete
              it. If we shared your Personal Data with others, we will tell them
              about the correction where possible. If you ask us, and where
              possible and lawful to do so, we will also tell you with whom we
              shared your Personal Data so you can contact them directly.
              <br />
              <br />
              <br />
              • Right to erasure: You may ask us to delete or remove your
              Personal Data, such as where you withdraw your consent. If we
              shared your data with others, we will tell them about the erasure
              where possible. If you ask us, and where possible and lawful to do
              so, we will also tell you with whom we shared your Personal Data
              with so you can contact them directly.
              <br />
              <br />
              <br />
              • Right to restrict processing: You may ask us to restrict or
              'block' the processing of your Personal Data in certain
              circumstances, such as where you contest the accuracy of the data
              or object to us processing it (please read below for information
              on your right to object). We will tell you before we lift any
              restriction on processing. If we shared your Personal Data with
              others, we will tell them about the restriction where possible. If
              you ask us, and where possible and lawful to do so, we will also
              tell you with whom we shared your Personal Data so you can contact
              them directly.
              <br />
              <br />
              <br />
              • Right to data portability: You have the right to obtain your
              Personal Data from us that you consented to give us or that was
              provided to us as necessary in connection with our contract with
              you, and that is processed by automated means. We will give you
              your Personal Data in a structured, commonly used and
              machine-readable format. You may reuse it elsewhere.
              <br />
              <br />
              <br />
              • Right to object: You may ask us at any time to stop processing
              your Personal Data, and we will do so:
              <br />
              <br />
              <br />
              - If we are relying on a legitimate interest to process your
              Personal Data -- unless we demonstrate compelling legitimate
              grounds for the processing or we need to process your data in
              order to establish, exercise, or defend legal claims;
              <br />
              <br />
              <br />
              - If we are processing your Personal Data for direct marketing. We
              may keep minimum information about you in a suppression list in
              order to ensure your choices are respected in the future and to
              comply with data protection laws (such processing is necessary for
              our and your legitimate interest in pursuing the purposes
              described above);
              <br />
              <br />
              <br />
              • Right to withdraw consent: If we rely on your consent to process
              your Personal Data, you have the right to withdraw that consent at
              any time. Withdrawal of consent will not affect any processing of
              your data before we received notice that you wished to withdraw
              consent.
              <br />
              <br />
              <br />
              •Right to lodge a complaint with the data protection authority: If
              you have a concern about our privacy practices, including the way
              we handled your Personal Data, you can report it to the data
              protection authority that is authorized to hear those concerns (in
              the UK, the Information Commissioner's Office (ICO), who can be
              contacted at https://ico.org.uk/concerns, and in other EU
              countries the data protection authority of the country in which
              you are located).
              <br />
              <br />
              <br />
              Please see the "Contact Us" section below for information on how
              to exercise your rights.
              <br />
              <br />
              <br />
              Data Transfers.We rely on our EU-U.S. and Swiss-U.S. Privacy
              Shield certification to transfer Personal Data that we receive
              from the EU and Switzerland to Boondoggle in the U.S. (for more
              information, please read the "Privacy Shield" section below).
              <br />
              <br />
              <br />
              9. PRIVACY SHIELD
              <br />
              <br />
              <br />
              Boondoggle complies with the EU-U.S. and Swiss-U.S. Privacy Shield
              frameworks ("Frameworks") as set forth by the U.S. Department of
              Commerce regarding the processing of Personal Data transferred
              from the EU and Switzerland to the U.S. (for these purposes,
              reference to the EU also includes the European Economic Area
              countries of Iceland, Liechtenstein and Norway). Boondoggle has
              certified that it adheres to the Privacy Shield Principles
              (described below). If there is any conflict between the policies
              in this Privacy Policy and the EU or Swiss Privacy Shield
              Principles, the Privacy Shield Principles shall govern. To learn
              more about the Frameworks and to view our certification page,
              please visit https://www.privacyshield.gov/.
              <br />
              <br />
              <br />
              General. We rely on our Privacy Shield certification to transfer
              Personal Data that we receive from the EU and Switzerland to
              Boondoggle in the U.S. and we process such Personal Data in
              accordance with the Privacy Shield Principles of Notice, Choice,
              Accountability for Onward Transfer, Security, Data Integrity and
              Purpose Limitation, Access, and Recourse, Enforcement and
              Liability ("Privacy Shield Principles"), as described below.
              <br />
              <br />
              <br />
              Notice and Choice. This Privacy Policy provides notice of the
              Personal Data collected and transferred under the Privacy Shield
              and the choice that you have with respect to such Personal Data.
              It also provides information about other Privacy Shield Principles
              that are set forth below.
              <br />
              <br />
              <br />
              Accountability for Onward Transfers. We may be accountable for the
              Personal Data we receive under the Privacy Shield that we may
              transfer to third-party service providers (described in the
              section "How We Share and Disclose Personal Data" above). If such
              service providers process Personal Data in a manner inconsistent
              with the Privacy Shield Principles, we are responsible for the
              harm caused.
              <br />
              <br />
              <br />
              Security. We maintain security measures to protect Personal Data
              as described in the "Security" section of this Privacy Policy.
              <br />
              <br />
              <br />
              Data Integrity and Purpose Limitation. We take reasonable steps to
              ensure that Personal Data is reliable for its intended use, and
              that it is accurate, complete and current for as long as we retain
              it. Our data retention practices are described in the "Data
              Retention" section of this Privacy Policy.
              <br />
              <br />
              <br />
              Access. EU users have certain rights to access, correct, amend, or
              delete Personal Data where it is inaccurate, or has been processed
              in violation of the Privacy Shield Principles. Please see the
              "Your Rights" section above for more information on the rights of
              users in the EU (and, to the extent applicable, users in
              Switzerland).
              <br />
              <br />
              <br />
              Recourse, Enforcement, Liability. In compliance with the Privacy
              Shield Principles, Boondoggle commits to resolve complaints about
              our processing of your Personal Data. EU and Swiss users with
              inquiries or complaints regarding this Private Shield Policy
              should first contact Boondoggle at: team@boondoggle.ai.
              <br />
              <br />
              <br />
              We have further committed to refer unresolved Privacy Shield
              complaints to an alternative dispute resolution provider. If you
              have an unresolved privacy or data use concern that we have not
              addressed satisfactorily, please contact our U.S.-based third
              party dispute resolution provider JAMS (free of charge) at
              https://www.jamsadr.com/eu-us-privacy-shield.
              <br />
              <br />
              <br />
              If your complaint is not resolved through these channels, under
              certain conditions a binding arbitration option may be available
              before a Privacy Shield Panel. For additional information, please
              visit:
              https://www.privacyshield.gov/article?id=ANNEX-I-introduction.
              <br />
              <br />
              <br />
              We are subject to the investigatory and enforcement powers of the
              Federal Trade Commission with respect to Personal Data received or
              transferred pursuant to the Frameworks.
              <br />
              <br />
              <br />
              10. LINKS TO OTHER WEBSITES
              <br />
              <br />
              <br />
              The Site may contain links to other websites not operated or
              controlled by Boondoggle, including social media services ("Third
              Party Sites"). The information that you share with Third Party
              Sites will be governed by the specific privacy policies and terms
              of service of the Third Party Sites and not by this Privacy
              Policy. By providing these links we do not imply that we endorse
              or have reviewed these sites. Please contact the Third Party Sites
              directly for information on their privacy practices and policies.
              <br />
              <br />
              <br />
              11. COOKIES
              <br />
              <br />
              <br />
              A "cookie" is a piece of information sent to your browser by a
              website you visit. By choosing to use the Site after having been
              notified of our use of cookies and other technologies in the ways
              described in this Privacy Policy, and, in applicable
              jurisdictions, through notice and unambiguous acknowledgement of
              your consent, you agree to such use.
              <br />
              <br />
              <br />
              Cookies can be stored on your computer for different periods of
              time. Some cookies expire after a certain amount of time, or upon
              logging out (session cookies), others survive after your browser
              is closed until a defined expiration date set in the cookie (as
              determined by the third party placing it) and help recognize your
              computer when you open your browser and browse the Internet again
              (persistent cookies). Our Site uses cookies from the third
              parties. For more details, reach out to team@boondoggle.ai.
            </p>
            <div
              className="upper-footer-container"
              style={{ width: "100vw", justifyContent: "center" }}
            >
              {/* <p className="upper-footer-header">
                Automate your <br /> CRM Entry <br />
                with AI
              </p> */}
              <div className="upper-footer-pages">
                <div className="upper-footer-column">
                  <span className="upper-footer-column-header">Product</span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/", {
                        state: {
                          id: "integrations",
                        },
                      });
                    }}
                  >
                    Integrations
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/", {
                        state: {
                          id: "features",
                        },
                      });
                    }}
                  >
                    Features
                  </span>
                  <span
                    className="upper-footer-column-text"
                    onClick={() => {
                      navigation("/", {
                        state: {
                          id: "pricing",
                        },
                      });
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
              </div>
            </div>
          </div>
        </div>
      </MobileView>
    </>
  );
}

export default Privacy;
