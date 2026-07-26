export async function safeQuery(queryFn, fallback) {
  try {
    return await queryFn();
  } catch {
    return fallback;
  }
}

export async function safeFindMany(queryFn) {
  return safeQuery(queryFn, []);
}

export async function safeGetSettings(queryFn) {
  const rows = await safeQuery(queryFn, []);
  return Object.fromEntries(rows.map((s) => [s.key, s.value]));
}
