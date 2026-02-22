import { describe, expect, it } from "vitest";

import { parseChallengeContent } from "@ctf-mn/api/attachments";

describe("parseChallengeContent", () => {
  it("replaces heading-style files section with attachment cards source links", () => {
    const markdown = [
      "Intro text.",
      "",
      "## Files",
      "- [task.zip](/files/task.zip)",
      "- [mirror](https://example.com/attachments/task.zip)",
      "",
      "## Hints",
      "Read source.",
    ].join("\n");

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([
      { label: "task.zip", href: "/files/task.zip" },
      { label: "mirror", href: "https://example.com/attachments/task.zip" },
    ]);
    expect(parsed.contentMarkdown).toContain("Intro text.");
    expect(parsed.contentMarkdown).toContain("## Hints");
    expect(parsed.contentMarkdown).not.toContain("## Files");
    expect(parsed.contentMarkdown).not.toContain("/files/task.zip");
  });

  it("replaces bold label attachments section and preserves surrounding content", () => {
    const markdown = [
      "Solve the challenge.",
      "",
      "**Attachments**:",
      "[handout.pdf](/download/handout.pdf)",
      "",
      "Good luck.",
    ].join("\n");

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([{ label: "handout.pdf", href: "/download/handout.pdf" }]);
    expect(parsed.contentMarkdown).toContain("Solve the challenge.");
    expect(parsed.contentMarkdown).toContain("Good luck.");
    expect(parsed.contentMarkdown).not.toContain("**Attachments**:");
    expect(parsed.contentMarkdown).not.toContain("handout.pdf");
  });

  it("does not remove regular content that mentions files outside a dedicated section", () => {
    const markdown = "This challenge has files in memory. [writeup](/writeup)";

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([]);
    expect(parsed.contentMarkdown).toBe(markdown);
  });

  it("removes inline label format with links but keeps following text", () => {
    const markdown = [
      "Intro.",
      "",
      "Files: [task.zip](/files/task.zip)",
      "",
      "Run the binary locally.",
    ].join("\n");

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([{ label: "task.zip", href: "/files/task.zip" }]);
    expect(parsed.contentMarkdown).toContain("Intro.");
    expect(parsed.contentMarkdown).toContain("Run the binary locally.");
    expect(parsed.contentMarkdown).not.toContain("Files:");
  });

  it("deduplicates same attachment href when repeated", () => {
    const markdown = [
      "Attachments:",
      "- [primary](/files/task.zip)",
      "- [mirror](/files/task.zip)",
    ].join("\n");

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([{ label: "primary", href: "/files/task.zip" }]);
  });

  it("treats links under '**Files:**' as attachments even without file extension", () => {
    const markdown = [
      "MORE ROP",
      "",
      "**Files:**",
      "- [pwn4](https://d17zlucxou2y8w.cloudfront.net/pwn/473--ez_rop/pwn4)",
    ].join("\n");

    const parsed = parseChallengeContent(markdown);

    expect(parsed.attachments).toEqual([{ label: "pwn4", href: "https://d17zlucxou2y8w.cloudfront.net/pwn/473--ez_rop/pwn4" }]);
    expect(parsed.contentMarkdown).toBe("MORE ROP");
  });
});
