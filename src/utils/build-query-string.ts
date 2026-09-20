type QueryValue = string | number | boolean | undefined | null;

export type QueryParams = Record<string, QueryValue>;

// Serializes a flat params object into a query string, skipping empty values.
export function buildQueryString(params: QueryParams): string {
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === "") continue;
    search.append(key, String(value));
  }

  return search.toString();
}
