import { TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { AccountStore } from "./account-store";

const ACCOUNT_COUNT_FOR_SCALE_TEST = 10;

describe("AccountStore", () => {
	function createStore(): InstanceType<typeof AccountStore> {
		TestBed.configureTestingModule({ providers: [AccountStore] });
		return TestBed.inject(AccountStore);
	}

	it("starts empty and records a traceable exact opening balance", () => {
		const store = createStore();

		expect(store.accountCount()).toBe(0);
		expect(store.copSummary()).toEqual({
			currency: "COP",
			availableMinorUnits: 0n,
			outstandingMinorUnits: 0n,
		});

		const result = store.createAccount({
			name: "  Daily account  ",
			type: "checking",
			currency: "COP",
			openingBalance: "1250000",
		});

		expect(result.success).toBe(true);
		if (!result.success) {
			return;
		}

		expect(result.account.name).toBe("Daily account");
		expect(result.account.balance).toEqual({
			currency: "COP",
			minorUnits: 1250000n,
		});
		expect(result.account.openingBalanceEvent).toEqual({
			id: "account-1-opening",
			kind: "opening-balance",
			amount: result.account.openingBalance,
		});
		expect(store.entities()[0]).toBe(result.account);
	});

	it("keeps currency and asset/liability summaries independent", () => {
		const store = createStore();

		store.createAccount({
			name: "Savings",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Card",
			type: "credit-card",
			currency: "COP",
			openingBalance: "25000",
		});
		store.createAccount({
			name: "Cash",
			type: "cash",
			currency: "USD",
			openingBalance: "10.50",
		});

		expect(store.copSummary()).toEqual({
			currency: "COP",
			availableMinorUnits: 100000n,
			outstandingMinorUnits: 25000n,
		});
		expect(store.usdSummary()).toEqual({
			currency: "USD",
			availableMinorUnits: 1050n,
			outstandingMinorUnits: 0n,
		});
	});

	it("posts income and asset expenses atomically with derived balances", () => {
		const store = createStore();
		const accountResult = store.createAccount({
			name: "Principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});

		expect(accountResult.success).toBe(true);
		if (!accountResult.success) {
			return;
		}

		const income = store.postTransaction({
			type: "income",
			accountId: accountResult.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Pago",
		});
		const expense = store.postTransaction({
			type: "expense",
			accountId: accountResult.account.id,
			amount: "10000",
			currency: "COP",
			occurredAt: "2026-09-20T08:00",
			description: "Mercado",
		});

		expect(income.success).toBe(true);
		expect(expense.success).toBe(true);
		expect(store.entities()[0].balance).toEqual({
			currency: "COP",
			minorUnits: 115000n,
		});
		expect(store.transactionCount()).toBe(2);
		expect(store.transactions().map(({ id }) => id)).toEqual([
			"transaction-2",
			"transaction-1",
		]);
	});

	it("keeps rejected posts out of balances, summaries, and history", () => {
		const store = createStore();
		const accountResult = store.createAccount({
			name: "Principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});

		expect(accountResult.success).toBe(true);
		if (!accountResult.success) {
			return;
		}

		const before = {
			accounts: store.entities(),
			summary: store.copSummary(),
			transactions: store.transactions(),
		};
		const rejected = store.postTransaction({
			type: "expense",
			accountId: accountResult.account.id,
			amount: "100001",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Compra imposible",
		});

		expect(rejected).toMatchObject({
			success: false,
			error: { code: "insufficient-balance" },
		});
		expect(store.entities()).toEqual(before.accounts);
		expect(store.copSummary()).toEqual(before.summary);
		expect(store.transactions()).toEqual(before.transactions);
	});

	it("keeps credit-card expenses as liabilities and resets both collections", () => {
		const store = createStore();
		const accountResult = store.createAccount({
			name: "Tarjeta",
			type: "credit-card",
			currency: "USD",
		});

		expect(accountResult.success).toBe(true);
		if (!accountResult.success) {
			return;
		}

		store.postTransaction({
			type: "expense",
			accountId: accountResult.account.id,
			amount: "12.50",
			currency: "USD",
			occurredAt: "2026-09-19T08:00",
			description: "Compra",
		});

		expect(store.usdSummary().outstandingMinorUnits).toBe(1250n);
		expect(store.entities()[0].balance.minorUnits).toBe(1250n);
		expect(store.transactionCount()).toBe(1);

		store.resetSession();

		expect(store.transactionCount()).toBe(0);
		expect(store.transactions()).toEqual([]);
		expect(store.accountCount()).toBe(0);
	});

	it("conserves exact money across a paired same-currency transfer", () => {
		const store = createStore();
		const source = store.createAccount({
			name: "Ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		const destination = store.createAccount({
			name: "Efectivo",
			type: "cash",
			currency: "COP",
			openingBalance: "10000",
		});

		expect(source.success).toBe(true);
		expect(destination.success).toBe(true);
		if (!source.success || !destination.success) {
			return;
		}

		const result = store.postTransfer({
			sourceAccountId: source.account.id,
			destinationAccountId: destination.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Organizar efectivo",
		});

		expect(result).toMatchObject({
			success: true,
			transfer: {
				id: "transfer-1",
				sourceAccountId: source.account.id,
				destinationAccountId: destination.account.id,
			},
		});
		expect(
			store.entities().find(({ id }) => id === source.account.id)?.balance,
		).toEqual({
			currency: "COP",
			minorUnits: 75000n,
		});
		expect(
			store.entities().find(({ id }) => id === destination.account.id)?.balance,
		).toEqual({
			currency: "COP",
			minorUnits: 35000n,
		});
		expect(store.copSummary().availableMinorUnits).toBe(110000n);
		expect(store.transferCount()).toBe(1);
		expect(store.transfers()[0].id).toBe("transfer-1");
	});

	it("rejects transfer failures without changing either side or history", () => {
		const store = createStore();
		const source = store.createAccount({
			name: "Ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		const destination = store.createAccount({
			name: "Dólares",
			type: "cash",
			currency: "USD",
			openingBalance: "10.00",
		});

		expect(source.success).toBe(true);
		expect(destination.success).toBe(true);
		if (!source.success || !destination.success) {
			return;
		}

		const before = {
			accounts: store.entities(),
			cop: store.copSummary(),
			usd: store.usdSummary(),
			transfers: store.transfers(),
		};
		const crossCurrency = store.postTransfer({
			sourceAccountId: source.account.id,
			destinationAccountId: destination.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "No convertir",
		});

		expect(crossCurrency).toMatchObject({
			success: false,
			error: { code: "currency-mismatch" },
		});
		expect(store.entities()).toEqual(before.accounts);
		expect(store.copSummary()).toEqual(before.cop);
		expect(store.usdSummary()).toEqual(before.usd);
		expect(store.transfers()).toEqual(before.transfers);
	});

	it("rejects invalid operations without changing the complete session state", () => {
		const store = createStore();
		store.createAccount({
			name: "Primary",
			type: "checking",
			currency: "USD",
			openingBalance: "20.00",
		});
		const before = {
			entities: store.entities(),
			count: store.accountCount(),
			summary: store.usdSummary(),
		};

		const duplicate = store.createAccount({
			name: " primary ",
			type: "cash",
			currency: "USD",
			openingBalance: "999.99",
		});
		const malformed = store.createAccount({
			name: "Malformed",
			type: "cash",
			currency: "USD",
			openingBalance: "1.234",
		});

		expect(duplicate).toMatchObject({
			success: false,
			error: { code: "duplicate-account", field: "account" },
		});
		expect(malformed).toMatchObject({
			success: false,
			error: { code: "opening-balance-invalid", field: "openingBalance" },
		});
		expect(store.entities()).toEqual(before.entities);
		expect(store.accountCount()).toBe(before.count);
		expect(store.usdSummary()).toEqual(before.summary);
	});

	it("supports the expected session scale and deterministic reset", () => {
		const store = createStore();

		for (let index = 0; index < ACCOUNT_COUNT_FOR_SCALE_TEST; index += 1) {
			store.createAccount({
				name: `Account ${index}`,
				type: "cash",
				currency: "COP",
			});
		}

		expect(store.accountCount()).toBe(ACCOUNT_COUNT_FOR_SCALE_TEST);
		expect(store.entities()).toHaveLength(ACCOUNT_COUNT_FOR_SCALE_TEST);

		store.resetSession();

		expect(store.accountCount()).toBe(0);
		expect(store.entities()).toEqual([]);
		const result = store.createAccount({
			name: "After reset",
			type: "cash",
			currency: "COP",
		});
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.account.id).toBe("account-1");
		}
	});
});
