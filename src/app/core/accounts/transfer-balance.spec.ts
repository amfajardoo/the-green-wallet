import { describe, expect, it } from "vitest";
import type { Account } from "./account-model";
import {
	sortTransfersNewestFirst,
	transferEffectMinorUnits,
} from "./transfer-balance";
import type { Transfer } from "./transfer-model";

const sourceAccount: Account = {
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

const destinationAccount: Account = {
	...sourceAccount,
	id: "account-2",
	name: "Efectivo",
	normalizedName: "efectivo",
	type: "cash",
	balance: { currency: "COP", minorUnits: 10000n },
	openingBalance: { currency: "COP", minorUnits: 10000n },
	openingBalanceEvent: {
		id: "account-2-opening",
		kind: "opening-balance",
		amount: { currency: "COP", minorUnits: 10000n },
	},
};

const transfer: Transfer = {
	id: "transfer-1",
	sourceAccountId: sourceAccount.id,
	destinationAccountId: destinationAccount.id,
	amount: { currency: "COP", minorUnits: 25000n },
	occurredAt: "2026-09-19T08:00:00.000Z",
	description: "Organizar efectivo",
};

describe("transfer-balance", () => {
	it("creates equal and opposite paired effects", () => {
		expect(transferEffectMinorUnits(sourceAccount, transfer)).toBe(-25000n);
		expect(transferEffectMinorUnits(destinationAccount, transfer)).toBe(25000n);
	});

	it("returns no effect for unrelated accounts", () => {
		expect(
			transferEffectMinorUnits({ ...sourceAccount, id: "account-3" }, transfer),
		).toBe(0n);
	});

	it("orders paired operations newest first", () => {
		const laterTransfer = {
			...transfer,
			id: "transfer-2",
			occurredAt: "2026-09-20T08:00:00.000Z",
		};

		expect(
			sortTransfersNewestFirst([transfer, laterTransfer]).map(({ id }) => id),
		).toEqual(["transfer-2", "transfer-1"]);
	});
});
