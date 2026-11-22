// Pagination rules shared by the HTTP layer (DTO validation) and the service
// (defaults/caps). Neither depends on the other: both read from here.
export const PAGE_LIMITS = {
  MIN: 1,
  DEFAULT: 50,
  MAX: 100,
} as const;
