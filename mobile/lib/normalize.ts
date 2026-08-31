/**
 * Without generated Supabase types, postgrest-js can't tell a many-to-one
 * embedded relation from a one-to-many, so it types every embed as an
 * array. Picks the single row out of whichever shape actually comes back
 * at runtime — same helper as the admin console's collections page.
 */
export function one<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : (value ?? undefined);
}
