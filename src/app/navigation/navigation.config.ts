import type { NavigationDestination } from "./navigation.types";

export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
	{
		id: "accounts",
		label: "Cuentas",
		route: "/accounts",
		description: "Crea y revisa tus cuentas durante esta sesión.",
	},
];
