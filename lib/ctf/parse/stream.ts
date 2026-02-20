import { decodeStream, load, type CheerioAPI } from "cheerio";
import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";

async function readBodyAsText(body: ReadableStream<Uint8Array>): Promise<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let result = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    if (value) {
      result += decoder.decode(value, { stream: true });
    }
  }

  result += decoder.decode();
  return result;
}

export async function parseHtmlFromStream(body: ReadableStream<Uint8Array> | null): Promise<CheerioAPI> {
  if (!body) {
    return load("");
  }

  if (typeof Readable.fromWeb !== "function") {
    return load(await readBodyAsText(body));
  }

  return await new Promise<CheerioAPI>((resolve, reject) => {
    const input = Readable.fromWeb(body as unknown as NodeReadableStream);
    const parser = decodeStream({}, (error, parsed) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(parsed);
    });

    input.on("error", reject);
    parser.on("error", reject);
    input.pipe(parser);
  });
}
