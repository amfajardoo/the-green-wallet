import { type Account, CURRENCIES, type Currency } from "./account-model";
import { parseMoney } from "./account-money";
import { projectAccountBalance } from "./transaction-balance";
import {
	type PostTransactionInput,
	TRANSACTION_TYPES,
	type Transaction,
	type TransactionType,
	type TransactionValidationError,
	type ValidatedTransactionInput,
} from "./transaction-model";

const EMPTY_TEXT = "";
const ZERO_MINOR_UNITS = 0n;

function error(
	field: TransactionValidationError["field"],
	code: TransactionValidationError["code"],
	message: string,
): { success: false; error: TransactionValidationError } {
	return { success: false, error: { field, code, message } };
}

function isCurrency(value: string): value is Currency {
	return CURRENCIES.includes(value as Currency);
}

function isTransactionType(value: string): value is TransactionType {
	return TRANSACTION_TYPES.includes(value as TransactionType);
}

function normalizeDate(value: string): string | undefined {
	const trimmedValue = value.trim();

	if (trimmedValue === EMPTY_TEXT) {
		return undefined;
	}

	const date = new Date(trimmedValue);

	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function validatePostTransactionInput(
	input: PostTransactionInput,
	accounts: readonly Account[],
	transactions: readonly Transaction[],
):
	| { readonly success: true; readonly value: ValidatedTransactionInput }
	| { readonly success: false; readonly error: TransactionValidationError } {
	if (input.type.trim() === EMPTY_TEXT) {
		return error("type", "type-required", "Selecciona un tipo de movimiento.");
	}

	if (!isTransactionType(input.type)) {
		return error("type", "type-unsupported", "Selecciona ingreso o gasto.");
	}

	const accountId = input.accountId.trim();

	if (accountId === EMPTY_TEXT) {
		return error("account", "account-required", "Selecciona una cuenta.");
	}

	const account = accounts.find((candidate) => candidate.id === accountId);

	if (!account) {
		return error(
			"account",
			"account-not-found",
			"La cuenta seleccionada ya no está disponible.",
		);
	}

	if (input.type === "income" && account.type === "credit-card") {
		return error(
			"account",
			"account-not-eligible",
			"Los ingresos solo se registran en cuentas de dinero disponible.",
		);
	}

	const rawCurrency = input.currency.trim();

	if (rawCurrency === EMPTY_TEXT) {
		return error("currency", "currency-required", "Selecciona una moneda.");
	}

	if (!isCurrency(rawCurrency)) {
		return error("currency", "currency-unsupported", "Selecciona COP o USD.");
	}

	if (rawCurrency !== account.currency) {
		return error(
			"currency",
			"currency-mismatch",
			`La moneda debe coincidir con la cuenta: ${account.currency}.`,
		);
	}

	const parsedAmount = parseMoney(input.amount, account.currency);

	if (
		!parsedAmount.success ||
		parsedAmount.money.minorUnits <= ZERO_MINOR_UNITS
	) {
		return error(
			"amount",
			"amount-invalid",
			account.currency === "COP"
				? "Escribe un valor COP entero mayor que cero."
				: "Escribe un valor USD mayor que cero con máximo dos decimales.",
		);
	}

	const occurredAt = normalizeDate(input.occurredAt);

	if (!occurredAt) {
		return error(
			"occurredAt",
			"date-invalid",
			"Escribe una fecha y hora válidas.",
		);
	}

	const description = input.description.trim();

	if (description === EMPTY_TEXT) {
		return error(
			"description",
			"description-required",
			"Agrega una descripción para explicar este movimiento.",
		);
	}

	const value: ValidatedTransactionInput = {
		type: input.type,
		accountId,
		amount: parsedAmount.money,
		occurredAt,
		description,
	};

	if (input.type === "expense" && account.type !== "credit-card") {
		const balance = projectAccountBalance(account, transactions);

		if (value.amount.minorUnits > balance.minorUnits) {
			return error(
				"amount",
				"insufficient-balance",
				"El gasto supera el saldo disponible de la cuenta.",
			);
		}
	}

	return { success: true, value };
}
