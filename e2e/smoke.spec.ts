import { expect, test } from "@playwright/test";

test("loads the application shell", async ({ page }) => {
	await page.goto("/");

	await expect(page).toHaveTitle("TheGreenWallet");
	await expect(page.getByRole("main")).toBeVisible();
	await expect(
		page.getByRole("heading", { name: "Hello, the-green-wallet" }),
	).toBeVisible();
});
