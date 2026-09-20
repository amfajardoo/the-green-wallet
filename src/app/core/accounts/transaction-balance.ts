import type { Account, AccountSummary, Currency, Money } from "./account-model";
import type { Transaction } from "./transaction-model";
import { transferEffectMinorUnits } from "./transfer-balance";
import type { Transfer } from "./transfer-model";

const ZERO_MINOR_UNITS = 0n;
const ACCOUNT_KIND_ASSET = "asset";
const ACCOUNT_KIND_LIABILITY = "liability";

function accountKind(
	account: Account,
): typeof ACCOUNT_KIND_ASSET | typeof ACCOUNT_KIND_LIABILITY {
	return account.type === "credit-card"
		? ACCOUNT_KIND_LIABILITY
		: ACCOUNT_KIND_ASSET;
}

export function transactionEffectMinorUnits(
	account: Account,
	transaction: Transaction,
): bigint {
	if (accountKind(account) === ACCOUNT_KIND_LIABILITY) {
		return transaction.type === "expense"
			? transaction.amount.minorUnits
			: -transaction.amount.minorUnits;
	}

	return transaction.type === "income"
		? transaction.amount.minorUnits
		: -transaction.amount.minorUnits;
}

export function projectAccountBalance(
	account: Account,
	transactions: readonly Transaction[],
	transfers: readonly Transfer[] = [],
): Money {
	let minorUnits = account.openingBalance.minorUnits;

	for (const transaction of transactions) {
		if (
			transaction.accountId === account.id &&
			transaction.amount.currency === account.currency
		) {
			minorUnits += transactionEffectMinorUnits(account, transaction);
		}
	}

	for (const transfer of transfers) {
		if (
			(transfer.sourceAccountId === account.id ||
				transfer.destinationAccountId === account.id) &&
			transfer.amount.currency === account.currency
		) {
			minorUnits += transferEffectMinorUnits(account, transfer);
		}
	}

	return { currency: account.currency, minorUnits };
}

export function projectAccounts(
	accounts: readonly Account[],
	transactions: readonly Transaction[],
	transfers: readonly Transfer[] = [],
): Account[] {
	return accounts.map((account) => ({
		...account,
		balance: projectAccountBalance(account, transactions, transfers),
	}));
}

export function summarizeAccounts(
	accounts: readonly Account[],
	currency: Currency,
): AccountSummary {
	let availableMinorUnits = ZERO_MINOR_UNITS;
	let outstandingMinorUnits = ZERO_MINOR_UNITS;

	for (const account of accounts) {
		if (account.currency !== currency) {
			continue;
		}

		if (accountKind(account) === ACCOUNT_KIND_LIABILITY) {
			outstandingMinorUnits += account.balance.minorUnits;
			continue;
		}

		availableMinorUnits += account.balance.minorUnits;
	}

	return { currency, availableMinorUnits, outstandingMinorUnits };
}

export function sortTransactionsNewestFirst(
	transactions: readonly Transaction[],
): Transaction[] {
	return [...transactions].sort((left, right) => {
		const dateDifference =
			Date.parse(right.occurredAt) - Date.parse(left.occurredAt);

		return dateDifference !== 0
			? dateDifference
			: right.id.localeCompare(left.id, "en");
	});
}
