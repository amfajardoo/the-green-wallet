import { Component, computed, inject, signal } from "@angular/core";
import {
	FormField,
	form,
	required,
	submit,
	validate,
} from "@angular/forms/signals";
import {
	ACCOUNT_TYPES,
	type Account,
	type AccountType,
	type AccountValidationError,
	CURRENCIES,
	type Currency,
} from "../../core/accounts/account-model";
import { formatMoney, parseMoney } from "../../core/accounts/account-money";
import { AccountStore } from "../../core/accounts/account-store";

type AccountFormModel = {
	name: string;
	type: string;
	currency: string;
	openingBalance: string;
};

const INITIAL_FORM_MODEL: AccountFormModel = {
	name: "",
	type: "",
	currency: "",
	openingBalance: "",
};

const ACCOUNT_TYPE_LABELS: Readonly<Record<AccountType, string>> = {
	savings: "Savings account",
	checking: "Checking account",
	cash: "Cash",
	"credit-card": "Credit card",
};

const ACCOUNT_TYPE_DESCRIPTIONS: Readonly<Record<AccountType, string>> = {
	savings: "Money set aside for goals and reserves.",
	checking: "Your everyday spending account.",
	cash: "Cash held outside a bank account.",
	"credit-card": "An outstanding liability you owe.",
};

function isCurrency(value: string): value is Currency {
	return CURRENCIES.includes(value as Currency);
}

@Component({
	selector: "app-account-page",
	imports: [FormField],
	templateUrl: "./account-page.html",
	styleUrl: "./account-page.component.css",
})
export class AccountPage {
	protected readonly store = inject(AccountStore);
	protected readonly accountTypes = ACCOUNT_TYPES;
	protected readonly currencies = CURRENCIES;
	protected readonly typeLabels = ACCOUNT_TYPE_LABELS;
	protected readonly typeDescriptions = ACCOUNT_TYPE_DESCRIPTIONS;
	protected readonly formModel = signal<AccountFormModel>({
		...INITIAL_FORM_MODEL,
	});
	protected readonly submissionError = signal<
		AccountValidationError | undefined
	>(undefined);
	protected readonly accountForm = form(this.formModel, (schema) => {
		required(schema.name, { message: "Enter an account name." });
		validate(schema.name, ({ value }) => {
			if (value().trim().length === 0) {
				return {
					kind: "name-whitespace",
					message: "Use at least one visible character in the account name.",
				};
			}

			return undefined;
		});
		required(schema.type, { message: "Select an account type." });
		required(schema.currency, { message: "Select a currency." });
		validate(schema.openingBalance, ({ value, valueOf: readValueOf }) => {
			const rawValue = value().trim();

			if (rawValue.length === 0) {
				return undefined;
			}

			const rawCurrency = readValueOf(schema.currency);

			if (!isCurrency(rawCurrency)) {
				return undefined;
			}

			if (parseMoney(rawValue, rawCurrency).success) {
				return undefined;
			}

			return {
				kind: "opening-balance-format",
				message:
					rawCurrency === "COP"
						? "Use a non-negative whole COP amount."
						: "Use a non-negative USD amount with up to two decimal places.",
			};
		});
	});
	protected readonly hasAccounts = computed(
		() => this.store.accountCount() > 0,
	);

	protected formatBalance(account: Account): string {
		return formatMoney(account.balance);
	}

	protected balanceLabel(account: Account): string {
		return account.type === "credit-card"
			? "Outstanding liability"
			: "Available balance";
	}

	protected accountTypeLabel(type: AccountType): string {
		return ACCOUNT_TYPE_LABELS[type];
	}

	protected summaryAmount(
		currency: Currency,
		kind: "available" | "outstanding",
	): string {
		const summary =
			currency === "COP" ? this.store.copSummary() : this.store.usdSummary();
		const minorUnits =
			kind === "available"
				? summary.availableMinorUnits
				: summary.outstandingMinorUnits;

		return formatMoney({ currency, minorUnits });
	}

	protected onSubmit(event: SubmitEvent): void {
		event.preventDefault();
		this.submissionError.set(undefined);

		void submit(this.accountForm, async () => {
			const result = this.store.createAccount(this.formModel());

			if (!result.success) {
				this.submissionError.set(result.error);
				return;
			}

			this.formModel.set({ ...INITIAL_FORM_MODEL });
			this.accountForm().reset();
		});
	}
}
