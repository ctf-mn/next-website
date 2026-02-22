import { expect, test } from "@playwright/test";

test.describe("Scoreboard pagination", () => {
  test("shows an explicit active page state", async ({ page }) => {
    await page.goto("/scoreboard?page=2");
    await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();

    const activeLink = page.locator('a[aria-current="page"]');
    await expect(activeLink).toHaveCount(1);
    await expect(activeLink).toHaveAttribute("href", /\/scoreboard\?page=\d+/);
    await expect(activeLink).toHaveAttribute("aria-label", /Current page 2/i);
  });

  test("renders ellipsis when pagination has numeric gaps", async ({ page }) => {
    await page.goto("/scoreboard?page=2");
    await expect(page.getByRole("heading", { name: "Scoreboard" })).toBeVisible();

    const pageNumbers = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="/scoreboard?page="]'));
      return anchors
        .map((anchor) => Number(anchor.textContent?.trim()))
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);
    });

    const hasGap = pageNumbers.some((value, index) => index > 0 && value - pageNumbers[index - 1]! > 1);
    if (!hasGap) {
      test.skip(true, "Upstream scoreboard pagination has no gaps in current dataset.");
    }

    await expect(page.getByText("...", { exact: true }).first()).toBeVisible();
  });
});
