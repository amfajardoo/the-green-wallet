import type { NavigationDestination } from "./navigation.types";

export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
	{
		id: "accounts",
		label: "Accounts",
		route: "/accounts",
		description: "Create and review your current-session accounts.",
	},
];
