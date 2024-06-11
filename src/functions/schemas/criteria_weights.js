export const CRITERIA_WEIGHTS = {
  contact: {
    fields: {
      name: 30,
      title: 5,
      company: 25,
      emails: {
        email: 20,
      },
      telephones: {
        telephone: 20,
      },
      address: {
        address1: 10,
        city: 10,
        region: 10,
        region_code: 1,
        postal_code: 10,
        country: 10,
      },
    },
  },
  deal: {
    fields: {
      name: 20,
      amount: 30,
      stage: 25,
      source: 10,
      pipeline: 15,
      probability: 10,
      tags: 5,
    },
  },
  company: {
    fields: {
      name: 30,
      emails: {
        email: 20,
      },
      telephones: {
        telephone: 20,
      },
      websites: 10,
      address: {
        address1: 10,
        city: 10,
        region: 10,
        region_code: 1,
        postal_code: 10,
        country: 10,
      },
      tags: 5,
      description: 10,
      industry: 10,
      link_urls: 5,
      employees: 5,
    },
  },
  lead: {
    fields: {
      name: 30,
      company_name: 20,
      address: {
        address1: 10,
        city: 10,
        region: 10,
        region_code: 1,
        postal_code: 10,
        country: 10,
        country_code: 1,
      },
      emails: {
        email: 20,
      },
      telephones: {
        telephone: 20,
      },
      source: 10,
      status: 10,
    },
  },
};
