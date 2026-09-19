import {
	patchState,
	signalStore,
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
	type AccountSummary,
	type CreateAccountInput,
	CURRENCIES,
	type Currency,
	INITIAL_ACCOUNT_SEQUENCE,
} from "./account-model";
import { validateCreateAccountInput } from "./account-validation";

const ZERO_MINOR_UNITS = 0n;
const ACCOUNT_KIND_ASSET = "asset";
const ACCOUNT_KIND_LIABILITY = "liability";
const OPENING_EVENT_SUFFIX = "-opening";

function accountKind(
	account: Account,
): typeof ACCOUNT_KIND_ASSET | typeof ACCOUNT_KIND_LIABILITY {
	return account.type === "credit-card"
		? ACCOUNT_KIND_LIABILITY
		: ACCOUNT_KIND_ASSET;
}

function summarize(
	accounts: readonly Account[],
	currency: Currency,
): AccountSummary {
	let availableMinorUnits = ZERO_MINOR_UNITS;
	let outstandingMinorUnits = ZERO_MINOR_UNITS;

	for (const account of accounts) {
		if (account.currency !== currency) {
			continue;
		}

		if (accountKind(account) === ACCOUNT_KIND_LIABILITY) {
			outstandingMinorUnits += account.balance.minorUnits;
			continue;
		}

		availableMinorUnits += account.balance.minorUnits;
	}

	return { currency, availableMinorUnits, outstandingMinorUnits };
}

export const AccountStore = signalStore(
	{ providedIn: "root" },
	withEntities<Account>(),
	withState({ accountSequence: INITIAL_ACCOUNT_SEQUENCE }),
	withComputed(({ entities }) => ({
		accountCount: () => entities().length,
		copSummary: () => summarize(entities(), CURRENCIES[0]),
		usdSummary: () => summarize(entities(), CURRENCIES[1]),
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
		resetSession(): void {
			patchState(store, setAllEntities<Account>([]), {
				accountSequence: INITIAL_ACCOUNT_SEQUENCE,
			});
		},
	})),
);
