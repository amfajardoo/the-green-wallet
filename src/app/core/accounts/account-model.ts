export const ACCOUNT_TYPES = [
	"savings",
	"checking",
	"cash",
	"credit-card",
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];

export const CURRENCIES = ["COP", "USD"] as const;

export type Currency = (typeof CURRENCIES)[number];

export type Money = {
	readonly currency: Currency;
	readonly minorUnits: bigint;
};

export type OpeningBalanceEvent = {
	readonly id: string;
	readonly kind: "opening-balance";
	readonly amount: Money;
};

export type Account = {
	readonly id: string;
	readonly name: string;
	readonly normalizedName: string;
	readonly type: AccountType;
	readonly currency: Currency;
	readonly balance: Money;
	readonly openingBalance: Money;
	readonly openingBalanceEvent: OpeningBalanceEvent;
};

export type CreateAccountInput = {
	readonly name: string;
	readonly type: string;
	readonly currency: string;
	readonly openingBalance?: string;
};

export type AccountValidationField =
	| "name"
	| "type"
	| "currency"
	| "openingBalance"
	| "account";

export type AccountValidationCode =
	| "name-required"
	| "type-required"
	| "type-unsupported"
	| "currency-required"
	| "currency-unsupported"
	| "duplicate-account"
	| "opening-balance-invalid";

export type AccountValidationError = {
	readonly field: AccountValidationField;
	readonly code: AccountValidationCode;
	readonly message: string;
};

export type AccountSummary = {
	readonly currency: Currency;
	readonly availableMinorUnits: bigint;
	readonly outstandingMinorUnits: bigint;
};

export type AccountOperationResult =
	| { readonly success: true; readonly account: Account }
	| { readonly success: false; readonly error: AccountValidationError };

export type ValidatedAccountInput = {
	readonly name: string;
	readonly normalizedName: string;
	readonly type: AccountType;
	readonly currency: Currency;
	readonly openingBalance: Money;
};

export const INITIAL_ACCOUNT_SEQUENCE = 1;
export const ACCOUNT_SEQUENCE_INCREMENT = 1;
export const ACCOUNT_ID_PREFIX = "account-";
