/*global chrome*/
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar/Sidebar";
import LoadingOverlay from "react-loading-overlay";
import hubspot from "../assets/landing/integrations/crm_svg/hubspot.svg";
import { Button, Card, Badge, Select, SelectItem } from "@tremor/react";
import {
  RiMailLine,
  RiTwitterFill,
  RiAddLine,
  RiLinkedinBoxFill,
  RiAlignJustify,
  RiCheckLine,
} from "@remixicon/react";
import { createPineconeIndexes } from "../functions/crm_entries";
import {
  TextAnalyticsClient,
  AzureKeyCredential,
} from "@azure/ai-text-analytics";

function NewHome(props) {
  const navigation = useNavigate();
  const [linkedInLinked, setLinkedInLinked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableIntegrations, setAvailableIntegrations] = useState([]);
  const [crmType, setCRMType] = useState("");

  const client = new TextAnalyticsClient(
    "https://boondoggle.cognitiveservices.azure.com/",
    new AzureKeyCredential("a1c815a1e18c4373a07ef8f627438e53")
  );

  async function connectEmail() {
    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];
    const { data, error } = await props.db.functions.invoke("email-auth", {
      body: { source: urlWithoutParams },
    });
    window.open(data.url, "_self");
  }

  const ImageAsIcon = ({ src, alt }) => {
    return (
      <div style={{ display: "inline-block" }}>
        <img
          src={src}
          alt={alt}
          style={{ width: "24px", height: "24px", display: "inline-block" }}
        />
      </div>
    );
  };

  async function getEmails() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const currentUrl = window.location.href;
    const urlWithoutParams = currentUrl.split("?")[0];

    const { data, error } = await props.db.functions.invoke("email-callback", {
      body: { code: code, source: urlWithoutParams },
    });

    if (error == null) {
      localStorage.setItem("email_grant_id", data.id);

      const uid = localStorage.getItem("uid");

      await props.db
        .from("users")
        .update({
          email_grant_id: data.id,
          connected_email: data.email,
        })
        .eq("id", uid);

      setIsLoading(false);
      var cleanUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  async function linkWithTwitter() {
    const url = window.location.href;
    const { data, error } = await props.db.functions.invoke("twitter-login-3", {
      body: { url },
    });
    localStorage.setItem("oauth_token", data.url.oauth_token);
    localStorage.setItem("oauth_secret", data.url.oauth_token_secret);
    window.open(data.url.url, "_self");
  }

  async function captureOauthVerifier() {
    setIsLoading(true);
    const urlParams = new URLSearchParams(window.location.search);
    const oauthVerifier = urlParams.get("oauth_verifier");

    // Now oauthVerifier contains the value of oauth_verifier parameter
    const token = localStorage.getItem("oauth_token");
    const secret = localStorage.getItem("oauth_secret");
    localStorage.setItem("oauth_verifier", oauthVerifier);
    const twitterInfo = {
      oauthVerifier: oauthVerifier,
      token: token,
      secret: secret,
    };
    const uid = localStorage.getItem("uid");
    await props.db
      .from("users")
      .update({
        twitter_info: twitterInfo,
      })
      .eq("id", uid);

    setIsLoading(false);
    // const { data, error } = await props.db.functions.invoke("get-twitter-dms", {
    //   body: { token: token, secret: secret, oauthVerifier: oauthVerifier },
    // });
    // if (data) {
    //   await updateCRM(data);
    // }
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);

    async function getEmailData() {
      await getEmails();
    }

    async function getTwitterData() {
      await captureOauthVerifier();
    }

    async function azureTest() {
      const client = new TextAnalyticsClient(
        "https://boondoggle.cognitiveservices.azure.com/",
        new AzureKeyCredential("a1c815a1e18c4373a07ef8f627438e53")
      );

      const documents = [
        "Microsoft moved its headquarters to Bellevue, Washington in January 1979.",
        "Steve Ballmer stepped down as CEO of Microsoft and was succeeded by Satya Nadella.",
      ];

      const results = await client.analyzeSentiment(documents);

      console.log("RESULTS", results);
    }

    azureTest();

    async function getCRMIntegrations() {
      const workspace_id = "65c02dbec9810ed1f215c33b";
      const integrations = await (
        await fetch(
          `https://api.unified.to/unified/integration/workspace/${workspace_id}?summary=true&active=true&`
        )
      ).json();
      console.log("Integrations", integrations);
      let integrationData = [];
      await Promise.all(
        integrations.map(async (integration) => {
          const url = `https://api.unified.to/unified/integration/auth/${workspace_id}/${integration.type}?success_redirect=${window.location.href}`;
          const urlResponse = await axios.get(url);
          integrationData.push({
            data: integration,
            url: urlResponse.data,
          });
        })
      );
      integrationData.sort(function (a, b) {
        var textA = a.data.name.toUpperCase();
        var textB = b.data.name.toUpperCase();
        return textA < textB ? -1 : textA > textB ? 1 : 0;
      });

      if (localStorage.getItem("connection_id") != null) {
        const id = localStorage.getItem("connection_id");

        const connectionOptions = {
          method: "GET",
          url: `https://api.unified.to/unified/connection/${id}`,
          headers: {
            authorization:
              "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
          },
        };

        const connectionResponse = await axios.request(connectionOptions);
        console.log("CPNNECTON", connectionResponse);
        setCRMType(connectionResponse.data.integration_type);
      }
      setAvailableIntegrations(integrationData);
    }

    async function storeData() {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const connection_id = urlParams.get("id");

      localStorage.setItem("connection_id", connection_id);

      await createPineconeIndexes(connection_id);

      await props.db.from("data").insert({
        connection_id: connection_id,
        crm_data: [],
        twitter_messages: [],
        twitterLinked: false,
        type: "crm",
      });

      const uid = localStorage.getItem("uid");

      await props.db.from("users").insert({
        id: uid,
        crm_id: connection_id,
        teamMembers: [
          {
            email: localStorage.getItem("email"),
            uid: localStorage.getItem("uid"),
            isAdmin: true,
          },
        ],
      });
      setIsLoading(false);
      var cleanUrl = window.location.href.split("?")[0];
      window.history.replaceState({}, document.title, cleanUrl);
    }

    if (urlParams.has("code")) {
      getEmailData();
    } else if (urlParams.has("oauth_verifier")) {
      getTwitterData();
    } else if (urlParams.has("id")) {
      storeData();
    }

    getCRMIntegrations();
  }, []);
  return (
    <LoadingOverlay active={isLoading} spinner text="Please wait...">
      <div className="w-[100vw] h-[100vh]">
        <Sidebar selectedTab={0} db={props.db} />
        <div className="mx-10 my-10"></div>
        <div className="mx-5 my-10">
          <p className="text-gray-500 text-xl font-semibold font-['Inter'] leading-tight my-10">
            Connected Integrations
          </p>
          <div class="flex flex-wrap justify-start gap-[18px]">
            <Card className="mx-auto w-[23vw]">
              <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                <div className="flex gap-1.5 mr-20 items-center">
                  <RiAlignJustify />
                  <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    CRM
                  </p>
                </div>
              </div>
              <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                Select your team’s CRM platform. Only one CRM <br />
                tool can be connected per team.
              </p>

              {localStorage.getItem("connection_id") == null && (
                <Select>
                  {availableIntegrations.map((integration) => {
                    const imageElement = (
                      <img
                        src={integration.data.logo_url}
                        alt={integration.data.name}
                        className="inline-flex w-[25px] px-1 justify-center"
                      />
                    );

                    return (
                      <SelectItem
                        onClick={() => {
                          window.open(integration.url, "_self");
                        }}
                      >
                        {imageElement}
                        {integration.data.name}
                      </SelectItem>
                    );
                  })}
                </Select>
              )}

              {localStorage.getItem("connection_id") != null && (
                <Select disabled={true} value="1">
                  {availableIntegrations.map((integration) => {
                    if (integration.data.type == crmType) {
                      const imageElement = (
                        <img
                          src={integration.data.logo_url}
                          alt={integration.data.name}
                          className="inline-flex w-[25px] px-1 justify-center"
                        />
                      );

                      return (
                        <SelectItem
                          value="1"
                          onClick={() => {
                            window.open(integration.url, "_self");
                          }}
                        >
                          {imageElement}
                          {integration.data.name}
                        </SelectItem>
                      );
                    }
                  })}
                </Select>
              )}

              {/* <Button
              variant={
                localStorage.getItem("connection_id") == null
                  ? "secondary"
                  : "primary"
              }
              className="w-[100%]"
              onClick={() => {
                navigation("/link");
              }}
              icon={
                localStorage.getItem("connection_id") == null
                  ? RiAddLine
                  : RiCheckLine
              }
              disabled={
                localStorage.getItem("connection_id") == null ? false : true
              }
            >
              {localStorage.getItem("connection_id") == null
                ? "Add CRM Account"
                : "Linked"}
            </Button> */}
            </Card>
            <Card className="mx-auto w-[23vw]">
              <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                <div className="flex gap-1.5 mr-20 items-center">
                  <RiMailLine />
                  <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    Email
                  </p>
                </div>
                {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
              </div>
              <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                Integrate with Email to access and analyze data <br /> from your
                emails, inbox, and more.
              </p>

              <Button
                variant={
                  localStorage.getItem("email_grant_id") == null
                    ? "secondary"
                    : "primary"
                }
                className="w-[100%]"
                icon={
                  localStorage.getItem("email_grant_id") == null
                    ? RiAddLine
                    : RiCheckLine
                }
                onClick={async () => {
                  await connectEmail();
                }}
                disabled={
                  localStorage.getItem("email_grant_id") == null ? false : true
                }
              >
                {localStorage.getItem("email_grant_id") == null
                  ? "Add Email account"
                  : "Linked"}
              </Button>
            </Card>

            <Card className="mx-auto w-[23vw]">
              <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                <div className="flex gap-1.5 mr-2 items-center">
                  <RiTwitterFill color="#349DF0" />
                  <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    Twitter
                  </p>
                </div>
                {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
              </div>
              <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                Integrate with Twitter to access and analyze data <br /> from
                your emails, inbox, and more.
              </p>

              <Button
                variant={
                  localStorage.getItem("oauth_verifier") == null
                    ? "secondary"
                    : "primary"
                }
                className="w-[100%]"
                icon={RiAddLine}
                onClick={async () => {
                  await linkWithTwitter();
                }}
                disabled={
                  localStorage.getItem("oauth_verifier") == null ? false : true
                }
              >
                {localStorage.getItem("oauth_verifier") == null
                  ? "Add Twitter account"
                  : "Linked"}
              </Button>
            </Card>

            <Card className="mx-auto w-[23vw]">
              <div className="flex flex-row justify-between rounded-lg items-center flex-auto mb-5">
                <div className="flex gap-1.5 mr-20 items-center">
                  <RiLinkedinBoxFill color="#0077B5" />
                  <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7">
                    LinkedIn
                  </p>
                </div>
                {/* <Badge color="emerald-500">
                <p>Connected</p>
              </Badge> */}
              </div>
              <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                Integrate with LinkedIn to access and analyze data <br /> from
                your emails, inbox, and more.
              </p>

              <Button
                variant="primary"
                className="w-[100%]"
                onClick={() => {
                  window.open(
                    "https://chromewebstore.google.com/detail/boondoggle/lgeokfaihmdoipgmajekijkfppdmcnib?pli=1",
                    "_blank"
                  );
                }}
              >
                Download Extension
              </Button>
            </Card>
          </div>
        </div>

        <div className="mx-5 my-10">
          <p className="text-gray-500 text-xl font-semibold font-['Inter'] leading-tight my-10">
            Connected Workflows
          </p>
          <div class="justify-start  gap-[18px] inline-flex">
            <Card className="mx-auto w-[23vw] border-dotted border-2 border-gray-600">
              <p class="text-gray-700 text-lg font-medium font-['Inter'] leading-7 text-center mb-5">
                2 slots remaining
              </p>
              <p class="text-gray-500 text-sm text-center font-normal font-['Inter'] leading-tight mb-5">
                Select your team’s CRM platform. Only one CRM <br />
                tool can be connected per team.
              </p>

              <Button variant="primary" className="w-[100%]">
                Explore Workflows
              </Button>
            </Card>
            <Card className="mx-auto w-[25vw] flex-column">
              <div className="flex flex-row justify-between rounded-lg items-center mb-5">
                <div className="flex gap-1.5 mr-20 items-center">
                  <div className="px-2 py-[2.50px] bg-blue-50 rounded-md border border-blue-200 justify-start items-center gap-1.5 inline-flex">
                    <RiLinkedinBoxFill color="#0077B5" className="w-[35px]" />
                    <img src={hubspot} className="w-[15px] h-[15px]" />
                  </div>
                  <p className="text-gray-700 text-lg font-medium font-['Inter'] leading-7n whitespace-nowrap">
                    LinkedIn {`->`} HubSpot
                  </p>
                </div>
                <Badge color="emerald-500">
                  <p>Connected</p>
                </Badge>
              </div>
              <p class="text-gray-500 text-sm font-normal font-['Inter'] leading-tight mb-5">
                Select your team’s CRM platform. Only one CRM <br />
                tool can be connected per team.
              </p>

              <Button variant="secondary" className="w-[100%]" icon={RiAddLine}>
                Use Template
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </LoadingOverlay>
  );
}

export default NewHome;
