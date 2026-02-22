export type PaginationPage = {
  page: number;
  href: string;
  current: boolean;
};

export type PaginationItem =
  | { type: "page"; value: PaginationPage }
  | { type: "ellipsis"; key: string };

export function withEllipsis(pages: PaginationPage[]): PaginationItem[] {
  if (pages.length === 0) {
    return [];
  }

  const sortedPages = Array.from(new Map(pages.map((entry) => [entry.page, entry])).values()).sort((a, b) => a.page - b.page);
  const items: PaginationItem[] = [];

  for (const page of sortedPages) {
    const previous = items.at(-1);
    if (previous?.type === "page" && page.page - previous.value.page > 1) {
      items.push({ type: "ellipsis", key: `ellipsis-${previous.value.page}-${page.page}` });
    }
    items.push({ type: "page", value: page });
  }

  return items;
}
