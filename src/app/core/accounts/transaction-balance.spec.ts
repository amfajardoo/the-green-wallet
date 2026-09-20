import { describe, expect, it } from "vitest";
import type { Account } from "./account-model";
import {
	projectAccountBalance,
	projectAccounts,
	sortTransactionsNewestFirst,
	summarizeAccounts,
} from "./transaction-balance";
import type { Transaction } from "./transaction-model";

const savingsAccount: Account = {
	id: "account-1",
	name: "Cuenta principal",
	normalizedName: "cuenta principal",
	type: "savings",
	currency: "COP",
	balance: { currency: "COP", minorUnits: 100000n },
	openingBalance: { currency: "COP", minorUnits: 100000n },
	openingBalanceEvent: {
		id: "account-1-opening",
		kind: "opening-balance",
		amount: { currency: "COP", minorUnits: 100000n },
	},
};

const cardAccount: Account = {
	...savingsAccount,
	id: "account-2",
	name: "Tarjeta",
	normalizedName: "tarjeta",
	type: "credit-card",
	balance: { currency: "USD", minorUnits: 2500n },
	openingBalance: { currency: "USD", minorUnits: 2500n },
	openingBalanceEvent: {
		id: "account-2-opening",
		kind: "opening-balance",
		amount: { currency: "USD", minorUnits: 2500n },
	},
	currency: "USD",
};

const transactions: Transaction[] = [
	{
		id: "transaction-1",
		type: "income",
		accountId: savingsAccount.id,
		amount: { currency: "COP", minorUnits: 25000n },
		occurredAt: "2026-09-19T08:00:00.000Z",
		description: "Pago",
	},
	{
		id: "transaction-2",
		type: "expense",
		accountId: savingsAccount.id,
		amount: { currency: "COP", minorUnits: 10000n },
		occurredAt: "2026-09-20T08:00:00.000Z",
		description: "Mercado",
	},
	{
		id: "transaction-3",
		type: "expense",
		accountId: cardAccount.id,
		amount: { currency: "USD", minorUnits: 1250n },
		occurredAt: "2026-09-21T08:00:00.000Z",
		description: "Compra",
	},
];

describe("transaction-balance", () => {
	it("derives asset balances from opening balance and posted events", () => {
		expect(projectAccountBalance(savingsAccount, transactions)).toEqual({
			currency: "COP",
			minorUnits: 115000n,
		});
	});

	it("increases credit-card liability without reducing an asset", () => {
		expect(projectAccountBalance(cardAccount, transactions)).toEqual({
			currency: "USD",
			minorUnits: 3750n,
		});
		expect(projectAccountBalance(savingsAccount, transactions)).toEqual({
			currency: "COP",
			minorUnits: 115000n,
		});
	});

	it("projects summaries without combining currencies or account meanings", () => {
		const accounts = projectAccounts(
			[savingsAccount, cardAccount],
			transactions,
		);

		expect(summarizeAccounts(accounts, "COP")).toEqual({
			currency: "COP",
			availableMinorUnits: 115000n,
			outstandingMinorUnits: 0n,
		});
		expect(summarizeAccounts(accounts, "USD")).toEqual({
			currency: "USD",
			availableMinorUnits: 0n,
			outstandingMinorUnits: 3750n,
		});
	});

	it("orders history newest first and uses the stable ID as a tie breaker", () => {
		const sameDateTransactions = transactions.map((transaction) => ({
			...transaction,
			occurredAt: "2026-09-19T08:00:00.000Z",
		}));

		expect(
			sortTransactionsNewestFirst(sameDateTransactions).map(({ id }) => id),
		).toEqual(["transaction-3", "transaction-2", "transaction-1"]);
	});
});
