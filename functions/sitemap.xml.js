const SITE_URL = "https://learnaboutjainism.com";
const FIXED_PAGES = ["/en", "/en/start-here", "/en/ontology", "/en/about-this-library"];

export async function onRequestGet(context) {
  if (!context.env.LIBRARY_DB) return context.next();

  const { results } = await context.env.LIBRARY_DB
    .prepare("SELECT topic_id FROM review_tasks WHERE published_content IS NOT NULL")
    .all();
  const staticResponse = await context.next();
  const staticXml = await staticResponse.text();
  const staticUrls = [...staticXml.matchAll(/<loc>(https:\/\/learnaboutjainism\.com[^<]*)<\/loc>/g)].map((match) => match[1]);
  const dynamicTopicUrls = (results ?? [])
    .map((row) => String(row.topic_id ?? ""))
    .filter((topicId) => /^D\d{2}\.T\d{3}$/.test(topicId))
    .map((topicId) => `${SITE_URL}/en/ontology/${topicId}`);
  const urls = [...new Set([...staticUrls, ...dynamicTopicUrls, ...FIXED_PAGES.map((pathname) => `${SITE_URL}${pathname}`)])];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=60, s-maxage=300",
      "x-content-type-options": "nosniff",
    },
  });
}
