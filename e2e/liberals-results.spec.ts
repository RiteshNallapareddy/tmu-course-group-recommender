import { test, expect, Page } from "@playwright/test";

function resultsUrl(interests: string[]) {
  const params = new URLSearchParams({ interests: interests.join(",") });
  return `/liberals/results?${params.toString()}`;
}

async function topMatchTitles(page: Page): Promise<string[]> {
  const section = page.locator("section", { has: page.getByText("Your Top Matches") });
  return section.locator("h3").allTextContents();
}

test.describe("liberals results grouping", () => {
  test("a clearly-ahead course shows alone in Your Top Matches", async ({ page }) => {
    await page.goto(
      resultsUrl(["world-languages", "world-religions", "music-history-global-traditions"])
    );

    const topSection = page.locator("section", { has: page.getByText("Your Top Matches") });
    await expect(topSection.getByRole("heading", { name: "Christian Music: Songs of Hope" })).toBeVisible();
    await expect(topSection.locator("h3")).toHaveCount(1);

    const alsoLikeSection = page.locator("section", { has: page.getByText("You Might Also Like") });
    await expect(alsoLikeSection.locator("h3")).toHaveCount(4);

    // No course should ever appear in both sections.
    const topTitles = await topSection.locator("h3").allTextContents();
    const alsoTitles = await alsoLikeSection.locator("h3").allTextContents();
    for (const title of topTitles) {
      expect(alsoTitles).not.toContain(title);
    }
  });

  test("a tie at the top shows 3 courses in Your Top Matches, no repeats below", async ({ page }) => {
    await page.goto(
      resultsUrl(["philosophy-big-questions", "ethics-freedom-justice", "critical-thinking-logic"])
    );

    const topSection = page.locator("section", { has: page.getByText("Your Top Matches") });
    await expect(topSection.locator("h3")).toHaveCount(3);

    const expectedTop = new Set([
      "Issues of Life, Death and Poverty",
      "Critical Thinking",
      "Introduction to Indian Philosophy",
    ]);
    const topTitles = await topSection.locator("h3").allTextContents();
    for (const title of topTitles) {
      expect(expectedTop.has(title)).toBe(true);
    }

    const alsoLikeSection = page.locator("section", { has: page.getByText("You Might Also Like") });
    const alsoTitles = await alsoLikeSection.locator("h3").allTextContents();
    expect(alsoTitles.sort()).toEqual(
      ["Existentialism and Art and Culture", "Problems in Philosophy"].sort()
    );

    for (const title of topTitles) {
      expect(alsoTitles).not.toContain(title);
    }

    // Alphabetical-by-course-code order (the old behaviour) would always
    // put "Issues of Life, Death and Poverty" (PHL 406) last and "Problems
    // in Philosophy" (PHL 201, the actual lowest code) first — and PHL 201
    // wouldn't even make the top group. The seeded tie-break shouldn't
    // reproduce that.
    expect(topTitles).not.toContain("Problems in Philosophy");
  });

  test("tied order is stable across reloads (seeded, not re-randomized every visit)", async ({ page }) => {
    const url = resultsUrl([
      "philosophy-big-questions",
      "ethics-freedom-justice",
      "critical-thinking-logic",
    ]);

    await page.goto(url);
    const firstLoad = await topMatchTitles(page);

    await page.goto(url);
    const secondLoad = await topMatchTitles(page);

    expect(secondLoad).toEqual(firstLoad);
  });
});
