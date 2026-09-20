import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { AccountStore } from "../../core/accounts/account-store";
import { TransactionPage } from "./transaction-page";

describe("TransactionPage", () => {
	function createFixture(): ComponentFixture<TransactionPage> {
		TestBed.configureTestingModule({
			imports: [TransactionPage],
			providers: [AccountStore],
		});

		const fixture = TestBed.createComponent(TransactionPage);
		fixture.detectChanges();
		return fixture;
	}

	it("renders the Spanish movement workspace and empty history", () => {
		const fixture = createFixture();
		const text = fixture.nativeElement.textContent as string;

		expect(text).toContain("Registra lo que entra y lo que sale");
		expect(text).toContain("Primero crea una cuenta");
		expect(text).toContain("Aún no hay movimientos");
		expect(text).toContain("Moneda del movimiento");
		expect(text).not.toContain("Record income");
	});

	it("shows only eligible asset accounts for income", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);

		store.createAccount({
			name: "Cuenta principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Tarjeta",
			type: "credit-card",
			currency: "COP",
		});
		fixture.detectChanges();

		const options = fixture.nativeElement.querySelectorAll(
			"#transaction-account option",
		) as NodeListOf<HTMLOptionElement>;
		const optionText = Array.from(options)
			.map((option) => option.textContent)
			.join(" ");

		expect(optionText).toContain("Cuenta principal");
		expect(optionText).not.toContain("Tarjeta");
	});

	it("renders exact posted amounts, account context, and newest-first history", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);
		const accountResult = store.createAccount({
			name: "Cuenta principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});

		expect(accountResult.success).toBe(true);
		if (!accountResult.success) {
			return;
		}

		store.postTransaction({
			type: "income",
			accountId: accountResult.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Pago de nómina",
		});
		store.postTransaction({
			type: "expense",
			accountId: accountResult.account.id,
			amount: "10000",
			currency: "COP",
			occurredAt: "2026-09-20T08:00",
			description: "Mercado",
		});
		fixture.detectChanges();

		const text = fixture.nativeElement.textContent as string;
		const rows = fixture.nativeElement.querySelectorAll(
			".transaction-list-item",
		) as NodeListOf<HTMLElement>;

		expect(text).toContain("COP 25,000");
		expect(text).toContain("COP 10,000");
		expect(text).toContain("Cuenta principal");
		expect(rows[0].textContent).toContain("Mercado");
		expect(rows[1].textContent).toContain("Pago de nómina");
	});

	it("keeps rejected operations out of the rendered history", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);
		const accountResult = store.createAccount({
			name: "Cuenta principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});

		expect(accountResult.success).toBe(true);
		if (!accountResult.success) {
			return;
		}

		const result = store.postTransaction({
			type: "expense",
			accountId: accountResult.account.id,
			amount: "100001",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Compra imposible",
		});
		fixture.detectChanges();

		expect(result).toMatchObject({ success: false });
		expect(
			fixture.nativeElement.querySelectorAll(".transaction-list-item"),
		).toHaveLength(0);
		expect(fixture.nativeElement.textContent).toContain(
			"Aún no hay movimientos",
		);
	});
});
