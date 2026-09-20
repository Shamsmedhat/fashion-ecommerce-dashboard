export const STALE_TIMES = {
  REAL_TIME: 0,
  SHORT: 1000 * 30,
  STANDARD: 1000 * 60 * 5,
  LONG: 1000 * 60 * 30,
  PERMANENT: Infinity,
} as const;
