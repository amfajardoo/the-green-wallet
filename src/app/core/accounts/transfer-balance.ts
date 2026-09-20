import type { Account } from "./account-model";
import type { Transfer } from "./transfer-model";

const ZERO_MINOR_UNITS = 0n;

export function transferEffectMinorUnits(
	account: Account,
	transfer: Transfer,
): bigint {
	if (transfer.sourceAccountId === account.id) {
		return -transfer.amount.minorUnits;
	}

	if (transfer.destinationAccountId === account.id) {
		return transfer.amount.minorUnits;
	}

	return ZERO_MINOR_UNITS;
}

export function sortTransfersNewestFirst(
	transfers: readonly Transfer[],
): Transfer[] {
	return [...transfers].sort((left, right) => {
		const dateDifference =
			Date.parse(right.occurredAt) - Date.parse(left.occurredAt);

		return dateDifference !== 0
			? dateDifference
			: right.id.localeCompare(left.id, "en");
	});
}
