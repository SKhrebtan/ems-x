import { Event } from '@prisma/client';
import { RECOMMENDATION_CONFIG } from './recommendations.constants';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * RECOMMENDATION_CONFIG.earthRadiusKm * Math.asin(Math.min(1, Math.sqrt(a)));
}

export function scoreSimilarity(target: Event, candidate: Event): number {
  const { weights, horizons } = RECOMMENDATION_CONFIG;
  let score = 0;

  if (target.category === candidate.category) {
    score += weights.category;
  }

  const daysApart =
    Math.abs(target.date.getTime() - candidate.date.getTime()) / MS_PER_DAY;
  if (daysApart <= horizons.dateDays) {
    score += weights.date * (1 - daysApart / horizons.dateDays);
  }

  if (
    target.latitude != null &&
    target.longitude != null &&
    candidate.latitude != null &&
    candidate.longitude != null
  ) {
    const km = haversineKm(
      target.latitude,
      target.longitude,
      candidate.latitude,
      candidate.longitude,
    );
    if (km <= horizons.locationKm) {
      score += weights.location * (1 - km / horizons.locationKm);
    }
  }

  return Math.round(score * 100) / 100;
}
