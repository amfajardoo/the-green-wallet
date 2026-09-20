import { describe, expect, it } from "vitest";
import type { Account } from "./account-model";
import { validatePostTransactionInput } from "./transaction-validation";

const assetAccount: Account = {
	id: "account-1",
	name: "Cuenta principal",
	normalizedName: "cuenta principal",
	type: "checking",
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
	...assetAccount,
	id: "account-2",
	name: "Tarjeta",
	normalizedName: "tarjeta",
	type: "credit-card",
	currency: "USD",
	balance: { currency: "USD", minorUnits: 0n },
	openingBalance: { currency: "USD", minorUnits: 0n },
	openingBalanceEvent: {
		id: "account-2-opening",
		kind: "opening-balance",
		amount: { currency: "USD", minorUnits: 0n },
	},
};

const validBase = {
	type: "income",
	accountId: assetAccount.id,
	currency: "COP",
	occurredAt: "2026-09-19T08:00",
	description: "  Pago de nómina  ",
};

describe("validatePostTransactionInput", () => {
	it("normalizes a valid input with exact money and metadata", () => {
		const result = validatePostTransactionInput(
			{ ...validBase, amount: "25000" },
			[assetAccount],
			[],
		);

		expect(result).toMatchObject({
			success: true,
			value: {
				accountId: assetAccount.id,
				amount: { currency: "COP", minorUnits: 25000n },
				description: "Pago de nómina",
			},
		});
	});

	it.each(["", "0", "-1", "1.25", "abc"])(
		"rejects invalid COP amount %s",
		(amount) => {
			const result = validatePostTransactionInput(
				{ ...validBase, amount },
				[assetAccount],
				[],
			);

			expect(result).toMatchObject({
				success: false,
				error: { field: "amount", code: "amount-invalid" },
			});
		},
	);

	it("rejects unsupported account semantics and currency mixing", () => {
		const cardIncome = validatePostTransactionInput(
			{
				...validBase,
				accountId: cardAccount.id,
				currency: "USD",
				amount: "1.00",
			},
			[cardAccount],
			[],
		);
		const mixedCurrency = validatePostTransactionInput(
			{ ...validBase, currency: "USD", amount: "1" },
			[assetAccount],
			[],
		);

		expect(cardIncome).toMatchObject({
			success: false,
			error: { code: "account-not-eligible" },
		});
		expect(mixedCurrency).toMatchObject({
			success: false,
			error: { code: "currency-mismatch" },
		});
	});

	it("rejects whitespace descriptions and insufficient asset expenses", () => {
		const blankDescription = validatePostTransactionInput(
			{ ...validBase, description: "   ", amount: "1" },
			[assetAccount],
			[],
		);
		const insufficient = validatePostTransactionInput(
			{ ...validBase, type: "expense", amount: "100001" },
			[assetAccount],
			[],
		);

		expect(blankDescription).toMatchObject({
			success: false,
			error: { code: "description-required" },
		});
		expect(insufficient).toMatchObject({
			success: false,
			error: { code: "insufficient-balance" },
		});
	});

	it("allows expenses against a credit card with zero opening balance", () => {
		const result = validatePostTransactionInput(
			{
				type: "expense",
				accountId: cardAccount.id,
				currency: "USD",
				amount: "12.50",
				occurredAt: "2026-09-19T08:00",
				description: "Compra",
			},
			[cardAccount],
			[],
		);

		expect(result).toMatchObject({
			success: true,
			value: { amount: { currency: "USD", minorUnits: 1250n } },
		});
	});
});
