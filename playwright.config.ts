import { defineConfig, devices } from "@playwright/test";

const baseURL =
	process.env.PLAYWRIGHT_BASE_URL ??
	process.env.PLAYWRIGHT_TEST_BASE_URL ??
	"http://127.0.0.1:4200";

const usesExistingEndpoint = Boolean(
	process.env.PLAYWRIGHT_BASE_URL || process.env.PLAYWRIGHT_TEST_BASE_URL,
);

export default defineConfig({
	testDir: "./e2e",
	fullyParallel: true,
	forbidOnly: Boolean(process.env.CI),
	retries: process.env.CI ? 1 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: [
		["list"],
		["html", { outputFolder: "playwright-report", open: "never" }],
	],
	outputDir: "test-results",
	use: {
		baseURL,
		screenshot: "only-on-failure",
		trace: "retain-on-failure",
		video: "off",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: usesExistingEndpoint
		? undefined
		: {
				command: "pnpm start -- --host 127.0.0.1 --port 4200",
				url: baseURL,
				reuseExistingServer: !process.env.CI,
				timeout: 120_000,
				stdout: "pipe",
				stderr: "pipe",
			},
});
