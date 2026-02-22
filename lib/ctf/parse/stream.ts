import { load, type CheerioAPI } from "cheerio";

export async function parseHtmlFromStream(body: ReadableStream<Uint8Array> | null): Promise<CheerioAPI> {
  if (!body) {
    return load("");
  }

  const html = await new Response(body).text();
  return load(html);
}
