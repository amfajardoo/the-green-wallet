import { describe, expect, it } from "vitest";
import type { Account } from "./account-model";
import { validatePostTransferInput } from "./transfer-validation";

const copSource: Account = {
	id: "account-1",
	name: "Ahorros",
	normalizedName: "ahorros",
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

const copDestination: Account = {
	...copSource,
	id: "account-2",
	name: "Efectivo",
	normalizedName: "efectivo",
	type: "cash",
};

const usdAccount: Account = {
	...copDestination,
	id: "account-3",
	name: "Dólares",
	normalizedName: "dólares",
	currency: "USD",
	balance: { currency: "USD", minorUnits: 1000n },
	openingBalance: { currency: "USD", minorUnits: 1000n },
	openingBalanceEvent: {
		id: "account-3-opening",
		kind: "opening-balance",
		amount: { currency: "USD", minorUnits: 1000n },
	},
};

const validInput = {
	sourceAccountId: copSource.id,
	destinationAccountId: copDestination.id,
	amount: "25000",
	currency: "COP",
	occurredAt: "2026-09-19T08:00",
	description: "  Organizar efectivo  ",
};

describe("validatePostTransferInput", () => {
	it("normalizes a valid same-currency asset transfer", () => {
		const result = validatePostTransferInput(
			validInput,
			[copSource, copDestination],
			[],
			[],
		);

		expect(result).toMatchObject({
			success: true,
			value: {
				sourceAccountId: copSource.id,
				destinationAccountId: copDestination.id,
				amount: { currency: "COP", minorUnits: 25000n },
				description: "Organizar efectivo",
			},
		});
	});

	it("rejects the same account, card endpoints, and cross-currency pairs", () => {
		const sameAccount = validatePostTransferInput(
			{ ...validInput, destinationAccountId: copSource.id },
			[copSource, copDestination],
			[],
			[],
		);
		const crossCurrency = validatePostTransferInput(
			{ ...validInput, destinationAccountId: usdAccount.id },
			[copSource, usdAccount],
			[],
			[],
		);
		const card = { ...copDestination, type: "credit-card" as const };
		const cardEndpoint = validatePostTransferInput(
			{ ...validInput, destinationAccountId: card.id },
			[copSource, card],
			[],
			[],
		);

		expect(sameAccount).toMatchObject({
			success: false,
			error: { code: "accounts-same" },
		});
		expect(crossCurrency).toMatchObject({
			success: false,
			error: { code: "currency-mismatch" },
		});
		expect(cardEndpoint).toMatchObject({
			success: false,
			error: { code: "destination-account-not-eligible" },
		});
	});

	it("rejects malformed values and insufficient source balance", () => {
		const malformed = validatePostTransferInput(
			{ ...validInput, amount: "1.234" },
			[copSource, copDestination],
			[],
			[],
		);
		const insufficient = validatePostTransferInput(
			{ ...validInput, amount: "100001" },
			[copSource, copDestination],
			[],
			[],
		);

		expect(malformed).toMatchObject({
			success: false,
			error: { code: "amount-invalid" },
		});
		expect(insufficient).toMatchObject({
			success: false,
			error: { code: "insufficient-balance" },
		});
	});
});
