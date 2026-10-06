import { test, expect } from "@playwright/test";

const PAGES = [
  {
    name: "liberals",
    url: "/liberals/results?interests=world-languages,world-religions,music-history-global-traditions",
  },
  {
    name: "groups",
    url: "/groups/results?interests=vehicles,competitions,robots&program=aerospace_engineering",
  },
];

test.describe("workshop & certification suggestions", () => {
  for (const { name, url } of PAGES) {
    test(`${name} results page shows general, non-personalized suggestions`, async ({
      page,
    }) => {
      await page.goto(url);

      const section = page.locator("section", {
        has: page.getByText("Workshops & Certifications"),
      });
      await expect(section).toBeVisible();

      for (const label of ["CAD", "3D Printing", "Leadership"]) {
        await expect(
          section.getByText(`You may be interested in ${label} workshops.`)
        ).toBeVisible();
      }

      // No host URL has been confirmed yet, so there should be no "visit
      // host" links — and nothing resembling a date or scheduled time.
      await expect(section.getByRole("link")).toHaveCount(0);
      const text = (await section.textContent()) ?? "";
      expect(text).not.toMatch(
        /\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun)\w*day\b|\b\d{1,2}:\d{2}\s*(am|pm)\b/i
      );
    });
  }
});
