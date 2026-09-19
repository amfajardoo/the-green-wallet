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
			"Escribe un nombre para la cuenta con al menos un carácter visible.",
		);
	}

	if (input.type === EMPTY_TEXT) {
		return error("type", "type-required", "Selecciona un tipo de cuenta.");
	}

	if (!isAccountType(input.type)) {
		return error(
			"type",
			"type-unsupported",
			"Selecciona cuenta de ahorros, cuenta corriente, efectivo o tarjeta de crédito.",
		);
	}

	if (input.currency === EMPTY_TEXT) {
		return error("currency", "currency-required", "Selecciona una moneda.");
	}

	if (!isCurrency(input.currency)) {
		return error("currency", "currency-unsupported", "Selecciona COP o USD.");
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
			"Ya existe una cuenta con este nombre en la moneda seleccionada.",
		);
	}

	const parsedOpeningBalance = parseMoney(input.openingBalance, input.currency);

	if (!parsedOpeningBalance.success) {
		return error(
			"openingBalance",
			"opening-balance-invalid",
			input.currency === "COP"
				? "Escribe un valor COP entero y no negativo, o déjalo vacío para empezar en cero."
				: "Escribe un valor USD no negativo con máximo dos decimales, o déjalo vacío para empezar en cero.",
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
