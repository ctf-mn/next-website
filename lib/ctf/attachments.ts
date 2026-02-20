export type Attachment = {
  label: string;
  href: string;
};

export type ChallengeContent = {
  attachments: Attachment[];
  contentMarkdown: string;
};

const markdownLinkPattern = /\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;

function isLikelyAttachment(label: string, href: string) {
  const lowerLabel = label.toLowerCase();
  const lowerHref = href.toLowerCase();

  if (href.startsWith("#") || lowerHref.startsWith("mailto:")) {
    return false;
  }

  return (
    /(?:^|\/)(files?|attachments?|downloads?)(?:\/|$)/i.test(href) ||
    /\.(zip|rar|7z|tar|gz|tgz|xz|bz2|pdf|txt|csv|json|yaml|yml|xml|pcap|pcapng|bin|iso|img|apk|jar|exe)$/i.test(
      href,
    ) ||
    /(attachment|attachments|download|file|handout)/i.test(lowerLabel)
  );
}

function parseMarkdownLinks(source: string): Attachment[] {
  const links: Attachment[] = [];

  for (const match of source.matchAll(markdownLinkPattern)) {
    const label = match[1]?.trim();
    const rawHref = match[2]?.trim();
    if (!label || !rawHref) {
      continue;
    }
    links.push({ label, href: rawHref.replace(/^<|>$/g, "") });
  }

  return links;
}

function pushUniqueAttachments(
  target: Attachment[],
  seen: Set<string>,
  links: Attachment[],
  strategy: "all" | "likely",
) {
  for (const link of links) {
    if (seen.has(link.href)) {
      continue;
    }
    if (strategy === "likely" && !isLikelyAttachment(link.label, link.href)) {
      continue;
    }
    seen.add(link.href);
    target.push(link);
  }
}

function parseChallengeMarkdown(markdown: string): ChallengeContent {
  const lines = markdown.split("\n");
  const seen = new Set<string>();
  const attachments: Attachment[] = [];
  const cleaned: string[] = [];
  let mode: "none" | "heading" | "label" = "none";

  const headingTitlePattern = /^(?:#{1,6}\s*)?(files?|attachments?)\s*:?\s*$/i;
  const plainLabelPattern = /^(files?|attachments?)\s*:\s*(.*)$/i;
  const boldLabelPattern = /^\*\*(files?|attachments?)(?:\s*:)?\s*\*\*\s*:?\s*(.*)$/i;
  const headingBoundaryPattern = /^#{1,6}\s+\S/;

  for (const line of lines) {
    const trimmed = line.trim();
    const lineLinks = parseMarkdownLinks(line);

    if (mode === "heading" && headingBoundaryPattern.test(trimmed)) {
      mode = "none";
    }

    if (mode === "label") {
      if (trimmed.length === 0) {
        mode = "none";
        cleaned.push(line);
        continue;
      }

      if (lineLinks.length > 0) {
        pushUniqueAttachments(attachments, seen, lineLinks, "all");
        continue;
      }

      mode = "none";
    }

    if (mode === "heading") {
      pushUniqueAttachments(attachments, seen, lineLinks, "all");
      continue;
    }

    if (headingTitlePattern.test(trimmed)) {
      mode = "heading";
      continue;
    }

    const labelMatch = trimmed.match(plainLabelPattern) ?? trimmed.match(boldLabelPattern);
    if (labelMatch != null) {
      const trailing = (labelMatch[2] ?? "").trim();

      if (trailing.length === 0) {
        mode = "label";
        continue;
      }

      const trailingLinks = parseMarkdownLinks(trailing);
      if (trailingLinks.length > 0) {
        pushUniqueAttachments(attachments, seen, trailingLinks, "all");
        continue;
      }

      mode = "label";
      continue;
    }

    pushUniqueAttachments(attachments, seen, lineLinks, "likely");
    cleaned.push(line);
  }

  return {
    attachments,
    contentMarkdown: cleaned.join("\n").trim(),
  };
}

export function parseChallengeContent(markdown: string): ChallengeContent {
  return parseChallengeMarkdown(markdown);
}
