export const RECOMMENDATION_CONFIG = {
  weights: {
    category: 50,
    date: 30,
    location: 20,
  },
  horizons: {
    dateDays: 30,
    locationKm: 100,
  },
  earthRadiusKm: 6371,
  defaultLimit: 5,
} as const;
