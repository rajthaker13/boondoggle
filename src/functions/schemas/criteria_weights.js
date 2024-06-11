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
        address1: 5,
        city: 1,
        postal_code: 1,
        country: 1,
      },
    },
  },
  deal: {
    fields: {
      name: 20,
      amount: 20,
      stage: 20,
      source: 5,
      probability: 10,
    },
  },
  company: {
    fields: {
      name: 30,
      emails: {
        email: 20,
      },
      telephones: {
        telephone: 15,
      },
      websites: 15,
      address: {
        address1: 5,
        city: 1,
        postal_code: 1,
        country: 1,
      },
      description: 10,
      industry: 10,
      employees: 5,
    },
  },
};
