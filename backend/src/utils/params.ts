/**
 * Extract a route parameter as a string.
 * Express v5 types params as string | string[] — this safely handles both.
 */
export function param(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value || "";
}
