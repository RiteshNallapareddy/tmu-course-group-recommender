import { test, expect } from "@playwright/test";

function resultsUrl(interests: string[], program?: string) {
  const params = new URLSearchParams({ interests: interests.join(",") });
  if (program) params.set("program", program);
  return `/groups/results?${params.toString()}`;
}

test.describe("groups results ranking", () => {
  test("Aerospace + Vehicles, Competitions, Robots: top match is a design team, course union is separate", async ({
    page,
  }) => {
    await page.goto(
      resultsUrl(["vehicles", "competitions", "robots"], "aerospace_engineering")
    );

    const topMatchSection = page.locator("section", { has: page.getByText("Your Top Match") });
    await expect(topMatchSection.getByText("Design Team")).toBeVisible();
    await expect(
      topMatchSection.getByRole("heading", { name: "Canadian National Concrete Canoe Team" })
    ).toBeVisible();
    await expect(topMatchSection.getByText(/Matches your interests in .*(Vehicles|Competitions|Robots)/)).toBeVisible();

    // The course union must never appear as, or inside, the ranked matches.
    await expect(topMatchSection.getByText("Aerospace Course Union")).toHaveCount(0);
    const alsoLikeSection = page.locator("section", { has: page.getByText("You Might Also Like") });
    await expect(alsoLikeSection.getByText("Aerospace Course Union")).toHaveCount(0);

    // It appears exactly once, in its own section.
    const courseUnionSection = page.locator("section", { has: page.getByText("Your Course Union") });
    await expect(courseUnionSection.getByRole("heading", { name: "Aerospace Course Union" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Aerospace Course Union" })).toHaveCount(1);

    // Card text promises membership + contact, not steps we don't have.
    await expect(
      courseUnionSection.getByText(
        "You're automatically a member as a full-time student in this program. Reach out to get involved:"
      )
    ).toBeVisible();
    await expect(courseUnionSection.getByText("aerocu@torontomu.ca").first()).toBeVisible();
    await expect(courseUnionSection.getByText("Here's how to get involved")).toHaveCount(0);
  });

  test("No program + same interests: top match is unchanged and there is no course union section", async ({
    page,
  }) => {
    await page.goto(resultsUrl(["vehicles", "competitions", "robots"]));

    const topMatchSection = page.locator("section", { has: page.getByText("Your Top Match") });
    await expect(
      topMatchSection.getByRole("heading", { name: "Canadian National Concrete Canoe Team" })
    ).toBeVisible();

    await expect(page.getByText("Your Course Union")).toHaveCount(0);
  });

  test("Mechatronics + any interests: Mechatronics Course Union shown in its section, not Mechanical's", async ({
    page,
  }) => {
    await page.goto(resultsUrl(["electronics", "robots"], "mechatronics_engineering"));

    const courseUnionSection = page.locator("section", { has: page.getByText("Your Course Union") });
    await expect(
      courseUnionSection.getByRole("heading", { name: "Mechatronics Course Union (MCU)" })
    ).toBeVisible();

    await expect(page.getByText("Mechanical Engineering Course Union", { exact: false })).toHaveCount(0);
  });

  test("shows the top 3 teams total (1 top match + 2 you might also like)", async ({ page }) => {
    await page.goto(
      resultsUrl(["vehicles", "competitions", "robots"], "aerospace_engineering")
    );

    const topMatchSection = page.locator("section", { has: page.getByText("Your Top Match") });
    await expect(topMatchSection.locator("h3")).toHaveCount(1);

    const alsoLikeSection = page.locator("section", { has: page.getByText("You Might Also Like") });
    await expect(alsoLikeSection.locator("h3")).toHaveCount(2);
  });

  test("no Instagram link renders while every group's instagram field is still null", async ({
    page,
  }) => {
    await page.goto(
      resultsUrl(["vehicles", "competitions", "robots"], "aerospace_engineering")
    );

    await expect(page.getByRole("link", { name: "Instagram" })).toHaveCount(0);
  });
});
