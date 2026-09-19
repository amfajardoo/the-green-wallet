import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "accounts",
		loadComponent: () =>
			import("./features/accounts/account-page").then(
				({ AccountPage }) => AccountPage,
			),
	},
	{ path: "", pathMatch: "full", redirectTo: "accounts" },
	{ path: "**", redirectTo: "accounts" },
];
