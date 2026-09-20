import type { NavigationDestination } from "./navigation.types";

export const NAVIGATION_DESTINATIONS: readonly NavigationDestination[] = [
	{
		id: "accounts",
		label: "Cuentas",
		route: "/accounts",
		description: "Crea y revisa tus cuentas durante esta sesión.",
	},
	{
		id: "transactions",
		label: "Movimientos",
		route: "/transactions",
		description: "Registra ingresos y gastos con su efecto exacto.",
	},
];
