import React, { useEffect, useState, useRef } from "react";
import "./Terms.css";
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

function Terms(props) {
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
              Terms of Service
            </span>
            <p className="privacy-text">
              Last Updated: February 12, 2024
              <br />
              <br />
              <br />
              Boondoggle Labs, Inc. ("Boondoggle," "we," "us," "our") provides
              its services (described below) through its website located at
              https://boondoggle.ai (the "Site") and through its applications
              and related services (collectively, such services, including any
              new features and applications, and the Site, the "Service(s)"),
              subject to the following Terms of Service (as amended from time to
              time, these "Terms of Service"). These Terms of Service are
              effective as of the date you and Boondoggle enter into an online
              order or you otherwise complete the online ordering flow on the
              Service (the “Effective Date”). If you are accepting these Terms
              of Service on behalf of your employer, organization or another
              entity (collectively, an “Entity”) (which will be deemed to the
              case if you sign up for a Service using an email address from such
              Entity), then you represent and warrant that (a) you have read and
              understand these Terms of Service, (b) you have full legal
              authority to bind such Entity to these Terms of Service and (c)
              you agree to these Terms of Service on behalf of such Entity. As
              used in the remainder of these Terms of Service, “You” means the
              Entity you represent in accepting these Terms of Service or, if
              that does not apply, you individually.
              <br />
              <br />
              <br />
              We reserve the right, at our sole discretion, to change or modify
              portions of these Terms of Service at any time. If we do this, we
              will post the changes on this page and will indicate at the top of
              this page the date these terms were last revised. We will also
              notify you, either through the Services user interface, in an
              email notification or through other reasonable means. Any such
              changes will become effective no earlier than fourteen (14) days
              after they are posted, provided that if you have paid for a
              subscription to a Service (“Subscription”), then with respect to
              that Service any such change will take effect at the next renewal
              of your Subscription, except as set forth below. Your continued
              use of the Service after the date any such changes become
              effective constitutes your acceptance of the new Terms of Service.
              <br />
              <br />
              <br />
              PLEASE READ THESE TERMS OF SERVICE CAREFULLY, AS THEY CONTAIN AN
              AGREEMENT TO ARBITRATE AND OTHER IMPORTANT INFORMATION REGARDING
              YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. THE AGREEMENT TO
              ARBITRATE REQUIRES (WITH LIMITED EXCEPTION) THAT YOU SUBMIT CLAIMS
              YOU HAVE AGAINST US TO BINDING AND FINAL ARBITRATION, AND FURTHER
              (1) YOU WILL ONLY BE PERMITTED TO PURSUE CLAIMS AGAINST BOONDOGGLE
              ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
              CLASS OR REPRESENTATIVE ACTION OR PROCEEDING, (2) YOU WILL ONLY BE
              PERMITTED TO SEEK RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
              DECLARATORY RELIEF) ON AN INDIVIDUAL BASIS, AND (3) YOU MAY NOT BE
              ABLE TO HAVE ANY CLAIMS YOU HAVE AGAINST US RESOLVED BY A JURY OR
              IN A COURT OF LAW.
              <br />
              <br />
              <br />
              In addition, when using certain services, you will be subject to
              additional terms applicable to such services that may be posted on
              the Service from time to time, including, without limitation, the
              Acceptable Use Policy located at
              https://boondoggle.ai/acceptable-use and Privacy Policy located at
              https://boondoggle.ai/privacy. All such terms are hereby
              incorporated by reference into these Terms of Service. If you are
              an individual, our Privacy Policy will apply to you and you
              consent to our collection and use of personal data as outlined
              therein, or if you are an Entity, our Privacy Policy will apply to
              your end users.
              <br />
              <br />
              <br />
              Access and Use of the Service
              <br />
              <br />
              <br />
              Services Description: The Service is designed to improve the email
              experience by making it faster and more intelligent.
              <br />
              <br />
              <br />
              Your Registration Obligations: You may be required to register
              with Boondoggle in order to access and use certain features of the
              Service. If you choose to register for the Service, you agree to
              provide and maintain true, accurate, current and complete
              information about yourself as prompted by the Service's
              registration form. Registration data and certain other information
              about you are governed by our Privacy Policy. If you are under 13
              years of age, you are not authorized to use the Service, with or
              without registering. In addition, if you are under 18 years old,
              you may use the Service, with or without registering, only with
              the approval of your parent or guardian. To the extent you are an
              Entity, you are responsible for obtaining and maintaining all
              required consents from your end users to allow Boondoggle to
              provide the Service to you and your end users.
              <br />
              <br />
              <br />
              Use of Google APIs: Boondoggle's use of information received from
              Google APIs will adhere to Google API Services User Data Policy,
              including the Limited Use requirements.
              <br />
              <br />
              <br />
              Security of your email: Boondoggle will implement appropriate
              technical and organizational measures to protect against
              accidental or unlawful destruction, loss, alteration, unauthorized
              disclosure of, or access to customer data. You agree (a) to
              immediately notify Boondoggle at team@boondoggle.ai of any breach
              of security or potential security issue you notice while using the
              Service; and (b) that Boondoggle is not responsible for any
              electronic communications and/or content (as defined below) which
              are lost, altered, intercepted or stored without authorization
              during the transmission of any data whatsoever across networks not
              owned and/or operated by Boondoggle. Boondoggle will not be liable
              for any loss or damage arising from your failure to comply with
              this Section.
              <br />
              <br />
              <br />
              Access to the Service: You are responsible for obtaining and
              maintaining any equipment and ancillary services needed to connect
              to, access or otherwise use the Service, including, without
              limitation, modems, hardware, server, software, operating system,
              networking, email servers, email services, web servers, web
              services, long distance and local telephone service (collectively,
              "Equipment"). You are responsible for ensuring that such Equipment
              and services are compatible with the Service (and, to the extent
              applicable, the Software (as defined below)) and complies with all
              configurations and specifications set forth in Boondoggle's
              published policies then in effect. In the event that you notice a
              failure or an issue that could cause a problem with the Boondoggle
              service, you agree to notify us at team@boondoggle.ai so that we
              can work to resolve the failure or issue.
              <br />
              <br />
              <br />
              General Practices Regarding Use and Storage: You acknowledge that
              Boondoggle may establish general practices and limits concerning
              use of the Service, including without limitation the maximum
              period of time that data or other content will be retained by the
              Service and the maximum storage space that will be allotted on
              Boondoggle's servers on your behalf. You agree that Boondoggle has
              no responsibility or liability for the deletion or failure to
              store any data or other content maintained or uploaded by the
              Service. You acknowledge that Boondoggle reserves the right to
              terminate accounts that are inactive for an extended period of
              time.
              <br />
              <br />
              <br />
              Mobile Services: The Service includes certain services that are
              available via a mobile device, including (i) the ability to upload
              content to the Service via a mobile device, (ii) the ability to
              browse the Service and the Site from a mobile device and (iii) the
              ability to access certain features through an application
              downloaded and installed on a mobile device (collectively, the
              "Mobile Services"). To the extent you access the Service through a
              mobile device, your wireless service carrier's standard charges,
              data rates and other fees may apply. In addition, downloading,
              installing, or using certain Mobile Services may be prohibited or
              restricted by your carrier, and not all Mobile Services may work
              with all carriers or devices.
              <br />
              <br />
              <br />
              Conditions of Use
              <br />
              <br />
              <br />
              User Conduct: You are solely responsible for all code, video,
              images, information, data, text, software, music, sound,
              photographs, graphics, messages or other materials ("content")
              that you upload, post, publish, display, transmit or email
              (collectively, "transmit") or otherwise use via the Service. You
              and your use of the Service (including use by your end users, if
              any) and your content must comply at all times with Boondoggle's
              Acceptable Use Policy.
              <br />
              <br />
              <br />
              Fees; Non-Renewal: To the extent the Service or any portion
              thereof is made available for any fee, you will be required to
              select a payment plan and provide Boondoggle information regarding
              your credit card or other payment instrument. You represent and
              warrant to Boondoggle that such information is true and that you
              are authorized to use the payment instrument. You will promptly
              update your account information with any changes (for example, a
              change in your billing address or credit card expiration date)
              that may occur. You agree to pay Boondoggle the amount that is
              specified in the payment plan in accordance with the terms of such
              plan and this Terms of Service. You hereby authorize Boondoggle to
              bill your payment instrument in advance on a periodic basis in
              accordance with the terms of the applicable payment plan until you
              terminate your account, and you further agree to pay any charges
              so incurred. YOU ACKNOWLEDGE AND AGREE THAT (A) SUBSCRIPTIONS WILL
              AUTOMATICALLY RENEW AND BOONDOGGLE (OR OUR PAYMENT PROCESSOR) IS
              AUTHORIZED TO CHARGE YOU ON A RECURRING BASIS (AS SPECIFIED IN
              YOUR PAYMENT PLAN) FOR AS LONG AS YOUR SUBSCRIPTION TO THE SERVICE
              CONTINUES AND (B) YOUR SUBSCRIPTION WILL CONTINUE UNTIL YOU OR WE
              ELECT NOT TO RENEW IT OR WE SUSPEND OR STOP PROVIDING ACCESS TO
              THE SERVICES. YOU MAY ELECT NOT TO RENEW YOUR SUBSCRIPTION AT ANY
              TIME BY EMAILING US AT TEAM@BOONDOGGLE.AI AND WE MAY ELECT NOT TO
              RENEW YOUR SUBSCRIPTION AT ANY TIME BY EMAILING YOU AT THE EMAIL
              ADDRESS YOU HAVE PROVIDED TO US; PROVIDED, THAT, NON-RENEWAL WILL
              BE EFFECTIVE AT THE END OF YOUR THEN-CURRENT SUBSCRIPTION AND NOT
              RESULT IN ANY REFUND OF PREPAID FEES.If you dispute any charges
              you must let Boondoggle know within sixty (60) days after the date
              that Boondoggle charges you. We reserve the right to change
              Boondoggle's prices. If Boondoggle does change prices, Boondoggle
              will provide notice of the change through the Service or in email
              to you, at Boondoggle's option, at least 30 days before the change
              is to take effect. Your continued use of the Service after the
              price change becomes effective constitutes your agreement to pay
              the changed amount. Boondoggle may choose to bill through an
              invoice, in which case, full payment for invoices issued in any
              given month must be received by Boondoggle thirty (30) days after
              the mailing date of the invoice, or the Services may be
              terminated. Unpaid invoices are subject to a finance charge of
              1.5% per month on any outstanding balance, or the maximum
              permitted by law, whichever is lower, plus all expenses of
              collection. You shall be responsible for all taxes associated with
              the Services other than U.S. taxes based on Boondoggle's net
              income.
              <br />
              <br />
              <br />
              Special Notice for International Use; Export Controls: Software
              (defined below) available in connection with the Service and the
              transmission of applicable data, if any, is subject to United
              States export controls. No Software may be downloaded from the
              Service or otherwise exported or re-exported in violation of U.S.
              export laws. Downloading or using the Software is at your sole
              risk. Recognizing the global nature of the Internet, you agree to
              comply with all local rules and laws regarding your use of the
              Service, including as it concerns online conduct and acceptable
              content.
              <br />
              <br />
              <br />
              Third Party Distribution Channels
              <br />
              <br />
              <br />
              Boondoggle offers Software applications that may be made available
              through the Apple App Store, Android Marketplace or other
              distribution channels ("Distribution Channels"). If you obtain
              such Software through a Distribution Channel, you may be subject
              to additional terms of the Distribution Channel. These Terms of
              Service are between you and us only, and not with the Distribution
              Channel. To the extent that you utilize any other third party
              products and services in connection with your use of our Services,
              you agree to comply with all applicable terms of any agreement for
              such third party products and services.
              <br />
              <br />
              <br />
              With respect to Software that is made available for your use in
              connection with an Apple-branded product (such Software,
              "Apple-Enabled Software"), in addition to the other terms and
              conditions set forth in these Terms of Service, the following
              terms and conditions apply:
              <br />
              <br />
              <br />
              Boondoggle and you acknowledge that these Terms of Service are
              concluded between Boondoggle and you only, and not with Apple Inc.
              ("Apple"), and that as between Boondoggle and Apple, Boondoggle,
              not Apple, is solely responsible for the Apple-Enabled Software
              and the content thereof.You may not use the Apple-Enabled Software
              in any manner that is in violation of or inconsistent with the
              Usage Rules set forth for Apple-Enabled Software in, or otherwise
              be in conflict with, the App Store Terms of Service.Your license
              to use the Apple-Enabled Software is limited to a non-transferable
              license to use the Apple-Enabled Software on an iOS Product that
              you own or control, as permitted by the Usage Rules set forth in
              the App Store Terms of Service.Apple has no obligation whatsoever
              to provide any maintenance or support services with respect to the
              Apple-Enabled Software.Apple is not responsible for any product
              warranties, whether express or implied by law. In the event of any
              failure of the Apple-Enabled Software to conform to any applicable
              warranty, you may notify Apple, and Apple will refund the purchase
              price for the Apple-Enabled Software to you, if any; and, to the
              maximum extent permitted by applicable law, Apple will have no
              other warranty obligation whatsoever with respect to the
              Apple-Enabled Software, or any other claims, losses, liabilities,
              damages, costs or expenses attributable to any failure to conform
              to any warranty, which will be Boondoggle's sole responsibility,
              to the extent it cannot be disclaimed under applicable
              law.Boondoggle and you acknowledge that Boondoggle, not Apple, is
              responsible for addressing any claims of you or any third party
              relating to the Apple-Enabled Software or your possession and/or
              use of that Apple-Enabled Software, including, but not limited to:
              (i) product liability claims; (ii) any claim that the
              Apple-Enabled Software fails to conform to any applicable legal or
              regulatory requirement; and (iii) claims arising under consumer
              protection or similar legislation.In the event of any third party
              claim that the Apple-Enabled Software or the end-user's possession
              and use of that Apple-Enabled Software infringes that third
              party's intellectual property rights, as between Boondoggle and
              Apple, Boondoggle, not Apple, will be solely responsible for the
              investigation, defense, settlement and discharge of any such
              intellectual property infringement claim.You represent and warrant
              that (i) you are not located in a country that is subject to a
              U.S. Government embargo, or that has been designated by the U.S.
              Government as a "terrorist supporting" country; and (ii) you are
              not listed on any U.S. Government list of prohibited or restricted
              parties.If you have any questions, complaints or claims with
              respect to the Apple-Enabled Software, they should be directed to
              Boondoggle as indicated on the Contact page.Boondoggle and you
              acknowledge and agree that Apple, and Apple's subsidiaries, are
              third party beneficiaries of these Terms of Service with respect
              to the Apple-Enabled Software, and that, upon your acceptance of
              the terms and conditions of these Terms of Service, Apple will
              have the right (and will be deemed to have accepted the right) to
              enforce these Terms of Service against you with respect to the
              Apple-Enabled Software as a third party beneficiary thereof.With
              respect to Software that you download from the Google Play Store
              (“Google-Sourced Software”), in addition to the other terms and
              conditions set forth in these Terms of Service, the following
              terms and conditions apply: (a) you acknowledge that these Terms
              of Service are between you and Boondoggle only, and not with
              Google, Inc. (“Google”); (b) your use of Google-Sourced Software
              must comply with Google's then-current Google Play Terms of
              Service; (c) Google is only a provider of Google Play where you
              obtained the Google-Sourced Software; (d) Boondoggle, and not
              Google, is solely responsible for Boondoggle's Google-Sourced
              Software; (e) Google has no obligation or liability to you with
              respect to Google-Sourced Software or these Terms of Service; and
              (f) you acknowledge and agree that Google is a third-party
              beneficiary to these Terms of Service as it relates to
              Boondoggle's Google-Sourced Software.
              <br />
              <br />
              <br />
              Intellectual Property Rights Service Content, Software and
              Trademarks: You acknowledge and agree that the Service may contain
              content or features ("Service Content") that are protected by
              copyright, patent, trademark, trade secret or other proprietary
              rights and laws. Additionally, the technology and software
              underlying the Service or distributed in connection therewith are
              the property of Boondoggle, our affiliates and our partners (the
              "Software"). Any use of the Service, Service Content or Software
              other than as specifically authorized herein or in the Acceptable
              Use Policy is strictly prohibited.
              <br />
              <br />
              <br />
              The Boondoggle name and logos are trademarks and service marks of
              Boondoggle (collectively the "Boondoggle Trademarks"). Other
              Boondoggle, product, and service names and logos used and
              displayed via the Service may be trademarks or service marks of
              their respective owners who may or may not endorse or be
              affiliated with or connected to Boondoggle. Nothing in this Terms
              of Service or the Service should be construed as granting, by
              implication, estoppel, or otherwise, any license or right to use
              any of Boondoggle Trademarks displayed on the Service, without our
              prior written permission in each instance. All goodwill generated
              from the use of Boondoggle Trademarks will inure to our exclusive
              benefit.
              <br />
              <br />
              <br />
              Third Party Material: Under no circumstances will Boondoggle be
              liable in any way for any content or materials of any third
              parties (including users), including, but not limited to, for any
              errors or omissions in any content, or for any loss or damage of
              any kind incurred as a result of the use of any such content. You
              acknowledge that Boondoggle does not pre-screen content, but that
              Boondoggle and its designees will have the right (but not the
              obligation) in their sole discretion to refuse or remove any
              content that is available via the Service. You agree that you must
              evaluate, and bear all risks associated with, the use of any
              content, including any reliance on the accuracy, completeness, or
              usefulness of such content.
              <br />
              <br />
              <br />
              User Content Transmitted Through the Service: With respect to the
              content or other materials you transmit through the Service or
              share with other users or recipients (collectively, "User
              Content"), you represent and warrant that you own all right, title
              and interest in and to such User Content, including, without
              limitation, all copyrights and rights of publicity contained
              therein. By transmitting any User Content through the Service, you
              hereby grant Boondoggle and its affiliated companies a license to
              perform the actions necessary to deliver User Content to the
              intended recipients. You also acknowledge and agree that User
              Content does not include any System Data. System Data is owned by
              Boondoggle. "System Data" means aggregated and anonymous user and
              other data regarding the Services that may be used to generate
              logs, statistics and reports regarding performance, availability,
              integrity and security of the Services. System Data does not
              include the contents, subject, senders, or recipients of emails
              you send or receive through the Service.
              <br />
              <br />
              <br />
              You acknowledge and agree that any questions, comments,
              suggestions, ideas, feedback or other information about the
              Service provided by you to Boondoggle ("Submissions"), and any
              User Content that you make available through the Service in a
              manner that allows other users of the Service and/or members of
              the general public not specified or identified by you to access
              your User Content ("Public User Content") are non-confidential and
              Boondoggle will be entitled to the unrestricted use and
              dissemination of these Submissions and Public User Content for any
              purpose, commercial or otherwise, without acknowledgment or
              compensation to you. You acknowledge and agree that any questions,
              comments, suggestions, ideas, feedback or other information about
              the Service provided by you to Boondoggle ("Submissions"), and any
              User Content that you make available through the Service in a
              manner that allows other users of the Service and/or members of
              the general public not specified or identified by you to access
              your User Content ("Public User Content") are non-confidential and
              Boondoggle will be entitled to the unrestricted use and
              dissemination of these Submissions and Public User Content for any
              purpose, commercial or otherwise, without acknowledgment or
              compensation to you. You acknowledge and agree that Boondoggle may
              preserve content and may also disclose content if required to do
              so by law or in the good faith belief that such preservation or
              disclosure is reasonably necessary to: (a) comply with legal
              process, applicable laws or government requests; (b) enforce these
              Terms of Service; (c) respond to claims that any content violates
              the rights of third parties; or (d) protect the rights, property,
              or personal safety of Boondoggle AI, its users and the public. You
              understand that the technical processing and transmission of the
              Service, including your content, may involve (a) transmissions
              over various networks; and (b) changes to conform and adapt to
              technical requirements of connecting networks or devices
              <br />
              <br />
              <br />
              Confidentiality
              <br />
              <br />
              <br />
              As used herein, “Confidential Information” means any information
              disclosed by either party that is marked or otherwise designated
              as confidential or proprietary or that should otherwise be
              reasonably understood to be confidential in light of the nature of
              the information and the circumstances surrounding disclosure.
              However, “Confidential Information” will not include any
              information which (a) is in the public domain through no fault of
              receiving party; (b) was properly known to receiving party,
              without restriction, prior to disclosure by the disclosing party;
              (c) was properly disclosed to receiving party, without
              restriction, by another person with the legal authority to do so;
              or (d) is independently developed by the receiving party without
              use of or reference to the disclosing party's Confidential
              Information. Each party agrees that it will use the Confidential
              Information of the other party solely in accordance with the
              provisions of these Terms of Service and it will not disclose the
              same to any third party without the other party's prior written
              consent, except as otherwise permitted hereunder. However, either
              party may disclose Confidential Information (i) to its employees
              and other representatives who have a need to know and are legally
              bound to keep such information confidential by confidentiality
              obligations consistent with those of these Terms of Service; and
              (ii) as required by law (in which case the receiving party will
              provide the disclosing party with prior written notification
              thereof, will provide the disclosing party with the opportunity to
              contest such disclosure, and will use its reasonable efforts to
              minimize such disclosure to the extent permitted by applicable
              law). Each party agrees to reasonable care in protecting the
              Confidential Information from unauthorized use and disclosure. In
              the event of actual or threatened breach of the provisions of this
              confidentiality section, the non-breaching party will be entitled
              to seek immediate injunctive and other equitable relief, without
              waiving any other rights or remedies available to it.
              <br />
              <br />
              <br />
              Third Party Services
              <br />
              <br />
              <br />
              The Service may provide, or third parties may provide, links or
              other access to other sites, services, products, and resources on
              the Internet ("Third Party Services"). Boondoggle has no control
              over such Third Party Services and Boondoggle is not responsible
              for and does not endorse such Third Party Services. You further
              acknowledge and agree that Boondoggle will not be responsible or
              liable, directly or indirectly, for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any content, events, goods or services available on or through
              any such Third Party Service. Any dealings you have with third
              parties found while using the Service are between you and the
              third party, and you agree that Boondoggle is not liable for any
              loss or claim that you may have against any such third party.
              <br />
              <br />
              <br />
              Personal Insights
              <br />
              <br />
              <br />
              Boondoggle may offer information about other individuals with whom
              you or, if applicable, your end users communicate by email or
              otherwise interact through the Service, including photographs, job
              titles/descriptions, and locations ("Personal Insights").
              Boondoggle relies on the individuals themselves and other third
              parties to create these Personal Insights. Accordingly, Boondoggle
              is not responsible for the accuracy, availability or reliability
              of any information, content, goods, data, opinions, advice or
              statements made available in connection with Personal Insights. As
              such, Boondoggle is not liable for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any such Personal Insights. Boondoggle enables Personal
              Insights merely as a convenience and the integration or inclusion
              of Personal Insights does not imply an endorsement or
              recommendation. You also acknowledge and agree that other
              Boondoggle users will have access to Personal Insights about you
              and, if applicable, your end users.
              <br />
              <br />
              <br />
              Indemnity
              <br />
              <br />
              <br />
              Indemnity by Boondoggle. If you have a Subscription for a Service,
              Boondoggle will defend you against any claim, demand, suit, or
              proceeding ("Claim") made or brought against you by a third party
              alleging that the use of that Service as permitted hereunder
              infringes or misappropriates a United States patent, copyright or
              trade secret and will indemnify you for any damages finally
              awarded against you (or any settlement approved by Boondoggle) in
              connection with any such Claim; provided that (a) you will
              promptly notify Boondoggle of such Claim, (b) Boondoggle will have
              the sole and exclusive authority to defend and/or settle any such
              Claim and (c) you reasonably cooperate with Boondoggle in
              connection therewith. If the use of the Service by you has become,
              or in Boondoggle’s opinion is likely to become, the subject of any
              claim of infringement, Boondoggle may at its option and expense
              (i) procure for you the right to continue using and receiving the
              Service as set forth hereunder; (ii) replace or modify the Service
              to make it non-infringing (with comparable functionality); or
              (iii) if the options in clauses (i) or (ii) are not reasonably
              practicable, terminate your Subscription to such Service and
              provide a pro rata refund of any prepaid Subscription fees
              corresponding to the terminated portion of the applicable
              Subscription term. Boondoggle will have no liability or obligation
              with respect to any Claim if such Claim is caused in whole or in
              part by (A) designs, guidelines, configurations, plans or
              specifications provided by you; (B) use of the Service by you not
              in accordance with these Terms of Service; (C) modification of the
              Service by or on behalf of you; (D) User Content, or (E) the
              combination, operation or use of the Service with other products
              or services where the Service would not by itself be infringing
              (clauses (A) through (E), “Excluded Claims”). This Section states
              Boondoggle’s sole and exclusive liability and obligation, and your
              exclusive remedy, for any claim of any nature related to
              infringement or misappropriation of intellectual property.
              <br />
              <br />
              <br />
              Indemnity by You. You will defend Boondoggle against any Claim
              made or brought against Boondoggle by a third party arising out of
              the Excluded Claims, and you will indemnify Boondoggle for any
              damages finally awarded against Boondoggle (or any settlement
              approved by Customer) in connection with any such Claim; provided
              that (a) Boondoggle will promptly notify you of such Claim, (b)
              you will have the sole and exclusive authority to defend and/or
              settle any such Claim and (c) Boondoggle reasonably cooperates
              with you in connection therewith.
              <br />
              <br />
              <br />
              Warranties and Disclaimers
              <br />
              <br />
              <br />
              Warranty by Boondoggle. Boondoggle warrants that any Service for
              which you have a Subscription will perform materially as described
              in the documentation provided by Boondoggle and Boondoggle will
              not materially decrease the overall functionality of that Service
              during the applicable Subscription term (the “Performance
              Warranty”). Boondoggle will use commercially reasonable efforts to
              correct a verified breach of the Performance Warranty reported by
              you. If Boondoggle fails to do so within 30 days after your
              warranty report, then either party may terminate the applicable
              Subscription as it relates to the non-conforming Service, in which
              case Boondoggle will refund to you any prepaid subscription fees
              for the terminated portion of the applicable Subscription term
              (for the Performance Warranty). To receive these remedies, you
              must report a breach of warranty in reasonable detail within 30
              days after discovering the issue in the Service or 30 days after
              delivery of the relevant support and training. These procedures
              are your exclusive remedies and Boondoggle’s sole liability for
              breach of the Performance Warranty or Support Warranty.
              <br />
              <br />
              <br />
              Warranty by You. You warrant that you have all rights necessary to
              provide any User Content or any other information, data or other
              materials that it provides hereunder, and to permit Boondoggle to
              use the same as contemplated hereunder.
              <br />
              <br />
              <br />
              DISCLAIMERS. EXCEPT AS EXPRESSLY SET FORTH HEREIN, YOUR USE OF THE
              SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS
              IS" AND "AS AVAILABLE" BASIS. BOONDOGGLE EXPRESSLY DISCLAIMS ALL
              WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY,
              INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND
              NON-INFRINGEMENT. BOONDOGGLE MAKES NO WARRANTY THAT (I) THE
              SERVICE WILL MEET YOUR REQUIREMENTS, (II) THE SERVICE WILL BE
              UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS
              THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE UNIQUE,
              ORIGINAL, ACCURATE OR RELIABLE, OR (IV) THE QUALITY OF ANY
              PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR
              OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
              <br />
              <br />
              <br />
              Limitation of Liability
              <br />
              <br />
              <br />
              EXCEPT FOR A PARTY'S INDEMNIFICATION OBLIGATIONS, BREACH OF THE
              ACCEPTABLE USE POLICY, OR AMOUNTS OWED BY YOU TO BOONDOGGLE UNDER
              THESE TERMS OF SERVICE, NEITHER PARTY WILL NOT BE LIABLE FOR (A)
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY
              DAMAGES, OR DAMAGES FOR LOSS OF PROFITS INCLUDING BUT NOT LIMITED
              TO, DAMAGES FOR LOSS OF GOODWILL, USE, DATA OR OTHER INTANGIBLE
              LOSSES (EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
              SUCH DAMAGES), WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT
              LIABILITY OR OTHERWISE, RESULTING FROM: (I) THE USE OR THE
              INABILITY TO USE THE SERVICE; (II) THE COST OF PROCUREMENT OF
              SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA,
              INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED
              OR TRANSACTIONS ENTERED INTO THROUGH OR FROM THE SERVICE; (III)
              UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR
              DATA; (IV) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE
              SERVICE; OR (V) ANY OTHER MATTER RELATING TO THE SERVICE OR (B)
              ANY AGGREGATE DAMAGES, LOSSES OR CAUSES OF ACTION EXCEED THE
              AMOUNT YOU HAVE PAID BOONDOGGLE IN THE LAST TWELVE (12) MONTHS,
              OR, IF GREATER, ONE HUNDRED DOLLARS ($100).
              <br />
              <br />
              <br />
              If you are using any Service without a Subscription to that
              Service, including free accounts, trial use and pre-release, alpha
              or beta versions or features (collectively, “No-Charge Products”),
              your use of No-Charge Products is subject to any additional terms
              that Boondoggle may specify. Boondoggle may modify or terminate
              your right to use No-Charge Products at any time. NOTWITHSTANDING
              ANYTHING TO THE CONTRARY, TO THE MAXIMUM EXTENT PERMITTED BY
              APPLICABLE LAW, BOONDOGGLE DISCLAIMS ALL OBLIGATIONS, WARRANTIES
              AND LIABILITIES WITH RESPECT TO NO-CHARGE PRODUCTS, INCLUDING ANY
              SERVICE LEVEL OR INDEMNITY OBLIGATIONS, AND BOONDOGGLE’S MAXIMUM
              AGGREGATE LIABILITY TO CUSTOMER IN RESPECT OF NO-CHARGE PRODUCTS
              WILL BE ONE HUNDRED DOLLARS ($100).
              <br />
              <br />
              <br />
              SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OR EXCLUSION OF
              CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR
              INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE
              ABOVE LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU OR BE
              ENFORCEABLE WITH RESPECT TO YOU. IF YOU ARE DISSATISFIED WITH ANY
              PORTION OF THE SERVICE OR WITH THESE TERMS OF SERVICE, YOUR SOLE
              AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SERVICE.
              <br />
              <br />
              <br />
              IF YOU ARE A USER FROM NEW JERSEY, THE FOREGOING SECTIONS TITLED
              “INDEMNITY”, "DISCLAIMER OF WARRANTIES" AND "LIMITATION OF
              LIABILITY" ARE INTENDED TO BE ONLY AS BROAD AS IS PERMITTED UNDER
              THE LAWS OF THE STATE OF NEW JERSEY. IF ANY PORTION OF THESE
              SECTIONS IS HELD TO BE INVALID UNDER THE LAWS OF THE STATE OF NEW
              JERSEY, THE INVALIDITY OF SUCH PORTION SHALL NOT AFFECT THE
              VALIDITY OF THE REMAINING PORTIONS OF THE APPLICABLE SECTIONS.
              <br />
              <br />
              <br />
              Dispute Resolution By Binding Arbitration: PLEASE READ THIS
              SECTION CAREFULLY AS IT AFFECTS YOUR RIGHTS.
              <br />
              <br />
              <br />
              a. Agreement to Arbitrate
              <br />
              <br />
              <br />
              This Dispute Resolution by Binding Arbitration section is referred
              to in this Terms of Service as the "Arbitration Agreement." You
              agree that any and all disputes or claims that have arisen or may
              arise between you and Boondoggle, whether arising out of or
              relating to this Terms of Service (including any alleged breach
              thereof), the Services, any advertising, any aspect of the
              relationship or transactions between us, shall be resolved
              exclusively through final and binding arbitration, rather than a
              court, in accordance with the terms of this Arbitration Agreement,
              except that you may assert individual claims in small claims
              court, if your claims qualify. Further, this Arbitration Agreement
              does not preclude you from bringing issues to the attention of
              federal, state, or local agencies, and such agencies can, if the
              law allows, seek relief against us on your behalf. You agree that,
              by entering into this Terms of Service, you and Boondoggle are
              each waiving the right to a trial by jury or to participate in a
              class action. Your rights will be determined by a neutral
              arbitrator, not a judge or jury. The Federal Arbitration Act
              governs the interpretation and enforcement of this Arbitration
              Agreement.
              <br />
              <br />
              <br />
              b. Prohibition of Class and Representative Actions and
              Non-Individualized Relief
              <br />
              <br />
              <br />
              YOU AND BOONDOGGLE AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST
              THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR
              CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR
              PROCEEDING. UNLESS BOTH YOU AND BOONDOGGLE AGREE OTHERWISE, THE
              ARBITRATOR MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON'S OR
              PARTY'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A
              CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING. ALSO, THE
              ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
              DECLARATORY RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL PARTY SEEKING
              RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE RELIEF
              NECESSITATED BY THAT PARTY'S INDIVIDUAL CLAIM(S), EXCEPT THAT YOU
              MAY PURSUE A CLAIM FOR AND THE ARBITRATOR MAY AWARD PUBLIC
              INJUNCTIVE RELIEF UNDER APPLICABLE LAW TO THE EXTENT REQUIRED FOR
              THE ENFORCEABILITY OF THIS PROVISION.
              <br />
              <br />
              <br />
              c. Pre-Arbitration Dispute Resolution
              <br />
              <br />
              <br />
              Boondoggle is always interested in resolving disputes amicably and
              efficiently, and most customer concerns can be resolved quickly
              and to the customer's satisfaction by emailing customer support at
              team@boondoggle.ai. If such efforts prove unsuccessful, a party
              who intends to seek arbitration must first send to the other, by
              certified mail, a written Notice of Dispute ("Notice"). The Notice
              to Boondoggle should be sent to the address listed on our Contact
              page ("Notice Address"). The Notice must (i) describe the nature
              and basis of the claim or dispute and (ii) set forth the specific
              relief sought. If Boondoggle and you do not resolve the claim
              within sixty (60) calendar days after the Notice is received, you
              or Boondoggle may commence an arbitration proceeding. During the
              arbitration, the amount of any settlement offer made by Boondoggle
              or you shall not be disclosed to the arbitrator until after the
              arbitrator determines the amount, if any, to which you or
              Boondoggle is entitled.
              <br />
              <br />
              <br />
              d. Arbitration Procedures
              <br />
              <br />
              <br />
              Arbitration will be conducted by a neutral arbitrator in
              accordance with the American Arbitration Association's ("AAA")
              rules and procedures, including the AAA's Consumer Arbitration
              Rules (collectively, the "AAA Rules"), as modified by this
              Arbitration Agreement. For information on the AAA, please visit
              its website, https://www.adr.org. Information about the AAA Rules
              and fees for consumer disputes can be found at the AAA's consumer
              arbitration page, https://go.adr.org/consumer-arbitration. If
              there is any inconsistency between any term of the AAA Rules and
              any term of this Arbitration Agreement, the applicable terms of
              this Arbitration Agreement will control unless the arbitrator
              determines that the application of the inconsistent Arbitration
              Agreement terms would not result in a fundamentally fair
              arbitration. The arbitrator must also follow the provisions of
              these Terms of Service as a court would. All issues are for the
              arbitrator to decide, including, but not limited to, issues
              relating to the scope, enforceability, and arbitrability of this
              Arbitration Agreement. Although arbitration proceedings are
              usually simpler and more streamlined than trials and other
              judicial proceedings, the arbitrator can award the same damages
              and relief on an individual basis that a court can award to an
              individual under the Terms of Service and applicable law.
              Decisions by the arbitrator are enforceable in court and may be
              overturned by a court only for very limited reasons.
              <br />
              <br />
              <br />
              Unless Boondoggle and you agree otherwise, any arbitration
              hearings will take place in a reasonably convenient location for
              both parties with due consideration of their ability to travel and
              other pertinent circumstances. If the parties are unable to agree
              on a location, the determination shall be made by AAA. If your
              claim is for $10,000 or less, Boondoggle agrees that you may
              choose whether the arbitration will be conducted solely on the
              basis of documents submitted to the arbitrator, through a
              telephonic hearing, or by an in-person hearing as established by
              the AAA Rules. If your claim exceeds $10,000, the right to a
              hearing will be determined by the AAA Rules. Regardless of the
              manner in which the arbitration is conducted, the arbitrator shall
              issue a reasoned written decision sufficient to explain the
              essential findings and conclusions on which the award is based.
              <br />
              <br />
              <br />
              e. Costs of Arbitration
              <br />
              <br />
              <br />
              Payment of all filing, administration, and arbitrator fees
              (collectively, the “Arbitration Fees”) will be governed by the AAA
              Rules, unless otherwise provided in this Arbitration Agreement. To
              the extent any Arbitration Fees are not specifically allocated to
              either Company or you under the AAA Rules, Company and you shall
              split them equally; provided that if you are able to demonstrate
              to the arbitrator that you are economically unable to pay your
              portion of such Arbitration Fees or if the arbitrator otherwise
              determines for any reason that you should not be required to pay
              your portion of any Arbitration Fees, Company will pay your
              portion of such fees. In addition, if you demonstrate to the
              arbitrator that the costs of arbitration will be prohibitive as
              compared to the costs of litigation, Company will pay as much of
              the Arbitration Fees as the arbitrator deems necessary to prevent
              the arbitration from being cost-prohibitive. Any payment of
              attorneys' fees will be governed by the AAA Rules.
              <br />
              <br />
              <br />
              f. Confidentiality of Arbitration
              <br />
              <br />
              <br />
              All aspects of the arbitration proceeding, and any ruling,
              decision, or award by the arbitrator, will be strictly
              confidential for the benefit of all parties.
              <br />
              <br />
              <br />
              g. Severability
              <br />
              <br />
              <br />
              If a court or the arbitrator decides that any term or provision of
              this Arbitration Agreement (other than the subsection (b) titled
              "Prohibition of Class and Representative Actions and
              Non-Individualized Relief" above) is invalid or unenforceable, the
              parties agree to replace such term or provision with a term or
              provision that is valid and enforceable and that comes closest to
              expressing the intention of the invalid or unenforceable term or
              provision, and this Arbitration Agreement shall be enforceable as
              so modified. If a court or the arbitrator decides that any of the
              provisions of subsection (b) above titled "Prohibition of Class
              and Representative Actions and Non-Individualized Relief" are
              invalid or unenforceable, then the entirety of this Arbitration
              Agreement shall be null and void, unless such provisions are
              deemed to be invalid or unenforceable solely with respect to
              claims for public injunctive relief. The remainder of the Terms of
              Service will continue to apply.
              <br />
              <br />
              <br />
              h. Future Changes to Arbitration Agreement
              <br />
              <br />
              <br />
              Notwithstanding any provision in this Terms of Service to the
              contrary, Boondoggle agrees that if it makes any future change to
              this Arbitration Agreement (other than a change to the Notice
              Address) while you are a user of the Services, you may reject any
              such change by sending Boondoggle written notice within thirty
              (30) calendar days of the change to the Notice Address provided
              above. By rejecting any future change, you are agreeing that you
              will arbitrate any dispute between us in accordance with the
              language of this Arbitration Agreement as of the date you first
              accepted these Terms of Service (or accepted any subsequent
              changes to these Terms of Service).
              <br />
              <br />
              <br />
              Termination
              <br />
              <br />
              <br />
              You agree that Boondoggle , in its sole discretion, may suspend or
              terminate your account (or any part thereof) or use of the Service
              and remove and discard any content within the Service, for any
              reason, including, without limitation, for lack of use or if
              Boondoggle believes that you have violated or acted inconsistently
              with the letter or spirit of these Terms of Service, provided that
              if you have a Subscription to a Service, subject to the
              Subscription non-renewal provisions above, Boondoggle may
              terminate your Subscription only if you commit a material breach
              of any terms or conditions of these Terms of Service and fail to
              remedy such breach within thirty (30) days after written notice of
              such breach. Any suspected fraudulent, abusive or illegal activity
              that may be grounds for termination of your use of Service, may be
              referred to appropriate law enforcement authorities.
              <br />
              <br />
              <br />
              In addition to the Subscription non-renewal provisions above, you
              may terminate a Subscription if Boondoggle’s teams commit a
              material breach of any terms or conditions of these Terms of
              Service with respect to such Subscription and fails to remedy such
              breach within thirty (30) days after written notice of such
              breach.
              <br />
              <br />
              <br />
              Upon non-renewal or termination of your account or any
              Subscription, any terms or conditions that by their nature should
              survive such termination will survive, including the terms and
              conditions relating to payment, proprietary rights and
              confidentiality, Service restrictions, disclaimers,
              indemnification, limitations of liability, termination, the
              Arbitration Agreement, and the general provisions below.
              <br />
              <br />
              <br />
              Modifications to these Terms of Service
              <br />
              <br />
              <br />
              Boondoggle may modify these Terms of Service as set forth above.
              Notwithstanding anything herein, in some cases (e.g., changes
              addressing new functions of the Services or changes made for legal
              reasons) we may specify that such modifications become effective
              immediately or on a set date. If you object to those modifications
              and have paid for a Subscription, and the effective modification
              date is during your then-current Subscription, then (as your
              exclusive remedy) you may terminate your then-current Subscription
              upon notice to us, and we will refund you any fees you have
              pre-paid for use of the affected Service for the terminated
              portion of the applicable Subscription term. To exercise this
              right, you must provide us with notice of your objection and
              termination within thirty (30) days of us providing notice of the
              modifications.
              <br />
              <br />
              <br />
              User Disputes
              <br />
              <br />
              <br />
              You agree that you are solely responsible for your interactions
              with any other user in connection with the Service and Boondoggle
              will have no liability or responsibility with respect thereto.
              Boondoggle reserves the right, but has no obligation, to become
              involved in any way with disputes between you and any other user
              of the Service.
              <br />
              <br />
              <br />
              General
              <br />
              <br />
              <br />
              These Terms of Service constitute the entire agreement between you
              and Boondoggle and govern your use of the Service, superseding any
              prior agreements between you and Boondoggle with respect to the
              Service. You also may be subject to additional terms and
              conditions that may apply when you use affiliate or third party
              services, third party content or third party software. These Terms
              of Service will be governed by the laws of the State of California
              without regard to its conflict of law provisions. With respect to
              any disputes or claims not subject to arbitration, as set forth
              above, you and Boondoggle agree to submit to the personal and
              exclusive jurisdiction of the state and federal courts located
              within San Francisco County, California. The failure of Boondoggle
              to exercise or enforce any right or provision of these Terms of
              Service will not constitute a waiver of such right or provision.
              If any provision of these Terms of Service is found by a court of
              competent jurisdiction to be invalid, the parties nevertheless
              agree that the court should endeavor to give effect to the
              parties' intentions as reflected in the provision, and the other
              provisions of these Terms of Service remain in full force and
              effect. You agree that regardless of any statute or law to the
              contrary, any claim or cause of action arising out of or related
              to use of the Service or these Terms of Service must be filed
              within one (1) year after such claim or cause of action arose or
              be forever barred. A printed version of this agreement and of any
              notice given in electronic form will be admissible in judicial or
              administrative proceedings based upon or relating to this
              agreement to the same extent and subject to the same conditions as
              other business documents and records originally generated and
              maintained in printed form. You may not assign this Terms of
              Service without the prior written consent of Boondoggle. As an
              exception to the foregoing, you may assign these Terms of Service
              in their entirety to your successor resulting from a merger,
              acquisition, or sale of all or substantially all of your assets;
              provided that you provide Boondoggle with prompt written notice of
              the assignment and the assignee agrees in writing to assume all of
              your obligations under these terms. Boondoggle may assign,
              sublicense, or transfer any or all of its rights and obligations
              under this Terms of Service without restriction. The section
              titles in these Terms of Service are for convenience only and have
              no legal or contractual effect. Notices to you may be made via
              either email or regular mail. The Service may also provide notices
              to you of changes to these Terms of Service or other matters by
              displaying notices or links to notices generally on the Service.
              <br />
              <br />
              <br />
              Notice for California Users
              <br />
              <br />
              <br />
              Under California Civil Code Section 1789.3, users of the Service
              from California are entitled to the following specific consumer
              rights notice: The Complaint Assistance Unit of the Division of
              Consumer Services of the California Department of Consumer Affairs
              may be contacted in writing at 1625 North Market Blvd., Suite N
              112, Sacramento, CA 95834, or by telephone at (916) 445-1254 or
              (800) 952-5210. You may contact us at the team@boondoggle.ai
              <br />
              <br />
              <br />
              Questions? Concerns? Suggestions?
              <br />
              <br />
              <br />
              Please contact us at team@boondoggle.ai to report any violations
              of these Terms of Service or to pose any questions regarding this
              Terms of Service or the Service.
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
              Terms of Service
            </span>
            <p className="privacy-text" style={{ fontSize: "16px" }}>
              Last Updated: February 12, 2024
              <br />
              <br />
              <br />
              Boondoggle Labs, Inc. ("Boondoggle," "we," "us," "our") provides
              its services (described below) through its website located at
              https://boondoggle.ai (the "Site") and through its applications
              and related services (collectively, such services, including any
              new features and applications, and the Site, the "Service(s)"),
              subject to the following Terms of Service (as amended from time to
              time, these "Terms of Service"). These Terms of Service are
              effective as of the date you and Boondoggle enter into an online
              order or you otherwise complete the online ordering flow on the
              Service (the “Effective Date”). If you are accepting these Terms
              of Service on behalf of your employer, organization or another
              entity (collectively, an “Entity”) (which will be deemed to the
              case if you sign up for a Service using an email address from such
              Entity), then you represent and warrant that (a) you have read and
              understand these Terms of Service, (b) you have full legal
              authority to bind such Entity to these Terms of Service and (c)
              you agree to these Terms of Service on behalf of such Entity. As
              used in the remainder of these Terms of Service, “You” means the
              Entity you represent in accepting these Terms of Service or, if
              that does not apply, you individually.
              <br />
              <br />
              <br />
              We reserve the right, at our sole discretion, to change or modify
              portions of these Terms of Service at any time. If we do this, we
              will post the changes on this page and will indicate at the top of
              this page the date these terms were last revised. We will also
              notify you, either through the Services user interface, in an
              email notification or through other reasonable means. Any such
              changes will become effective no earlier than fourteen (14) days
              after they are posted, provided that if you have paid for a
              subscription to a Service (“Subscription”), then with respect to
              that Service any such change will take effect at the next renewal
              of your Subscription, except as set forth below. Your continued
              use of the Service after the date any such changes become
              effective constitutes your acceptance of the new Terms of Service.
              <br />
              <br />
              <br />
              PLEASE READ THESE TERMS OF SERVICE CAREFULLY, AS THEY CONTAIN AN
              AGREEMENT TO ARBITRATE AND OTHER IMPORTANT INFORMATION REGARDING
              YOUR LEGAL RIGHTS, REMEDIES, AND OBLIGATIONS. THE AGREEMENT TO
              ARBITRATE REQUIRES (WITH LIMITED EXCEPTION) THAT YOU SUBMIT CLAIMS
              YOU HAVE AGAINST US TO BINDING AND FINAL ARBITRATION, AND FURTHER
              (1) YOU WILL ONLY BE PERMITTED TO PURSUE CLAIMS AGAINST BOONDOGGLE
              ON AN INDIVIDUAL BASIS, NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
              CLASS OR REPRESENTATIVE ACTION OR PROCEEDING, (2) YOU WILL ONLY BE
              PERMITTED TO SEEK RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
              DECLARATORY RELIEF) ON AN INDIVIDUAL BASIS, AND (3) YOU MAY NOT BE
              ABLE TO HAVE ANY CLAIMS YOU HAVE AGAINST US RESOLVED BY A JURY OR
              IN A COURT OF LAW.
              <br />
              <br />
              <br />
              In addition, when using certain services, you will be subject to
              additional terms applicable to such services that may be posted on
              the Service from time to time, including, without limitation, the
              Acceptable Use Policy located at
              https://boondoggle.ai/acceptable-use and Privacy Policy located at
              https://boondoggle.ai/privacy. All such terms are hereby
              incorporated by reference into these Terms of Service. If you are
              an individual, our Privacy Policy will apply to you and you
              consent to our collection and use of personal data as outlined
              therein, or if you are an Entity, our Privacy Policy will apply to
              your end users.
              <br />
              <br />
              <br />
              Access and Use of the Service
              <br />
              <br />
              <br />
              Services Description: The Service is designed to improve the email
              experience by making it faster and more intelligent.
              <br />
              <br />
              <br />
              Your Registration Obligations: You may be required to register
              with Boondoggle in order to access and use certain features of the
              Service. If you choose to register for the Service, you agree to
              provide and maintain true, accurate, current and complete
              information about yourself as prompted by the Service's
              registration form. Registration data and certain other information
              about you are governed by our Privacy Policy. If you are under 13
              years of age, you are not authorized to use the Service, with or
              without registering. In addition, if you are under 18 years old,
              you may use the Service, with or without registering, only with
              the approval of your parent or guardian. To the extent you are an
              Entity, you are responsible for obtaining and maintaining all
              required consents from your end users to allow Boondoggle to
              provide the Service to you and your end users.
              <br />
              <br />
              <br />
              Use of Google APIs: Boondoggle's use of information received from
              Google APIs will adhere to Google API Services User Data Policy,
              including the Limited Use requirements.
              <br />
              <br />
              <br />
              Security of your email: Boondoggle will implement appropriate
              technical and organizational measures to protect against
              accidental or unlawful destruction, loss, alteration, unauthorized
              disclosure of, or access to customer data. You agree (a) to
              immediately notify Boondoggle at team@boondoggle.ai of any breach
              of security or potential security issue you notice while using the
              Service; and (b) that Boondoggle is not responsible for any
              electronic communications and/or content (as defined below) which
              are lost, altered, intercepted or stored without authorization
              during the transmission of any data whatsoever across networks not
              owned and/or operated by Boondoggle. Boondoggle will not be liable
              for any loss or damage arising from your failure to comply with
              this Section.
              <br />
              <br />
              <br />
              Access to the Service: You are responsible for obtaining and
              maintaining any equipment and ancillary services needed to connect
              to, access or otherwise use the Service, including, without
              limitation, modems, hardware, server, software, operating system,
              networking, email servers, email services, web servers, web
              services, long distance and local telephone service (collectively,
              "Equipment"). You are responsible for ensuring that such Equipment
              and services are compatible with the Service (and, to the extent
              applicable, the Software (as defined below)) and complies with all
              configurations and specifications set forth in Boondoggle's
              published policies then in effect. In the event that you notice a
              failure or an issue that could cause a problem with the Boondoggle
              service, you agree to notify us at team@boondoggle.ai so that we
              can work to resolve the failure or issue.
              <br />
              <br />
              <br />
              General Practices Regarding Use and Storage: You acknowledge that
              Boondoggle may establish general practices and limits concerning
              use of the Service, including without limitation the maximum
              period of time that data or other content will be retained by the
              Service and the maximum storage space that will be allotted on
              Boondoggle's servers on your behalf. You agree that Boondoggle has
              no responsibility or liability for the deletion or failure to
              store any data or other content maintained or uploaded by the
              Service. You acknowledge that Boondoggle reserves the right to
              terminate accounts that are inactive for an extended period of
              time.
              <br />
              <br />
              <br />
              Mobile Services: The Service includes certain services that are
              available via a mobile device, including (i) the ability to upload
              content to the Service via a mobile device, (ii) the ability to
              browse the Service and the Site from a mobile device and (iii) the
              ability to access certain features through an application
              downloaded and installed on a mobile device (collectively, the
              "Mobile Services"). To the extent you access the Service through a
              mobile device, your wireless service carrier's standard charges,
              data rates and other fees may apply. In addition, downloading,
              installing, or using certain Mobile Services may be prohibited or
              restricted by your carrier, and not all Mobile Services may work
              with all carriers or devices.
              <br />
              <br />
              <br />
              Conditions of Use
              <br />
              <br />
              <br />
              User Conduct: You are solely responsible for all code, video,
              images, information, data, text, software, music, sound,
              photographs, graphics, messages or other materials ("content")
              that you upload, post, publish, display, transmit or email
              (collectively, "transmit") or otherwise use via the Service. You
              and your use of the Service (including use by your end users, if
              any) and your content must comply at all times with Boondoggle's
              Acceptable Use Policy.
              <br />
              <br />
              <br />
              Fees; Non-Renewal: To the extent the Service or any portion
              thereof is made available for any fee, you will be required to
              select a payment plan and provide Boondoggle information regarding
              your credit card or other payment instrument. You represent and
              warrant to Boondoggle that such information is true and that you
              are authorized to use the payment instrument. You will promptly
              update your account information with any changes (for example, a
              change in your billing address or credit card expiration date)
              that may occur. You agree to pay Boondoggle the amount that is
              specified in the payment plan in accordance with the terms of such
              plan and this Terms of Service. You hereby authorize Boondoggle to
              bill your payment instrument in advance on a periodic basis in
              accordance with the terms of the applicable payment plan until you
              terminate your account, and you further agree to pay any charges
              so incurred. YOU ACKNOWLEDGE AND AGREE THAT (A) SUBSCRIPTIONS WILL
              AUTOMATICALLY RENEW AND BOONDOGGLE (OR OUR PAYMENT PROCESSOR) IS
              AUTHORIZED TO CHARGE YOU ON A RECURRING BASIS (AS SPECIFIED IN
              YOUR PAYMENT PLAN) FOR AS LONG AS YOUR SUBSCRIPTION TO THE SERVICE
              CONTINUES AND (B) YOUR SUBSCRIPTION WILL CONTINUE UNTIL YOU OR WE
              ELECT NOT TO RENEW IT OR WE SUSPEND OR STOP PROVIDING ACCESS TO
              THE SERVICES. YOU MAY ELECT NOT TO RENEW YOUR SUBSCRIPTION AT ANY
              TIME BY EMAILING US AT TEAM@BOONDOGGLE.AI AND WE MAY ELECT NOT TO
              RENEW YOUR SUBSCRIPTION AT ANY TIME BY EMAILING YOU AT THE EMAIL
              ADDRESS YOU HAVE PROVIDED TO US; PROVIDED, THAT, NON-RENEWAL WILL
              BE EFFECTIVE AT THE END OF YOUR THEN-CURRENT SUBSCRIPTION AND NOT
              RESULT IN ANY REFUND OF PREPAID FEES.If you dispute any charges
              you must let Boondoggle know within sixty (60) days after the date
              that Boondoggle charges you. We reserve the right to change
              Boondoggle's prices. If Boondoggle does change prices, Boondoggle
              will provide notice of the change through the Service or in email
              to you, at Boondoggle's option, at least 30 days before the change
              is to take effect. Your continued use of the Service after the
              price change becomes effective constitutes your agreement to pay
              the changed amount. Boondoggle may choose to bill through an
              invoice, in which case, full payment for invoices issued in any
              given month must be received by Boondoggle thirty (30) days after
              the mailing date of the invoice, or the Services may be
              terminated. Unpaid invoices are subject to a finance charge of
              1.5% per month on any outstanding balance, or the maximum
              permitted by law, whichever is lower, plus all expenses of
              collection. You shall be responsible for all taxes associated with
              the Services other than U.S. taxes based on Boondoggle's net
              income.
              <br />
              <br />
              <br />
              Special Notice for International Use; Export Controls: Software
              (defined below) available in connection with the Service and the
              transmission of applicable data, if any, is subject to United
              States export controls. No Software may be downloaded from the
              Service or otherwise exported or re-exported in violation of U.S.
              export laws. Downloading or using the Software is at your sole
              risk. Recognizing the global nature of the Internet, you agree to
              comply with all local rules and laws regarding your use of the
              Service, including as it concerns online conduct and acceptable
              content.
              <br />
              <br />
              <br />
              Third Party Distribution Channels
              <br />
              <br />
              <br />
              Boondoggle offers Software applications that may be made available
              through the Apple App Store, Android Marketplace or other
              distribution channels ("Distribution Channels"). If you obtain
              such Software through a Distribution Channel, you may be subject
              to additional terms of the Distribution Channel. These Terms of
              Service are between you and us only, and not with the Distribution
              Channel. To the extent that you utilize any other third party
              products and services in connection with your use of our Services,
              you agree to comply with all applicable terms of any agreement for
              such third party products and services.
              <br />
              <br />
              <br />
              With respect to Software that is made available for your use in
              connection with an Apple-branded product (such Software,
              "Apple-Enabled Software"), in addition to the other terms and
              conditions set forth in these Terms of Service, the following
              terms and conditions apply:
              <br />
              <br />
              <br />
              Boondoggle and you acknowledge that these Terms of Service are
              concluded between Boondoggle and you only, and not with Apple Inc.
              ("Apple"), and that as between Boondoggle and Apple, Boondoggle,
              not Apple, is solely responsible for the Apple-Enabled Software
              and the content thereof.You may not use the Apple-Enabled Software
              in any manner that is in violation of or inconsistent with the
              Usage Rules set forth for Apple-Enabled Software in, or otherwise
              be in conflict with, the App Store Terms of Service.Your license
              to use the Apple-Enabled Software is limited to a non-transferable
              license to use the Apple-Enabled Software on an iOS Product that
              you own or control, as permitted by the Usage Rules set forth in
              the App Store Terms of Service.Apple has no obligation whatsoever
              to provide any maintenance or support services with respect to the
              Apple-Enabled Software.Apple is not responsible for any product
              warranties, whether express or implied by law. In the event of any
              failure of the Apple-Enabled Software to conform to any applicable
              warranty, you may notify Apple, and Apple will refund the purchase
              price for the Apple-Enabled Software to you, if any; and, to the
              maximum extent permitted by applicable law, Apple will have no
              other warranty obligation whatsoever with respect to the
              Apple-Enabled Software, or any other claims, losses, liabilities,
              damages, costs or expenses attributable to any failure to conform
              to any warranty, which will be Boondoggle's sole responsibility,
              to the extent it cannot be disclaimed under applicable
              law.Boondoggle and you acknowledge that Boondoggle, not Apple, is
              responsible for addressing any claims of you or any third party
              relating to the Apple-Enabled Software or your possession and/or
              use of that Apple-Enabled Software, including, but not limited to:
              (i) product liability claims; (ii) any claim that the
              Apple-Enabled Software fails to conform to any applicable legal or
              regulatory requirement; and (iii) claims arising under consumer
              protection or similar legislation.In the event of any third party
              claim that the Apple-Enabled Software or the end-user's possession
              and use of that Apple-Enabled Software infringes that third
              party's intellectual property rights, as between Boondoggle and
              Apple, Boondoggle, not Apple, will be solely responsible for the
              investigation, defense, settlement and discharge of any such
              intellectual property infringement claim.You represent and warrant
              that (i) you are not located in a country that is subject to a
              U.S. Government embargo, or that has been designated by the U.S.
              Government as a "terrorist supporting" country; and (ii) you are
              not listed on any U.S. Government list of prohibited or restricted
              parties.If you have any questions, complaints or claims with
              respect to the Apple-Enabled Software, they should be directed to
              Boondoggle as indicated on the Contact page.Boondoggle and you
              acknowledge and agree that Apple, and Apple's subsidiaries, are
              third party beneficiaries of these Terms of Service with respect
              to the Apple-Enabled Software, and that, upon your acceptance of
              the terms and conditions of these Terms of Service, Apple will
              have the right (and will be deemed to have accepted the right) to
              enforce these Terms of Service against you with respect to the
              Apple-Enabled Software as a third party beneficiary thereof.With
              respect to Software that you download from the Google Play Store
              (“Google-Sourced Software”), in addition to the other terms and
              conditions set forth in these Terms of Service, the following
              terms and conditions apply: (a) you acknowledge that these Terms
              of Service are between you and Boondoggle only, and not with
              Google, Inc. (“Google”); (b) your use of Google-Sourced Software
              must comply with Google's then-current Google Play Terms of
              Service; (c) Google is only a provider of Google Play where you
              obtained the Google-Sourced Software; (d) Boondoggle, and not
              Google, is solely responsible for Boondoggle's Google-Sourced
              Software; (e) Google has no obligation or liability to you with
              respect to Google-Sourced Software or these Terms of Service; and
              (f) you acknowledge and agree that Google is a third-party
              beneficiary to these Terms of Service as it relates to
              Boondoggle's Google-Sourced Software.
              <br />
              <br />
              <br />
              Intellectual Property Rights Service Content, Software and
              Trademarks: You acknowledge and agree that the Service may contain
              content or features ("Service Content") that are protected by
              copyright, patent, trademark, trade secret or other proprietary
              rights and laws. Additionally, the technology and software
              underlying the Service or distributed in connection therewith are
              the property of Boondoggle, our affiliates and our partners (the
              "Software"). Any use of the Service, Service Content or Software
              other than as specifically authorized herein or in the Acceptable
              Use Policy is strictly prohibited.
              <br />
              <br />
              <br />
              The Boondoggle name and logos are trademarks and service marks of
              Boondoggle (collectively the "Boondoggle Trademarks"). Other
              Boondoggle, product, and service names and logos used and
              displayed via the Service may be trademarks or service marks of
              their respective owners who may or may not endorse or be
              affiliated with or connected to Boondoggle. Nothing in this Terms
              of Service or the Service should be construed as granting, by
              implication, estoppel, or otherwise, any license or right to use
              any of Boondoggle Trademarks displayed on the Service, without our
              prior written permission in each instance. All goodwill generated
              from the use of Boondoggle Trademarks will inure to our exclusive
              benefit.
              <br />
              <br />
              <br />
              Third Party Material: Under no circumstances will Boondoggle be
              liable in any way for any content or materials of any third
              parties (including users), including, but not limited to, for any
              errors or omissions in any content, or for any loss or damage of
              any kind incurred as a result of the use of any such content. You
              acknowledge that Boondoggle does not pre-screen content, but that
              Boondoggle and its designees will have the right (but not the
              obligation) in their sole discretion to refuse or remove any
              content that is available via the Service. You agree that you must
              evaluate, and bear all risks associated with, the use of any
              content, including any reliance on the accuracy, completeness, or
              usefulness of such content.
              <br />
              <br />
              <br />
              User Content Transmitted Through the Service: With respect to the
              content or other materials you transmit through the Service or
              share with other users or recipients (collectively, "User
              Content"), you represent and warrant that you own all right, title
              and interest in and to such User Content, including, without
              limitation, all copyrights and rights of publicity contained
              therein. By transmitting any User Content through the Service, you
              hereby grant Boondoggle and its affiliated companies a license to
              perform the actions necessary to deliver User Content to the
              intended recipients. You also acknowledge and agree that User
              Content does not include any System Data. System Data is owned by
              Boondoggle. "System Data" means aggregated and anonymous user and
              other data regarding the Services that may be used to generate
              logs, statistics and reports regarding performance, availability,
              integrity and security of the Services. System Data does not
              include the contents, subject, senders, or recipients of emails
              you send or receive through the Service.
              <br />
              <br />
              <br />
              You acknowledge and agree that any questions, comments,
              suggestions, ideas, feedback or other information about the
              Service provided by you to Boondoggle ("Submissions"), and any
              User Content that you make available through the Service in a
              manner that allows other users of the Service and/or members of
              the general public not specified or identified by you to access
              your User Content ("Public User Content") are non-confidential and
              Boondoggle will be entitled to the unrestricted use and
              dissemination of these Submissions and Public User Content for any
              purpose, commercial or otherwise, without acknowledgment or
              compensation to you. You acknowledge and agree that any questions,
              comments, suggestions, ideas, feedback or other information about
              the Service provided by you to Boondoggle ("Submissions"), and any
              User Content that you make available through the Service in a
              manner that allows other users of the Service and/or members of
              the general public not specified or identified by you to access
              your User Content ("Public User Content") are non-confidential and
              Boondoggle will be entitled to the unrestricted use and
              dissemination of these Submissions and Public User Content for any
              purpose, commercial or otherwise, without acknowledgment or
              compensation to you. You acknowledge and agree that Boondoggle may
              preserve content and may also disclose content if required to do
              so by law or in the good faith belief that such preservation or
              disclosure is reasonably necessary to: (a) comply with legal
              process, applicable laws or government requests; (b) enforce these
              Terms of Service; (c) respond to claims that any content violates
              the rights of third parties; or (d) protect the rights, property,
              or personal safety of Boondoggle AI, its users and the public. You
              understand that the technical processing and transmission of the
              Service, including your content, may involve (a) transmissions
              over various networks; and (b) changes to conform and adapt to
              technical requirements of connecting networks or devices
              <br />
              <br />
              <br />
              Confidentiality
              <br />
              <br />
              <br />
              As used herein, “Confidential Information” means any information
              disclosed by either party that is marked or otherwise designated
              as confidential or proprietary or that should otherwise be
              reasonably understood to be confidential in light of the nature of
              the information and the circumstances surrounding disclosure.
              However, “Confidential Information” will not include any
              information which (a) is in the public domain through no fault of
              receiving party; (b) was properly known to receiving party,
              without restriction, prior to disclosure by the disclosing party;
              (c) was properly disclosed to receiving party, without
              restriction, by another person with the legal authority to do so;
              or (d) is independently developed by the receiving party without
              use of or reference to the disclosing party's Confidential
              Information. Each party agrees that it will use the Confidential
              Information of the other party solely in accordance with the
              provisions of these Terms of Service and it will not disclose the
              same to any third party without the other party's prior written
              consent, except as otherwise permitted hereunder. However, either
              party may disclose Confidential Information (i) to its employees
              and other representatives who have a need to know and are legally
              bound to keep such information confidential by confidentiality
              obligations consistent with those of these Terms of Service; and
              (ii) as required by law (in which case the receiving party will
              provide the disclosing party with prior written notification
              thereof, will provide the disclosing party with the opportunity to
              contest such disclosure, and will use its reasonable efforts to
              minimize such disclosure to the extent permitted by applicable
              law). Each party agrees to reasonable care in protecting the
              Confidential Information from unauthorized use and disclosure. In
              the event of actual or threatened breach of the provisions of this
              confidentiality section, the non-breaching party will be entitled
              to seek immediate injunctive and other equitable relief, without
              waiving any other rights or remedies available to it.
              <br />
              <br />
              <br />
              Third Party Services
              <br />
              <br />
              <br />
              The Service may provide, or third parties may provide, links or
              other access to other sites, services, products, and resources on
              the Internet ("Third Party Services"). Boondoggle has no control
              over such Third Party Services and Boondoggle is not responsible
              for and does not endorse such Third Party Services. You further
              acknowledge and agree that Boondoggle will not be responsible or
              liable, directly or indirectly, for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any content, events, goods or services available on or through
              any such Third Party Service. Any dealings you have with third
              parties found while using the Service are between you and the
              third party, and you agree that Boondoggle is not liable for any
              loss or claim that you may have against any such third party.
              <br />
              <br />
              <br />
              Personal Insights
              <br />
              <br />
              <br />
              Boondoggle may offer information about other individuals with whom
              you or, if applicable, your end users communicate by email or
              otherwise interact through the Service, including photographs, job
              titles/descriptions, and locations ("Personal Insights").
              Boondoggle relies on the individuals themselves and other third
              parties to create these Personal Insights. Accordingly, Boondoggle
              is not responsible for the accuracy, availability or reliability
              of any information, content, goods, data, opinions, advice or
              statements made available in connection with Personal Insights. As
              such, Boondoggle is not liable for any damage or loss caused or
              alleged to be caused by or in connection with use of or reliance
              on any such Personal Insights. Boondoggle enables Personal
              Insights merely as a convenience and the integration or inclusion
              of Personal Insights does not imply an endorsement or
              recommendation. You also acknowledge and agree that other
              Boondoggle users will have access to Personal Insights about you
              and, if applicable, your end users.
              <br />
              <br />
              <br />
              Indemnity
              <br />
              <br />
              <br />
              Indemnity by Boondoggle. If you have a Subscription for a Service,
              Boondoggle will defend you against any claim, demand, suit, or
              proceeding ("Claim") made or brought against you by a third party
              alleging that the use of that Service as permitted hereunder
              infringes or misappropriates a United States patent, copyright or
              trade secret and will indemnify you for any damages finally
              awarded against you (or any settlement approved by Boondoggle) in
              connection with any such Claim; provided that (a) you will
              promptly notify Boondoggle of such Claim, (b) Boondoggle will have
              the sole and exclusive authority to defend and/or settle any such
              Claim and (c) you reasonably cooperate with Boondoggle in
              connection therewith. If the use of the Service by you has become,
              or in Boondoggle’s opinion is likely to become, the subject of any
              claim of infringement, Boondoggle may at its option and expense
              (i) procure for you the right to continue using and receiving the
              Service as set forth hereunder; (ii) replace or modify the Service
              to make it non-infringing (with comparable functionality); or
              (iii) if the options in clauses (i) or (ii) are not reasonably
              practicable, terminate your Subscription to such Service and
              provide a pro rata refund of any prepaid Subscription fees
              corresponding to the terminated portion of the applicable
              Subscription term. Boondoggle will have no liability or obligation
              with respect to any Claim if such Claim is caused in whole or in
              part by (A) designs, guidelines, configurations, plans or
              specifications provided by you; (B) use of the Service by you not
              in accordance with these Terms of Service; (C) modification of the
              Service by or on behalf of you; (D) User Content, or (E) the
              combination, operation or use of the Service with other products
              or services where the Service would not by itself be infringing
              (clauses (A) through (E), “Excluded Claims”). This Section states
              Boondoggle’s sole and exclusive liability and obligation, and your
              exclusive remedy, for any claim of any nature related to
              infringement or misappropriation of intellectual property.
              <br />
              <br />
              <br />
              Indemnity by You. You will defend Boondoggle against any Claim
              made or brought against Boondoggle by a third party arising out of
              the Excluded Claims, and you will indemnify Boondoggle for any
              damages finally awarded against Boondoggle (or any settlement
              approved by Customer) in connection with any such Claim; provided
              that (a) Boondoggle will promptly notify you of such Claim, (b)
              you will have the sole and exclusive authority to defend and/or
              settle any such Claim and (c) Boondoggle reasonably cooperates
              with you in connection therewith.
              <br />
              <br />
              <br />
              Warranties and Disclaimers
              <br />
              <br />
              <br />
              Warranty by Boondoggle. Boondoggle warrants that any Service for
              which you have a Subscription will perform materially as described
              in the documentation provided by Boondoggle and Boondoggle will
              not materially decrease the overall functionality of that Service
              during the applicable Subscription term (the “Performance
              Warranty”). Boondoggle will use commercially reasonable efforts to
              correct a verified breach of the Performance Warranty reported by
              you. If Boondoggle fails to do so within 30 days after your
              warranty report, then either party may terminate the applicable
              Subscription as it relates to the non-conforming Service, in which
              case Boondoggle will refund to you any prepaid subscription fees
              for the terminated portion of the applicable Subscription term
              (for the Performance Warranty). To receive these remedies, you
              must report a breach of warranty in reasonable detail within 30
              days after discovering the issue in the Service or 30 days after
              delivery of the relevant support and training. These procedures
              are your exclusive remedies and Boondoggle’s sole liability for
              breach of the Performance Warranty or Support Warranty.
              <br />
              <br />
              <br />
              Warranty by You. You warrant that you have all rights necessary to
              provide any User Content or any other information, data or other
              materials that it provides hereunder, and to permit Boondoggle to
              use the same as contemplated hereunder.
              <br />
              <br />
              <br />
              DISCLAIMERS. EXCEPT AS EXPRESSLY SET FORTH HEREIN, YOUR USE OF THE
              SERVICE IS AT YOUR SOLE RISK. THE SERVICE IS PROVIDED ON AN "AS
              IS" AND "AS AVAILABLE" BASIS. BOONDOGGLE EXPRESSLY DISCLAIMS ALL
              WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED OR STATUTORY,
              INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND
              NON-INFRINGEMENT. BOONDOGGLE MAKES NO WARRANTY THAT (I) THE
              SERVICE WILL MEET YOUR REQUIREMENTS, (II) THE SERVICE WILL BE
              UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, (III) THE RESULTS
              THAT MAY BE OBTAINED FROM THE USE OF THE SERVICE WILL BE UNIQUE,
              ORIGINAL, ACCURATE OR RELIABLE, OR (IV) THE QUALITY OF ANY
              PRODUCTS, SERVICES, INFORMATION, OR OTHER MATERIAL PURCHASED OR
              OBTAINED BY YOU THROUGH THE SERVICE WILL MEET YOUR EXPECTATIONS.
              <br />
              <br />
              <br />
              Limitation of Liability
              <br />
              <br />
              <br />
              EXCEPT FOR A PARTY'S INDEMNIFICATION OBLIGATIONS, BREACH OF THE
              ACCEPTABLE USE POLICY, OR AMOUNTS OWED BY YOU TO BOONDOGGLE UNDER
              THESE TERMS OF SERVICE, NEITHER PARTY WILL NOT BE LIABLE FOR (A)
              ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY
              DAMAGES, OR DAMAGES FOR LOSS OF PROFITS INCLUDING BUT NOT LIMITED
              TO, DAMAGES FOR LOSS OF GOODWILL, USE, DATA OR OTHER INTANGIBLE
              LOSSES (EVEN IF SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
              SUCH DAMAGES), WHETHER BASED ON CONTRACT, TORT, NEGLIGENCE, STRICT
              LIABILITY OR OTHERWISE, RESULTING FROM: (I) THE USE OR THE
              INABILITY TO USE THE SERVICE; (II) THE COST OF PROCUREMENT OF
              SUBSTITUTE GOODS AND SERVICES RESULTING FROM ANY GOODS, DATA,
              INFORMATION OR SERVICES PURCHASED OR OBTAINED OR MESSAGES RECEIVED
              OR TRANSACTIONS ENTERED INTO THROUGH OR FROM THE SERVICE; (III)
              UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR
              DATA; (IV) STATEMENTS OR CONDUCT OF ANY THIRD PARTY ON THE
              SERVICE; OR (V) ANY OTHER MATTER RELATING TO THE SERVICE OR (B)
              ANY AGGREGATE DAMAGES, LOSSES OR CAUSES OF ACTION EXCEED THE
              AMOUNT YOU HAVE PAID BOONDOGGLE IN THE LAST TWELVE (12) MONTHS,
              OR, IF GREATER, ONE HUNDRED DOLLARS ($100).
              <br />
              <br />
              <br />
              If you are using any Service without a Subscription to that
              Service, including free accounts, trial use and pre-release, alpha
              or beta versions or features (collectively, “No-Charge Products”),
              your use of No-Charge Products is subject to any additional terms
              that Boondoggle may specify. Boondoggle may modify or terminate
              your right to use No-Charge Products at any time. NOTWITHSTANDING
              ANYTHING TO THE CONTRARY, TO THE MAXIMUM EXTENT PERMITTED BY
              APPLICABLE LAW, BOONDOGGLE DISCLAIMS ALL OBLIGATIONS, WARRANTIES
              AND LIABILITIES WITH RESPECT TO NO-CHARGE PRODUCTS, INCLUDING ANY
              SERVICE LEVEL OR INDEMNITY OBLIGATIONS, AND BOONDOGGLE’S MAXIMUM
              AGGREGATE LIABILITY TO CUSTOMER IN RESPECT OF NO-CHARGE PRODUCTS
              WILL BE ONE HUNDRED DOLLARS ($100).
              <br />
              <br />
              <br />
              SOME JURISDICTIONS DO NOT ALLOW THE DISCLAIMER OR EXCLUSION OF
              CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF LIABILITY FOR
              INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE
              ABOVE LIMITATIONS SET FORTH ABOVE MAY NOT APPLY TO YOU OR BE
              ENFORCEABLE WITH RESPECT TO YOU. IF YOU ARE DISSATISFIED WITH ANY
              PORTION OF THE SERVICE OR WITH THESE TERMS OF SERVICE, YOUR SOLE
              AND EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SERVICE.
              <br />
              <br />
              <br />
              IF YOU ARE A USER FROM NEW JERSEY, THE FOREGOING SECTIONS TITLED
              “INDEMNITY”, "DISCLAIMER OF WARRANTIES" AND "LIMITATION OF
              LIABILITY" ARE INTENDED TO BE ONLY AS BROAD AS IS PERMITTED UNDER
              THE LAWS OF THE STATE OF NEW JERSEY. IF ANY PORTION OF THESE
              SECTIONS IS HELD TO BE INVALID UNDER THE LAWS OF THE STATE OF NEW
              JERSEY, THE INVALIDITY OF SUCH PORTION SHALL NOT AFFECT THE
              VALIDITY OF THE REMAINING PORTIONS OF THE APPLICABLE SECTIONS.
              <br />
              <br />
              <br />
              Dispute Resolution By Binding Arbitration: PLEASE READ THIS
              SECTION CAREFULLY AS IT AFFECTS YOUR RIGHTS.
              <br />
              <br />
              <br />
              a. Agreement to Arbitrate
              <br />
              <br />
              <br />
              This Dispute Resolution by Binding Arbitration section is referred
              to in this Terms of Service as the "Arbitration Agreement." You
              agree that any and all disputes or claims that have arisen or may
              arise between you and Boondoggle, whether arising out of or
              relating to this Terms of Service (including any alleged breach
              thereof), the Services, any advertising, any aspect of the
              relationship or transactions between us, shall be resolved
              exclusively through final and binding arbitration, rather than a
              court, in accordance with the terms of this Arbitration Agreement,
              except that you may assert individual claims in small claims
              court, if your claims qualify. Further, this Arbitration Agreement
              does not preclude you from bringing issues to the attention of
              federal, state, or local agencies, and such agencies can, if the
              law allows, seek relief against us on your behalf. You agree that,
              by entering into this Terms of Service, you and Boondoggle are
              each waiving the right to a trial by jury or to participate in a
              class action. Your rights will be determined by a neutral
              arbitrator, not a judge or jury. The Federal Arbitration Act
              governs the interpretation and enforcement of this Arbitration
              Agreement.
              <br />
              <br />
              <br />
              b. Prohibition of Class and Representative Actions and
              Non-Individualized Relief
              <br />
              <br />
              <br />
              YOU AND BOONDOGGLE AGREE THAT EACH OF US MAY BRING CLAIMS AGAINST
              THE OTHER ONLY ON AN INDIVIDUAL BASIS AND NOT AS A PLAINTIFF OR
              CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE ACTION OR
              PROCEEDING. UNLESS BOTH YOU AND BOONDOGGLE AGREE OTHERWISE, THE
              ARBITRATOR MAY NOT CONSOLIDATE OR JOIN MORE THAN ONE PERSON'S OR
              PARTY'S CLAIMS AND MAY NOT OTHERWISE PRESIDE OVER ANY FORM OF A
              CONSOLIDATED, REPRESENTATIVE, OR CLASS PROCEEDING. ALSO, THE
              ARBITRATOR MAY AWARD RELIEF (INCLUDING MONETARY, INJUNCTIVE, AND
              DECLARATORY RELIEF) ONLY IN FAVOR OF THE INDIVIDUAL PARTY SEEKING
              RELIEF AND ONLY TO THE EXTENT NECESSARY TO PROVIDE RELIEF
              NECESSITATED BY THAT PARTY'S INDIVIDUAL CLAIM(S), EXCEPT THAT YOU
              MAY PURSUE A CLAIM FOR AND THE ARBITRATOR MAY AWARD PUBLIC
              INJUNCTIVE RELIEF UNDER APPLICABLE LAW TO THE EXTENT REQUIRED FOR
              THE ENFORCEABILITY OF THIS PROVISION.
              <br />
              <br />
              <br />
              c. Pre-Arbitration Dispute Resolution
              <br />
              <br />
              <br />
              Boondoggle is always interested in resolving disputes amicably and
              efficiently, and most customer concerns can be resolved quickly
              and to the customer's satisfaction by emailing customer support at
              team@boondoggle.ai. If such efforts prove unsuccessful, a party
              who intends to seek arbitration must first send to the other, by
              certified mail, a written Notice of Dispute ("Notice"). The Notice
              to Boondoggle should be sent to the address listed on our Contact
              page ("Notice Address"). The Notice must (i) describe the nature
              and basis of the claim or dispute and (ii) set forth the specific
              relief sought. If Boondoggle and you do not resolve the claim
              within sixty (60) calendar days after the Notice is received, you
              or Boondoggle may commence an arbitration proceeding. During the
              arbitration, the amount of any settlement offer made by Boondoggle
              or you shall not be disclosed to the arbitrator until after the
              arbitrator determines the amount, if any, to which you or
              Boondoggle is entitled.
              <br />
              <br />
              <br />
              d. Arbitration Procedures
              <br />
              <br />
              <br />
              Arbitration will be conducted by a neutral arbitrator in
              accordance with the American Arbitration Association's ("AAA")
              rules and procedures, including the AAA's Consumer Arbitration
              Rules (collectively, the "AAA Rules"), as modified by this
              Arbitration Agreement. For information on the AAA, please visit
              its website, https://www.adr.org. Information about the AAA Rules
              and fees for consumer disputes can be found at the AAA's consumer
              arbitration page, https://go.adr.org/consumer-arbitration. If
              there is any inconsistency between any term of the AAA Rules and
              any term of this Arbitration Agreement, the applicable terms of
              this Arbitration Agreement will control unless the arbitrator
              determines that the application of the inconsistent Arbitration
              Agreement terms would not result in a fundamentally fair
              arbitration. The arbitrator must also follow the provisions of
              these Terms of Service as a court would. All issues are for the
              arbitrator to decide, including, but not limited to, issues
              relating to the scope, enforceability, and arbitrability of this
              Arbitration Agreement. Although arbitration proceedings are
              usually simpler and more streamlined than trials and other
              judicial proceedings, the arbitrator can award the same damages
              and relief on an individual basis that a court can award to an
              individual under the Terms of Service and applicable law.
              Decisions by the arbitrator are enforceable in court and may be
              overturned by a court only for very limited reasons.
              <br />
              <br />
              <br />
              Unless Boondoggle and you agree otherwise, any arbitration
              hearings will take place in a reasonably convenient location for
              both parties with due consideration of their ability to travel and
              other pertinent circumstances. If the parties are unable to agree
              on a location, the determination shall be made by AAA. If your
              claim is for $10,000 or less, Boondoggle agrees that you may
              choose whether the arbitration will be conducted solely on the
              basis of documents submitted to the arbitrator, through a
              telephonic hearing, or by an in-person hearing as established by
              the AAA Rules. If your claim exceeds $10,000, the right to a
              hearing will be determined by the AAA Rules. Regardless of the
              manner in which the arbitration is conducted, the arbitrator shall
              issue a reasoned written decision sufficient to explain the
              essential findings and conclusions on which the award is based.
              <br />
              <br />
              <br />
              e. Costs of Arbitration
              <br />
              <br />
              <br />
              Payment of all filing, administration, and arbitrator fees
              (collectively, the “Arbitration Fees”) will be governed by the AAA
              Rules, unless otherwise provided in this Arbitration Agreement. To
              the extent any Arbitration Fees are not specifically allocated to
              either Company or you under the AAA Rules, Company and you shall
              split them equally; provided that if you are able to demonstrate
              to the arbitrator that you are economically unable to pay your
              portion of such Arbitration Fees or if the arbitrator otherwise
              determines for any reason that you should not be required to pay
              your portion of any Arbitration Fees, Company will pay your
              portion of such fees. In addition, if you demonstrate to the
              arbitrator that the costs of arbitration will be prohibitive as
              compared to the costs of litigation, Company will pay as much of
              the Arbitration Fees as the arbitrator deems necessary to prevent
              the arbitration from being cost-prohibitive. Any payment of
              attorneys' fees will be governed by the AAA Rules.
              <br />
              <br />
              <br />
              f. Confidentiality of Arbitration
              <br />
              <br />
              <br />
              All aspects of the arbitration proceeding, and any ruling,
              decision, or award by the arbitrator, will be strictly
              confidential for the benefit of all parties.
              <br />
              <br />
              <br />
              g. Severability
              <br />
              <br />
              <br />
              If a court or the arbitrator decides that any term or provision of
              this Arbitration Agreement (other than the subsection (b) titled
              "Prohibition of Class and Representative Actions and
              Non-Individualized Relief" above) is invalid or unenforceable, the
              parties agree to replace such term or provision with a term or
              provision that is valid and enforceable and that comes closest to
              expressing the intention of the invalid or unenforceable term or
              provision, and this Arbitration Agreement shall be enforceable as
              so modified. If a court or the arbitrator decides that any of the
              provisions of subsection (b) above titled "Prohibition of Class
              and Representative Actions and Non-Individualized Relief" are
              invalid or unenforceable, then the entirety of this Arbitration
              Agreement shall be null and void, unless such provisions are
              deemed to be invalid or unenforceable solely with respect to
              claims for public injunctive relief. The remainder of the Terms of
              Service will continue to apply.
              <br />
              <br />
              <br />
              h. Future Changes to Arbitration Agreement
              <br />
              <br />
              <br />
              Notwithstanding any provision in this Terms of Service to the
              contrary, Boondoggle agrees that if it makes any future change to
              this Arbitration Agreement (other than a change to the Notice
              Address) while you are a user of the Services, you may reject any
              such change by sending Boondoggle written notice within thirty
              (30) calendar days of the change to the Notice Address provided
              above. By rejecting any future change, you are agreeing that you
              will arbitrate any dispute between us in accordance with the
              language of this Arbitration Agreement as of the date you first
              accepted these Terms of Service (or accepted any subsequent
              changes to these Terms of Service).
              <br />
              <br />
              <br />
              Termination
              <br />
              <br />
              <br />
              You agree that Boondoggle , in its sole discretion, may suspend or
              terminate your account (or any part thereof) or use of the Service
              and remove and discard any content within the Service, for any
              reason, including, without limitation, for lack of use or if
              Boondoggle believes that you have violated or acted inconsistently
              with the letter or spirit of these Terms of Service, provided that
              if you have a Subscription to a Service, subject to the
              Subscription non-renewal provisions above, Boondoggle may
              terminate your Subscription only if you commit a material breach
              of any terms or conditions of these Terms of Service and fail to
              remedy such breach within thirty (30) days after written notice of
              such breach. Any suspected fraudulent, abusive or illegal activity
              that may be grounds for termination of your use of Service, may be
              referred to appropriate law enforcement authorities.
              <br />
              <br />
              <br />
              In addition to the Subscription non-renewal provisions above, you
              may terminate a Subscription if Boondoggle’s teams commit a
              material breach of any terms or conditions of these Terms of
              Service with respect to such Subscription and fails to remedy such
              breach within thirty (30) days after written notice of such
              breach.
              <br />
              <br />
              <br />
              Upon non-renewal or termination of your account or any
              Subscription, any terms or conditions that by their nature should
              survive such termination will survive, including the terms and
              conditions relating to payment, proprietary rights and
              confidentiality, Service restrictions, disclaimers,
              indemnification, limitations of liability, termination, the
              Arbitration Agreement, and the general provisions below.
              <br />
              <br />
              <br />
              Modifications to these Terms of Service
              <br />
              <br />
              <br />
              Boondoggle may modify these Terms of Service as set forth above.
              Notwithstanding anything herein, in some cases (e.g., changes
              addressing new functions of the Services or changes made for legal
              reasons) we may specify that such modifications become effective
              immediately or on a set date. If you object to those modifications
              and have paid for a Subscription, and the effective modification
              date is during your then-current Subscription, then (as your
              exclusive remedy) you may terminate your then-current Subscription
              upon notice to us, and we will refund you any fees you have
              pre-paid for use of the affected Service for the terminated
              portion of the applicable Subscription term. To exercise this
              right, you must provide us with notice of your objection and
              termination within thirty (30) days of us providing notice of the
              modifications.
              <br />
              <br />
              <br />
              User Disputes
              <br />
              <br />
              <br />
              You agree that you are solely responsible for your interactions
              with any other user in connection with the Service and Boondoggle
              will have no liability or responsibility with respect thereto.
              Boondoggle reserves the right, but has no obligation, to become
              involved in any way with disputes between you and any other user
              of the Service.
              <br />
              <br />
              <br />
              General
              <br />
              <br />
              <br />
              These Terms of Service constitute the entire agreement between you
              and Boondoggle and govern your use of the Service, superseding any
              prior agreements between you and Boondoggle with respect to the
              Service. You also may be subject to additional terms and
              conditions that may apply when you use affiliate or third party
              services, third party content or third party software. These Terms
              of Service will be governed by the laws of the State of California
              without regard to its conflict of law provisions. With respect to
              any disputes or claims not subject to arbitration, as set forth
              above, you and Boondoggle agree to submit to the personal and
              exclusive jurisdiction of the state and federal courts located
              within San Francisco County, California. The failure of Boondoggle
              to exercise or enforce any right or provision of these Terms of
              Service will not constitute a waiver of such right or provision.
              If any provision of these Terms of Service is found by a court of
              competent jurisdiction to be invalid, the parties nevertheless
              agree that the court should endeavor to give effect to the
              parties' intentions as reflected in the provision, and the other
              provisions of these Terms of Service remain in full force and
              effect. You agree that regardless of any statute or law to the
              contrary, any claim or cause of action arising out of or related
              to use of the Service or these Terms of Service must be filed
              within one (1) year after such claim or cause of action arose or
              be forever barred. A printed version of this agreement and of any
              notice given in electronic form will be admissible in judicial or
              administrative proceedings based upon or relating to this
              agreement to the same extent and subject to the same conditions as
              other business documents and records originally generated and
              maintained in printed form. You may not assign this Terms of
              Service without the prior written consent of Boondoggle. As an
              exception to the foregoing, you may assign these Terms of Service
              in their entirety to your successor resulting from a merger,
              acquisition, or sale of all or substantially all of your assets;
              provided that you provide Boondoggle with prompt written notice of
              the assignment and the assignee agrees in writing to assume all of
              your obligations under these terms. Boondoggle may assign,
              sublicense, or transfer any or all of its rights and obligations
              under this Terms of Service without restriction. The section
              titles in these Terms of Service are for convenience only and have
              no legal or contractual effect. Notices to you may be made via
              either email or regular mail. The Service may also provide notices
              to you of changes to these Terms of Service or other matters by
              displaying notices or links to notices generally on the Service.
              <br />
              <br />
              <br />
              Notice for California Users
              <br />
              <br />
              <br />
              Under California Civil Code Section 1789.3, users of the Service
              from California are entitled to the following specific consumer
              rights notice: The Complaint Assistance Unit of the Division of
              Consumer Services of the California Department of Consumer Affairs
              may be contacted in writing at 1625 North Market Blvd., Suite N
              112, Sacramento, CA 95834, or by telephone at (916) 445-1254 or
              (800) 952-5210. You may contact us at the team@boondoggle.ai
              <br />
              <br />
              <br />
              Questions? Concerns? Suggestions?
              <br />
              <br />
              <br />
              Please contact us at team@boondoggle.ai to report any violations
              of these Terms of Service or to pose any questions regarding this
              Terms of Service or the Service.
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

export default Terms;
