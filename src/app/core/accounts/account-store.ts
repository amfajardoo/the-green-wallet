import {
	patchState,
	signalStore,
	type,
	withComputed,
	withMethods,
	withState,
} from "@ngrx/signals";
import {
	addEntity,
	setAllEntities,
	withEntities,
} from "@ngrx/signals/entities";
import {
	ACCOUNT_ID_PREFIX,
	ACCOUNT_SEQUENCE_INCREMENT,
	type Account,
	type AccountOperationResult,
	type CreateAccountInput,
	CURRENCIES,
	INITIAL_ACCOUNT_SEQUENCE,
} from "./account-model";
import { validateCreateAccountInput } from "./account-validation";
import {
	projectAccounts,
	sortTransactionsNewestFirst,
	summarizeAccounts,
} from "./transaction-balance";
import {
	INITIAL_TRANSACTION_SEQUENCE,
	type PostTransactionInput,
	TRANSACTION_ID_PREFIX,
	TRANSACTION_SEQUENCE_INCREMENT,
	type Transaction,
	type TransactionOperationResult,
} from "./transaction-model";
import { validatePostTransactionInput } from "./transaction-validation";
import { sortTransfersNewestFirst } from "./transfer-balance";
import {
	INITIAL_TRANSFER_SEQUENCE,
	type PostTransferInput,
	TRANSFER_ID_PREFIX,
	TRANSFER_SEQUENCE_INCREMENT,
	type Transfer,
	type TransferOperationResult,
} from "./transfer-model";
import { validatePostTransferInput } from "./transfer-validation";

const OPENING_EVENT_SUFFIX = "-opening";
const TRANSACTION_COLLECTION = "transaction";
const transactionConfig = {
	entity: type<Transaction>(),
	collection: TRANSACTION_COLLECTION,
} as const;
const transactionCollection = { collection: TRANSACTION_COLLECTION } as const;
const TRANSFER_COLLECTION = "transfer";
const transferConfig = {
	entity: type<Transfer>(),
	collection: TRANSFER_COLLECTION,
} as const;
const transferCollection = { collection: TRANSFER_COLLECTION } as const;

export const AccountStore = signalStore(
	{ providedIn: "root" },
	withEntities<Account>(),
	withEntities(transactionConfig),
	withEntities(transferConfig),
	withState({
		accountSequence: INITIAL_ACCOUNT_SEQUENCE,
		transactionSequence: INITIAL_TRANSACTION_SEQUENCE,
		transferSequence: INITIAL_TRANSFER_SEQUENCE,
	}),
	withComputed(({ entities, transactionEntities, transferEntities }) => ({
		accountCount: () => entities().length,
		transactionCount: () => transactionEntities().length,
		transactions: () => sortTransactionsNewestFirst(transactionEntities()),
		transferCount: () => transferEntities().length,
		transfers: () => sortTransfersNewestFirst(transferEntities()),
		copSummary: () => summarizeAccounts(entities(), CURRENCIES[0]),
		usdSummary: () => summarizeAccounts(entities(), CURRENCIES[1]),
	})),
	withMethods((store) => ({
		createAccount(input: CreateAccountInput): AccountOperationResult {
			const validation = validateCreateAccountInput(input, store.entities());

			if (!validation.success) {
				return validation;
			}

			const accountId = `${ACCOUNT_ID_PREFIX}${store.accountSequence()}`;
			const account: Account = {
				id: accountId,
				name: validation.value.name,
				normalizedName: validation.value.normalizedName,
				type: validation.value.type,
				currency: validation.value.currency,
				balance: validation.value.openingBalance,
				openingBalance: validation.value.openingBalance,
				openingBalanceEvent: {
					id: `${accountId}${OPENING_EVENT_SUFFIX}`,
					kind: "opening-balance",
					amount: validation.value.openingBalance,
				},
			};

			patchState(store, addEntity(account), ({ accountSequence }) => ({
				accountSequence: accountSequence + ACCOUNT_SEQUENCE_INCREMENT,
			}));

			return { success: true, account };
		},
		postTransaction(input: PostTransactionInput): TransactionOperationResult {
			const validation = validatePostTransactionInput(
				input,
				store.entities(),
				store.transactionEntities(),
			);

			if (!validation.success) {
				return validation;
			}

			const transactionId = `${TRANSACTION_ID_PREFIX}${store.transactionSequence()}`;
			const transaction: Transaction = {
				id: transactionId,
				type: validation.value.type,
				accountId: validation.value.accountId,
				amount: validation.value.amount,
				occurredAt: validation.value.occurredAt,
				description: validation.value.description,
			};
			const nextTransactions = [...store.transactionEntities(), transaction];
			const nextAccounts = projectAccounts(store.entities(), nextTransactions);

			patchState(
				store,
				setAllEntities(nextAccounts),
				addEntity(transaction, transactionConfig),
				({ transactionSequence }) => ({
					transactionSequence:
						transactionSequence + TRANSACTION_SEQUENCE_INCREMENT,
				}),
			);

			return { success: true, transaction };
		},
		postTransfer(input: PostTransferInput): TransferOperationResult {
			const validation = validatePostTransferInput(
				input,
				store.entities(),
				store.transactionEntities(),
				store.transferEntities(),
			);

			if (!validation.success) {
				return validation;
			}

			const transferId = `${TRANSFER_ID_PREFIX}${store.transferSequence()}`;
			const transfer: Transfer = {
				id: transferId,
				sourceAccountId: validation.value.sourceAccountId,
				destinationAccountId: validation.value.destinationAccountId,
				amount: validation.value.amount,
				occurredAt: validation.value.occurredAt,
				description: validation.value.description,
			};
			const nextTransfers = [...store.transferEntities(), transfer];
			const nextAccounts = projectAccounts(
				store.entities(),
				store.transactionEntities(),
				nextTransfers,
			);

			patchState(
				store,
				setAllEntities(nextAccounts),
				addEntity(transfer, transferConfig),
				({ transferSequence }) => ({
					transferSequence: transferSequence + TRANSFER_SEQUENCE_INCREMENT,
				}),
			);

			return { success: true, transfer };
		},
		resetSession(): void {
			patchState(
				store,
				setAllEntities<Account>([]),
				setAllEntities<Transaction, typeof TRANSACTION_COLLECTION>(
					[],
					transactionCollection,
				),
				setAllEntities<Transfer, typeof TRANSFER_COLLECTION>(
					[],
					transferCollection,
				),
				{
					accountSequence: INITIAL_ACCOUNT_SEQUENCE,
					transactionSequence: INITIAL_TRANSACTION_SEQUENCE,
					transferSequence: INITIAL_TRANSFER_SEQUENCE,
				},
			);
		},
	})),
);
