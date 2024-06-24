import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";

async function createCompanyCRM(
    companyName,
    companyProfile,
    companyLinkedIn
  ) {
    const connection_id = localStorage.getItem("connection_id");
    const listCompaniesOptions = {
      method: "GET",
      url: `https://api.unified.to/crm/${connection_id}/company`,
      headers: {
        authorization:
          "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0",
      },
      params: {
        limit: 10,
        query: companyName,
      },
    };

    let listCompanyResults;

    try {
      listCompanyResults = await axios.request(listCompaniesOptions);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        // If rate limited, wait for 2 seconds and retry the request
        await new Promise((resolve) => setTimeout(resolve, 2000));
        listCompanyResults = await axios.request(listCompaniesOptions); // Retry the request
      } else {
        // For other errors, throw the error
        return {
          id: 0,
          data: {},
          isNewCompany: false,
        };
      }
    }

    const currentCompanyCRM = listCompanyResults.data[0];

    var companyCRMObject = {
      name: companyName,
      websites: [companyProfile.website, companyLinkedIn],
      address: {
        address1:
          companyProfile.hq.line_1 !== null ? companyProfile.hq.line_1 : " ",
        city: companyProfile.hq.city !== null ? companyProfile.hq.city : " ",
        postal_code:
          companyProfile.hq.postal_code !== null
            ? companyProfile.hq.postal_code
            : " ",
        country:
          companyProfile.hq.country !== null ? companyProfile.hq.country : " ",
      },
      description: companyProfile.description,
      // industry: companyProfile.industry,
      employees: companyProfile.company_size_on_linkedin,
    };

    if (currentCompanyCRM != undefined) {
      companyCRMObject.id = currentCompanyCRM.id;
      return {
        id: currentCompanyCRM.id,
        data: companyCRMObject,
        isNewCompany: false,
      };
    } else {
      const createCompanyOptions = {
        method: "POST",
        url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/https://api.unified.to/crm/${connection_id}/company`,
        headers: {
          authorization: `bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzMzgiLCJ3b3Jrc3BhY2VfaWQiOiI2NWMwMmRiZWM5ODEwZWQxZjIxNWMzM2IiLCJpYXQiOjE3MDcwOTM0Mzh9.sulAKJa6He9fpH9_nQIMTo8_SxEHFj5u_17Rlga_nx0`,
        },
        data: companyCRMObject,
      };

      let createCompanyResults;

      try {
        createCompanyResults = await axios.request(createCompanyOptions);
      } catch (createCompanyError) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        createCompanyResults = await axios.request(createCompanyOptions);
      }
      console.log("Create Company Results", createCompanyResults);
      companyCRMObject.id = createCompanyResults.data.id;
      return {
        id: createCompanyResults.data.id,
        data: companyCRMObject,
        isNewCompany: true,
      };
    }
  }

// Function to fetch enrichment profile data based on the provided email
export async function fetchEnrichmentProfile(profileData, source) {
    // Define API request options
    // Based on enrich_profile, lookup_depth, and email
    const getLinkedInURLByEmail = (email) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/profile/resolve/email?lookup_depth=deep&email=${email}`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    const getLinkedInProfileByURL = (url) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/v2/linkedin?url=${url}&use_cache=if-recent`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    // Define API request options for searching company information
    const getLinkedInProfileByProfile = ({ name, companyDomain, title }) => ({
        method: "GET",
        maxBodyLength: Infinity,
        url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/profile/resolve?similarity_checks=include&enrich_profile=enrich&company_domain=${companyDomain}&title=${title}&first_name=${name}`,
        headers: {
          Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
          "X-Requested-With": "XMLHttpRequest",
        },
    });
  

    const fetchCompanyInformation = (url) => ({
      method: "GET",
      maxBodyLength: Infinity,
      url: `https://vast-waters-56699-3595bd537b3a.herokuapp.com/nubela.co/proxycurl/api/linkedin/company?url=${url}`,
      headers: {
        Authorization: "Bearer yfwsEmCNER0b3vzqV4fKLg",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    function isAutomatedEmail(email) {
      const regex = /no[-]?reply|invoice|notifications|support|team/i;
      return regex.test(email);
    }

    try {
      let userLinkedInUrl;
      let profile = null;
      if (source === "Email") {
        const isAutomatedEmailResponse = isAutomatedEmail(profileData.email);
        if (isAutomatedEmailResponse) {
          return null;
        }

        try {
          const userURLResponse = await axios.request(
            getLinkedInURLByEmail(profileData.email)
          );
          const userURLData = userURLResponse.data;

          if (userURLData.linkedin_profile_url !== null) {
            const userProfileResponse = await axios.request(
              getLinkedInProfileByURL(userURLData.linkedin_profile_url)
            );
            userLinkedInUrl = userURLData.linkedin_profile_url;
            profile = userProfileResponse.data;
          } else {
            return null;
          }
        } catch (error) {
          console.error("URL BY EMAIL ERROR", error);
          return null;
        }
      } else if (source === "LinkedIn") {
        try {
          const userProfileResponse = await axios.request(
            getLinkedInProfileByURL(profileData.url)
          );
          userLinkedInUrl = profileData.url;
          profile = userProfileResponse.data;
        } catch (error) {
          console.error("LinkedIn url error", error);
          return null;
        }
      } else if (source === "SearchCompany") {
        // Handling enrichment by Company Search
        const name = profileData.name;
        const companyDomain = profileData.company;  // Ensure this is always available
        const title = profileData.title || '';  // Optional
        try{
            const userProfileResponse = await axios.request(
                getLinkedInProfileByProfile({ name, companyDomain, title })
            );
            userLinkedInUrl = userProfileResponse.data.url;
            if (userLinkedInUrl != null 
                && userProfileResponse.data.name_similarity_score >= 0.2 
                && userProfileResponse.data.company_similarity_score >= 0.5){
                profile = userProfileResponse.data.profile;
            }else{
                console.error("Profile data is not available");
                return null;
            }
            
            
        } catch (error){
            console.error("Search By Company error", error);
            return null;
        }
      }

      if (profile !== null) {
        console.log("Initial Profile", profile);
        // Extracting the most recent experience
        const latestExperience = profile.experiences.reduce(
          (latest, current) => {
            const latestDate = new Date(
              latest.starts_at.year,
              latest.starts_at.month - 1,
              latest.starts_at.day
            );
            const currentDate = new Date(
              current.starts_at.year,
              current.starts_at.month - 1,
              current.starts_at.day
            );
            return currentDate > latestDate ? current : latest;
          },
          profile.experiences[0]
        );

        if (
          latestExperience.company_linkedin_profile_url !== null &&
          latestExperience.company !== null
        ) {
          const companyProfileResponse = await axios.request(
            fetchCompanyInformation(
              latestExperience.company_linkedin_profile_url
            )
          );
          const companyProfile = companyProfileResponse.data;

          const createCompanyResponse = await createCompanyCRM(
            companyProfile.name,
            companyProfile,
            latestExperience.company_linkedin_profile_url
          );

          console.log("Create Company Response", createCompanyResponse);
          console.log("User profile", profile);

          const conciseProfile = {
            websites: [
              `https://www.linkedin.com/in/${profile.public_identifier}`,
            ],
            url: `https://www.linkedin.com/in/${profile.public_identifier}`,
            title: latestExperience.title,
            name: profile.full_name,
            address: createCompanyResponse.data.address,
            company: companyProfile.name,
            companyUrl: latestExperience.company_linkedin_profile_url,
            emails: profile.personal_emails,
            telephones: profile.personal_numbers,
            company_ids: [createCompanyResponse.id],
            isNewCompany: createCompanyResponse.isNewCompany,
            companyData: createCompanyResponse.data,
          };

          console.log("Profile", conciseProfile, "profileData", profileData);
          return conciseProfile;
        } else {
          return null;
        }
      } else {
        console.error("Profile data is not available");
        return null;
      }
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      // Handle errors appropriately based on the error type
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // No response was received after sending the request
        console.error("No response received");
      } else {
        // Error setting up the request
        console.error("Error setting up the request:", error.message);
      }
      return null;
    }
  }