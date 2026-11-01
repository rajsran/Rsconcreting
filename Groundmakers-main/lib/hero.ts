import { getSql } from './db';

/** Hero photo URLs in display order (first = shown first). */
export async function getHeroImages(): Promise<string[]> {
  try {
    const rows = (await getSql()`
      SELECT url FROM hero_images ORDER BY position ASC, id ASC`) as { url: string }[];
    return rows.map((r) => r.url);
  } catch (err) {
    // Database unavailable — fall back to the site's built-in hero image
    console.error('Failed to load hero images:', err);
    return [];
  }
}

/** Replace the whole hero list with `urls`, keeping their order. */
export async function saveHeroImages(urls: string[]): Promise<void> {
  const sql = getSql();
  await sql.transaction([
    sql`DELETE FROM hero_images`,
    ...urls.map((url, i) => sql`INSERT INTO hero_images (url, position) VALUES (${url}, ${i})`),
  ]);
}
