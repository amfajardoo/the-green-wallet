import {
	afterNextRender,
	Component,
	computed,
	inject,
	signal,
} from "@angular/core";
import {
	FormField,
	form,
	required,
	submit,
	validate,
} from "@angular/forms/signals";
import type { Account, AccountType } from "../../core/accounts/account-model";
import { formatMoney, parseMoney } from "../../core/accounts/account-money";
import { AccountStore } from "../../core/accounts/account-store";
import {
	TRANSACTION_TYPES,
	type Transaction,
	type TransactionType,
	type TransactionValidationError,
} from "../../core/accounts/transaction-model";

type TransactionFormModel = {
	type: string;
	accountId: string;
	amount: string;
	currency: string;
	occurredAt: string;
	description: string;
};

type TransactionHistoryItem = {
	readonly transaction: Transaction;
	readonly account: Account | undefined;
};

const EMPTY_TEXT = "";
const INITIAL_FORM_MODEL: TransactionFormModel = {
	type: "income",
	accountId: EMPTY_TEXT,
	amount: EMPTY_TEXT,
	currency: EMPTY_TEXT,
	occurredAt: EMPTY_TEXT,
	description: EMPTY_TEXT,
};

const ACCOUNT_TYPE_LABELS: Readonly<Record<AccountType, string>> = {
	savings: "Cuenta de ahorros",
	checking: "Cuenta corriente",
	cash: "Efectivo",
	"credit-card": "Tarjeta de crédito",
};

const TRANSACTION_TYPE_LABELS: Readonly<Record<TransactionType, string>> = {
	income: "Ingreso",
	expense: "Gasto",
};

function localDateTimeValue(date: Date): string {
	const pad = (value: number): string => value.toString().padStart(2, "0");

	return [
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
		`${pad(date.getHours())}:${pad(date.getMinutes())}`,
	].join("T");
}

@Component({
	selector: "app-transaction-page",
	imports: [FormField],
	templateUrl: "./transaction-page.html",
})
export class TransactionPage {
	protected readonly store = inject(AccountStore);
	protected readonly transactionTypes = TRANSACTION_TYPES;
	protected readonly typeLabels = TRANSACTION_TYPE_LABELS;
	protected readonly accountTypeLabels = ACCOUNT_TYPE_LABELS;
	protected readonly formModel = signal<TransactionFormModel>({
		...INITIAL_FORM_MODEL,
	});
	protected readonly submissionError = signal<
		TransactionValidationError | undefined
	>(undefined);
	protected readonly successMessage = signal<string | undefined>(undefined);
	protected readonly selectableAccounts = computed(() => {
		const selectedType = this.formModel().type;

		return this.store
			.entities()
			.filter(
				(account) =>
					selectedType !== "income" || account.type !== "credit-card",
			);
	});
	protected readonly selectedAccount = computed(() => {
		const accountId = this.formModel().accountId;

		return this.store.entities().find((account) => account.id === accountId);
	});
	protected readonly selectedCurrency = computed(
		() => this.selectedAccount()?.currency ?? EMPTY_TEXT,
	);
	protected readonly history = computed<readonly TransactionHistoryItem[]>(() =>
		this.store.transactions().map((transaction) => ({
			transaction,
			account: this.store
				.entities()
				.find((account) => account.id === transaction.accountId),
		})),
	);
	protected readonly transactionForm = form(this.formModel, (schema) => {
		required(schema.type, { message: "Selecciona un tipo de movimiento." });
		required(schema.accountId, { message: "Selecciona una cuenta." });
		required(schema.amount, { message: "Escribe un valor mayor que cero." });
		validate(schema.amount, ({ value, valueOf: readValueOf }) => {
			const accountId = readValueOf(schema.accountId);
			const account = this.store
				.entities()
				.find((candidate) => candidate.id === accountId);

			if (!account || value().trim() === EMPTY_TEXT) {
				return undefined;
			}

			const parsed = parseMoney(value(), account.currency);

			if (parsed.success && parsed.money.minorUnits > 0n) {
				return undefined;
			}

			return {
				kind: "amount-format",
				message:
					account.currency === "COP"
						? "Usa un valor COP entero mayor que cero."
						: "Usa un valor USD mayor que cero con máximo dos decimales.",
			};
		});
		required(schema.occurredAt, { message: "Selecciona una fecha y hora." });
		required(schema.description, { message: "Agrega una descripción." });
		validate(schema.description, ({ value }) =>
			value().trim() === EMPTY_TEXT
				? {
						kind: "description-whitespace",
						message: "Agrega una descripción visible.",
					}
				: undefined,
		);
	});

	constructor() {
		afterNextRender(() => {
			if (this.formModel().occurredAt === EMPTY_TEXT) {
				this.formModel.update((model) => ({
					...model,
					occurredAt: localDateTimeValue(new Date()),
				}));
			}
		});
	}

	protected accountTypeLabel(type: AccountType): string {
		return ACCOUNT_TYPE_LABELS[type];
	}

	protected transactionTypeLabel(type: TransactionType): string {
		return TRANSACTION_TYPE_LABELS[type];
	}

	protected formatAmount(transaction: Transaction): string {
		const sign = transaction.type === "income" ? "+" : "−";

		return `${sign}${formatMoney(transaction.amount)}`;
	}

	protected formatDate(occurredAt: string): string {
		return new Intl.DateTimeFormat("es-CO", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(occurredAt));
	}

	protected fieldSubmissionError(
		field: TransactionValidationError["field"],
	): string | undefined {
		const error = this.submissionError();

		return error?.field === field ? error.message : undefined;
	}

	protected onTypeChange(): void {
		const selectedAccount = this.selectedAccount();

		if (
			this.formModel().type === "income" &&
			selectedAccount?.type === "credit-card"
		) {
			this.formModel.update((model) => ({
				...model,
				accountId: EMPTY_TEXT,
				currency: EMPTY_TEXT,
			}));
			return;
		}

		this.syncCurrency();
	}

	protected syncCurrency(): void {
		this.formModel.update((model) => ({
			...model,
			currency: this.selectedAccount()?.currency ?? EMPTY_TEXT,
		}));
		this.submissionError.set(undefined);
	}

	protected onSubmit(event: SubmitEvent): void {
		event.preventDefault();
		this.submissionError.set(undefined);
		this.successMessage.set(undefined);

		void submit(this.transactionForm, async () => {
			const result = this.store.postTransaction(this.formModel());

			if (!result.success) {
				this.submissionError.set(result.error);
				return;
			}

			this.successMessage.set("Movimiento guardado en tu historial de sesión.");
			this.formModel.set({
				...INITIAL_FORM_MODEL,
				occurredAt: localDateTimeValue(new Date()),
			});
			this.transactionForm().reset();
		});
	}
}
