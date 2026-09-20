import type { Money } from "./account-model";

export const TRANSACTION_TYPES = ["income", "expense"] as const;

export type TransactionType = (typeof TRANSACTION_TYPES)[number];

export type Transaction = {
	readonly id: string;
	readonly type: TransactionType;
	readonly accountId: string;
	readonly amount: Money;
	readonly occurredAt: string;
	readonly description: string;
};

export type PostTransactionInput = {
	readonly type: string;
	readonly accountId: string;
	readonly amount: string;
	readonly currency: string;
	readonly occurredAt: string;
	readonly description: string;
};

export type TransactionValidationField =
	| "type"
	| "account"
	| "amount"
	| "currency"
	| "occurredAt"
	| "description";

export type TransactionValidationCode =
	| "type-required"
	| "type-unsupported"
	| "account-required"
	| "account-not-found"
	| "account-not-eligible"
	| "amount-invalid"
	| "currency-required"
	| "currency-unsupported"
	| "currency-mismatch"
	| "date-invalid"
	| "description-required"
	| "insufficient-balance";

export type TransactionValidationError = {
	readonly field: TransactionValidationField;
	readonly code: TransactionValidationCode;
	readonly message: string;
};

export type ValidatedTransactionInput = {
	readonly type: TransactionType;
	readonly accountId: string;
	readonly amount: Money;
	readonly occurredAt: string;
	readonly description: string;
};

export type TransactionOperationResult =
	| { readonly success: true; readonly transaction: Transaction }
	| { readonly success: false; readonly error: TransactionValidationError };

export const INITIAL_TRANSACTION_SEQUENCE = 1;
export const TRANSACTION_SEQUENCE_INCREMENT = 1;
export const TRANSACTION_ID_PREFIX = "transaction-";
