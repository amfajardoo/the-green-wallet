import type { Currency, Money } from "./account-model";

const COP_SCALE = 0;
const USD_SCALE = 2;
const ZERO_MINOR_UNITS = 0n;
const DECIMAL_RADIX = 10n;
const ZERO_DIGIT = "0";
const EMPTY_TEXT = "";
const DECIMAL_SEPARATOR = ".";
const GROUP_SEPARATOR = ",";
const ONE_DIGIT = 1;
const MONEY_PATTERN = /^(\d+)(?:\.(\d+))?$/;

export const CURRENCY_SCALE: Readonly<Record<Currency, number>> = {
	COP: COP_SCALE,
	USD: USD_SCALE,
};

export type MoneyParseResult =
	| { readonly success: true; readonly money: Money }
	| { readonly success: false };

export function parseMoney(
	value: string | undefined,
	currency: Currency,
): MoneyParseResult {
	const trimmedValue = value?.trim() ?? EMPTY_TEXT;

	if (trimmedValue === EMPTY_TEXT) {
		return {
			success: true,
			money: { currency, minorUnits: ZERO_MINOR_UNITS },
		};
	}

	const match = MONEY_PATTERN.exec(trimmedValue);

	if (!match) {
		return { success: false };
	}

	const integerPart = match[1];
	const fractionalPart = match[2] ?? EMPTY_TEXT;
	const scale = CURRENCY_SCALE[currency];

	if (fractionalPart.length > scale) {
		return { success: false };
	}

	const paddedFraction = fractionalPart.padEnd(scale, ZERO_DIGIT);
	const multiplier = DECIMAL_RADIX ** BigInt(scale);
	const fractionalUnits =
		paddedFraction === EMPTY_TEXT ? ZERO_MINOR_UNITS : BigInt(paddedFraction);

	return {
		success: true,
		money: {
			currency,
			minorUnits: BigInt(integerPart) * multiplier + fractionalUnits,
		},
	};
}

export function formatMoney(money: Money): string {
	const scale = CURRENCY_SCALE[money.currency];
	const digits = money.minorUnits.toString();
	const minimumDigits = scale + ONE_DIGIT;
	const paddedDigits = digits.padStart(minimumDigits, ZERO_DIGIT);
	const wholeDigits =
		scale === COP_SCALE ? paddedDigits : paddedDigits.slice(0, -scale);
	const fractionDigits =
		scale === COP_SCALE ? EMPTY_TEXT : paddedDigits.slice(-scale);
	const groupedWholeDigits = wholeDigits.replace(
		/\B(?=(\d{3})+(?!\d))/g,
		GROUP_SEPARATOR,
	);

	return `${money.currency} ${groupedWholeDigits}${
		fractionDigits === EMPTY_TEXT
			? EMPTY_TEXT
			: `${DECIMAL_SEPARATOR}${fractionDigits}`
	}`;
}
