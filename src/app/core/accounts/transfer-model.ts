import type { Money } from "./account-model";

export type Transfer = {
	readonly id: string;
	readonly sourceAccountId: string;
	readonly destinationAccountId: string;
	readonly amount: Money;
	readonly occurredAt: string;
	readonly description: string;
};

export type PostTransferInput = {
	readonly sourceAccountId: string;
	readonly destinationAccountId: string;
	readonly amount: string;
	readonly currency: string;
	readonly occurredAt: string;
	readonly description: string;
};

export type TransferValidationField =
	| "sourceAccount"
	| "destinationAccount"
	| "amount"
	| "currency"
	| "occurredAt"
	| "description";

export type TransferValidationCode =
	| "source-account-required"
	| "source-account-not-found"
	| "source-account-not-eligible"
	| "destination-account-required"
	| "destination-account-not-found"
	| "destination-account-not-eligible"
	| "accounts-same"
	| "currency-required"
	| "currency-unsupported"
	| "currency-mismatch"
	| "amount-invalid"
	| "insufficient-balance"
	| "date-invalid"
	| "description-required";

export type TransferValidationError = {
	readonly field: TransferValidationField;
	readonly code: TransferValidationCode;
	readonly message: string;
};

export type ValidatedTransferInput = {
	readonly sourceAccountId: string;
	readonly destinationAccountId: string;
	readonly amount: Money;
	readonly occurredAt: string;
	readonly description: string;
};

export type TransferOperationResult =
	| { readonly success: true; readonly transfer: Transfer }
	| { readonly success: false; readonly error: TransferValidationError };

export const INITIAL_TRANSFER_SEQUENCE = 1;
export const TRANSFER_SEQUENCE_INCREMENT = 1;
export const TRANSFER_ID_PREFIX = "transfer-";
