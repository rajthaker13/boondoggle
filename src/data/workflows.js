import emailContacts from "../assets/ui-update/workflows/emailContacts.svg";
import linkedInContacts from "../assets/ui-update/workflows/linkedInContacts.svg";
import twitterContacts from "../assets/ui-update/workflows/twitterContacts.svg";
import emailDeal from "../assets/ui-update/workflows/emailDeal.svg";
import linkedInDeal from "../assets/ui-update/workflows/linkedinDeal.svg";
import twitterDeal from "../assets/ui-update/workflows/twitterDeal.svg";
import emailBoth from "../assets/ui-update/workflows/emailBoth.svg";
import linkedInBoth from "../assets/ui-update/workflows/linkedInBoth.svg";
import twitterBoth from "../assets/ui-update/workflows/twitterBoth.svg";

const data = [
  {
    id: 0,
    title: "Update CRM Contacts via Emails",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: emailContacts,
    source: "Email",
    destination: "crm",
  },
  {
    id: 1,
    title: "Update CRM Contacts via LinkedIn Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: linkedInContacts,
    source: "LinkedIn",
    destination: "airtable",
  },
  {
    id: 2,
    title: "Update CRM Contacts via Twitter Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: twitterContacts,
    source: "Twitter",
    destination: "crm",
  },
  {
    id: 3,
    title: "Update CRM Deal Status via Emails",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: emailDeal,
    source: "Email",
    destination: "crm",
  },
  {
    id: 4,
    title: "Update CRM Deal Status via LinkedIn Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: linkedInDeal,
    source: "LinkedIn",
    destination: "crm",
  },
  {
    id: 5,
    title: "Update CRM Deal Status via Twitter Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: twitterDeal,
    source: "Twitter",
    destination: "crm",
  },
  {
    id: 6,
    title: "Update CRM Deal Status & Contacts via Emails",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: emailContacts,
    source: "Email",
    destination: "crm",
  },
  {
    id: 7,
    title: "Update CRM Deal Status & Contacts via LinkedIn Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: linkedInBoth,
    source: "LinkedIn",
    destination: "crm",
  },
  {
    id: 8,
    title: "Update CRM Deal Status & Contacts via Twitter Messages",
    description:
      "Connect your email to generate new CRM contacts and enrich your existing contacts with conversational context.",
    src: twitterBoth,
    source: "Twitter",
    destination: "crm",
  },
];

export default data;
