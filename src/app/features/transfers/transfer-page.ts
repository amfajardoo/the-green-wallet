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
import type { Account } from "../../core/accounts/account-model";
import { formatMoney, parseMoney } from "../../core/accounts/account-money";
import { AccountStore } from "../../core/accounts/account-store";
import type {
	Transfer,
	TransferValidationError,
} from "../../core/accounts/transfer-model";

type TransferFormModel = {
	sourceAccountId: string;
	destinationAccountId: string;
	amount: string;
	currency: string;
	occurredAt: string;
	description: string;
};

type TransferHistoryItem = {
	readonly transfer: Transfer;
	readonly source: Account | undefined;
	readonly destination: Account | undefined;
};

const EMPTY_TEXT = "";
const INITIAL_FORM_MODEL: TransferFormModel = {
	sourceAccountId: EMPTY_TEXT,
	destinationAccountId: EMPTY_TEXT,
	amount: EMPTY_TEXT,
	currency: EMPTY_TEXT,
	occurredAt: EMPTY_TEXT,
	description: EMPTY_TEXT,
};

function localDateTimeValue(date: Date): string {
	const pad = (value: number): string => value.toString().padStart(2, "0");

	return [
		`${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
		`${pad(date.getHours())}:${pad(date.getMinutes())}`,
	].join("T");
}

@Component({
	selector: "app-transfer-page",
	imports: [FormField],
	templateUrl: "./transfer-page.html",
})
export class TransferPage {
	protected readonly store = inject(AccountStore);
	protected readonly formModel = signal<TransferFormModel>({
		...INITIAL_FORM_MODEL,
	});
	protected readonly submissionError = signal<
		TransferValidationError | undefined
	>(undefined);
	protected readonly successMessage = signal<string | undefined>(undefined);
	protected readonly hasTransferEndpoints = computed(
		() => this.store.accountCount() > 1,
	);
	protected readonly assetAccounts = computed(() =>
		this.store.entities().filter((account) => account.type !== "credit-card"),
	);
	protected readonly destinationAccounts = computed(() =>
		this.assetAccounts().filter(
			(account) => account.id !== this.formModel().sourceAccountId,
		),
	);
	protected readonly sourceAccount = computed(() =>
		this.store
			.entities()
			.find((account) => account.id === this.formModel().sourceAccountId),
	);
	protected readonly destinationAccount = computed(() =>
		this.store
			.entities()
			.find((account) => account.id === this.formModel().destinationAccountId),
	);
	protected readonly selectedCurrency = computed(
		() => this.sourceAccount()?.currency ?? EMPTY_TEXT,
	);
	protected readonly history = computed<readonly TransferHistoryItem[]>(() =>
		this.store.transfers().map((transfer) => ({
			transfer,
			source: this.store
				.entities()
				.find((account) => account.id === transfer.sourceAccountId),
			destination: this.store
				.entities()
				.find((account) => account.id === transfer.destinationAccountId),
		})),
	);
	protected readonly transferForm = form(this.formModel, (schema) => {
		required(schema.sourceAccountId, {
			message: "Selecciona la cuenta de origen.",
		});
		required(schema.destinationAccountId, {
			message: "Selecciona la cuenta de destino.",
		});
		required(schema.amount, { message: "Escribe un valor mayor que cero." });
		validate(schema.amount, ({ value, valueOf: readValueOf }) => {
			const sourceAccountId = readValueOf(schema.sourceAccountId);
			const source = this.store
				.entities()
				.find((account) => account.id === sourceAccountId);

			if (!source || value().trim() === EMPTY_TEXT) {
				return undefined;
			}

			const parsed = parseMoney(value(), source.currency);

			if (parsed.success && parsed.money.minorUnits > 0n) {
				return undefined;
			}

			return {
				kind: "amount-format",
				message:
					source.currency === "COP"
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

	protected formatBalance(account: Account | undefined): string {
		return account ? formatMoney(account.balance) : EMPTY_TEXT;
	}

	protected formatAmount(transfer: Transfer): string {
		return formatMoney(transfer.amount);
	}

	protected formatDate(occurredAt: string): string {
		return new Intl.DateTimeFormat("es-CO", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(occurredAt));
	}

	protected operationLabel(id: string): string {
		return id.replace("transfer-", "Traslado #");
	}

	protected fieldSubmissionError(
		field: TransferValidationError["field"],
	): string | undefined {
		const error = this.submissionError();

		return error?.field === field ? error.message : undefined;
	}

	protected onSubmit(event: SubmitEvent): void {
		event.preventDefault();
		this.submissionError.set(undefined);
		this.successMessage.set(undefined);

		void submit(this.transferForm, async () => {
			const result = this.store.postTransfer({
				...this.formModel(),
				currency: this.selectedCurrency(),
			});

			if (!result.success) {
				this.submissionError.set(result.error);
				return;
			}

			this.successMessage.set("Traslado guardado como una operación pareada.");
			this.formModel.set({
				...INITIAL_FORM_MODEL,
				occurredAt: localDateTimeValue(new Date()),
			});
			this.transferForm().reset();
		});
	}
}
