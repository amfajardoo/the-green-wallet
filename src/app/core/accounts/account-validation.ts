import {
	ACCOUNT_TYPES,
	type Account,
	type AccountType,
	type AccountValidationError,
	type CreateAccountInput,
	CURRENCIES,
	type Currency,
	type ValidatedAccountInput,
} from "./account-model";
import { parseMoney } from "./account-money";

const EMPTY_TEXT = "";

export type AccountValidationResult =
	| { readonly success: true; readonly value: ValidatedAccountInput }
	| { readonly success: false; readonly error: AccountValidationError };

function isAccountType(value: string): value is AccountType {
	return ACCOUNT_TYPES.includes(value as AccountType);
}

function isCurrency(value: string): value is Currency {
	return CURRENCIES.includes(value as Currency);
}

function error(
	field: AccountValidationError["field"],
	code: AccountValidationError["code"],
	message: string,
): AccountValidationResult {
	return { success: false, error: { field, code, message } };
}

export function validateCreateAccountInput(
	input: CreateAccountInput,
	existingAccounts: readonly Account[],
): AccountValidationResult {
	const name = input.name.trim();

	if (name === EMPTY_TEXT) {
		return error(
			"name",
			"name-required",
			"Enter an account name with at least one visible character.",
		);
	}

	if (input.type === EMPTY_TEXT) {
		return error("type", "type-required", "Select an account type.");
	}

	if (!isAccountType(input.type)) {
		return error(
			"type",
			"type-unsupported",
			"Select savings, checking, cash, or credit card.",
		);
	}

	if (input.currency === EMPTY_TEXT) {
		return error("currency", "currency-required", "Select a currency.");
	}

	if (!isCurrency(input.currency)) {
		return error("currency", "currency-unsupported", "Select COP or USD.");
	}

	const normalizedName = name.toLowerCase();
	const duplicate = existingAccounts.some(
		(account) =>
			account.normalizedName === normalizedName &&
			account.currency === input.currency,
	);

	if (duplicate) {
		return error(
			"account",
			"duplicate-account",
			"An account with this name already exists in the selected currency.",
		);
	}

	const parsedOpeningBalance = parseMoney(input.openingBalance, input.currency);

	if (!parsedOpeningBalance.success) {
		return error(
			"openingBalance",
			"opening-balance-invalid",
			input.currency === "COP"
				? "Enter a non-negative whole COP amount, or leave it empty for zero."
				: "Enter a non-negative USD amount with up to two decimal places, or leave it empty for zero.",
		);
	}

	return {
		success: true,
		value: {
			name,
			normalizedName,
			type: input.type,
			currency: input.currency,
			openingBalance: parsedOpeningBalance.money,
		},
	};
}
