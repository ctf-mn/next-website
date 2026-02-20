export type NextSearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function toUrlSearchParams(input: NextSearchParams): Promise<URLSearchParams> {
  const source = await input;
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(source)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value)) {
      for (const entry of value) {
        params.append(key, entry);
      }
    }
  }

  return params;
}
