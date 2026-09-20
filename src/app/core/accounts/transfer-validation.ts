import { type Account, CURRENCIES, type Currency } from "./account-model";
import { parseMoney } from "./account-money";
import { projectAccountBalance } from "./transaction-balance";
import type { Transaction } from "./transaction-model";
import type {
	PostTransferInput,
	Transfer,
	TransferValidationError,
	ValidatedTransferInput,
} from "./transfer-model";

const EMPTY_TEXT = "";
const ZERO_MINOR_UNITS = 0n;

function error(
	field: TransferValidationError["field"],
	code: TransferValidationError["code"],
	message: string,
): { success: false; error: TransferValidationError } {
	return { success: false, error: { field, code, message } };
}

function isCurrency(value: string): value is Currency {
	return CURRENCIES.includes(value as Currency);
}

function normalizeDate(value: string): string | undefined {
	const trimmedValue = value.trim();

	if (trimmedValue === EMPTY_TEXT) {
		return undefined;
	}

	const date = new Date(trimmedValue);

	return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export function validatePostTransferInput(
	input: PostTransferInput,
	accounts: readonly Account[],
	transactions: readonly Transaction[],
	transfers: readonly Transfer[],
):
	| { readonly success: true; readonly value: ValidatedTransferInput }
	| { readonly success: false; readonly error: TransferValidationError } {
	const sourceAccountId = input.sourceAccountId.trim();

	if (sourceAccountId === EMPTY_TEXT) {
		return error(
			"sourceAccount",
			"source-account-required",
			"Selecciona la cuenta de origen.",
		);
	}

	const sourceAccount = accounts.find(
		(account) => account.id === sourceAccountId,
	);

	if (!sourceAccount) {
		return error(
			"sourceAccount",
			"source-account-not-found",
			"La cuenta de origen ya no está disponible.",
		);
	}

	if (sourceAccount.type === "credit-card") {
		return error(
			"sourceAccount",
			"source-account-not-eligible",
			"La cuenta de origen debe ser de dinero disponible, no una tarjeta.",
		);
	}

	const destinationAccountId = input.destinationAccountId.trim();

	if (destinationAccountId === EMPTY_TEXT) {
		return error(
			"destinationAccount",
			"destination-account-required",
			"Selecciona la cuenta de destino.",
		);
	}

	if (sourceAccountId === destinationAccountId) {
		return error(
			"destinationAccount",
			"accounts-same",
			"La cuenta de origen y destino deben ser diferentes.",
		);
	}

	const destinationAccount = accounts.find(
		(account) => account.id === destinationAccountId,
	);

	if (!destinationAccount) {
		return error(
			"destinationAccount",
			"destination-account-not-found",
			"La cuenta de destino ya no está disponible.",
		);
	}

	if (destinationAccount.type === "credit-card") {
		return error(
			"destinationAccount",
			"destination-account-not-eligible",
			"La cuenta de destino debe ser una cuenta de dinero disponible.",
		);
	}

	if (sourceAccount.currency !== destinationAccount.currency) {
		return error(
			"currency",
			"currency-mismatch",
			"Las cuentas deben usar la misma moneda; no hay conversión automática.",
		);
	}

	const rawCurrency = input.currency.trim();

	if (rawCurrency === EMPTY_TEXT) {
		return error("currency", "currency-required", "Selecciona una moneda.");
	}

	if (!isCurrency(rawCurrency)) {
		return error("currency", "currency-unsupported", "Selecciona COP o USD.");
	}

	if (rawCurrency !== sourceAccount.currency) {
		return error(
			"currency",
			"currency-mismatch",
			`La moneda debe coincidir con las cuentas: ${sourceAccount.currency}.`,
		);
	}

	const parsedAmount = parseMoney(input.amount, sourceAccount.currency);

	if (
		!parsedAmount.success ||
		parsedAmount.money.minorUnits <= ZERO_MINOR_UNITS
	) {
		return error(
			"amount",
			"amount-invalid",
			sourceAccount.currency === "COP"
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
			"Agrega una descripción para explicar este traslado.",
		);
	}

	const value: ValidatedTransferInput = {
		sourceAccountId,
		destinationAccountId,
		amount: parsedAmount.money,
		occurredAt,
		description,
	};
	const sourceBalance = projectAccountBalance(
		sourceAccount,
		transactions,
		transfers,
	);

	if (value.amount.minorUnits > sourceBalance.minorUnits) {
		return error(
			"amount",
			"insufficient-balance",
			"El traslado supera el saldo disponible de la cuenta de origen.",
		);
	}

	return { success: true, value };
}
