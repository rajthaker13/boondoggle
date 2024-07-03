export const CRITERIA_WEIGHTS = {
  contact: {
    fields: {
      name: 30,
      title: 5,
      company: 25,
      emails: {
        email: 20,
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
      websites: 15,
      description: 10,
      employees: 5,
    },
  },
};
