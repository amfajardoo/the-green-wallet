import type { Routes } from "@angular/router";

export const routes: Routes = [
	{
		path: "accounts",
		loadComponent: () =>
			import("./features/accounts/account-page").then(
				({ AccountPage }) => AccountPage,
			),
	},
	{
		path: "transactions",
		loadComponent: () =>
			import("./features/transactions/transaction-page").then(
				({ TransactionPage }) => TransactionPage,
			),
	},
	{
		path: "transfers",
		loadComponent: () =>
			import("./features/transfers/transfer-page").then(
				({ TransferPage }) => TransferPage,
			),
	},
	{ path: "", pathMatch: "full", redirectTo: "accounts" },
	{ path: "**", redirectTo: "accounts" },
];
