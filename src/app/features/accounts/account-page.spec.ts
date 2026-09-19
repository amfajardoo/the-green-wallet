import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { AccountStore } from "../../core/accounts/account-store";
import { AccountPage } from "./account-page";

describe("AccountPage", () => {
	function createFixture(): ComponentFixture<AccountPage> {
		TestBed.configureTestingModule({
			imports: [AccountPage],
			providers: [AccountStore],
		});

		const fixture = TestBed.createComponent(AccountPage);
		fixture.detectChanges();
		return fixture;
	}

	it("renders an empty session with explicit currency summaries", () => {
		const fixture = createFixture();
		const text = fixture.nativeElement.textContent as string;

		expect(text).toContain("Aún no tienes cuentas");
		expect(text).toContain("Disponible en COP");
		expect(text).toContain("Disponible en USD");
		expect(text).toContain("Solo durante esta sesión");
		expect(text).not.toContain("No accounts yet");
	});

	it("renders accounts created through the shared store with their meaning", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);

		store.createAccount({
			name: "Cuenta principal",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Tarjeta de viaje",
			type: "credit-card",
			currency: "USD",
			openingBalance: "25.50",
		});
		fixture.detectChanges();

		const text = fixture.nativeElement.textContent as string;
		expect(text).toContain("Cuenta principal");
		expect(text).toContain("Saldo disponible");
		expect(text).toContain("Tarjeta de viaje");
		expect(text).toContain("Saldo pendiente");
		expect(text).toContain("USD 25.50");
		expect(text).toContain("TC");
	});

	it("keeps financial meaning explicit in semantic labels", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);

		store.createAccount({
			name: "Cuenta de ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Tarjeta",
			type: "credit-card",
			currency: "COP",
			openingBalance: "25000",
		});
		fixture.detectChanges();

		const rows = fixture.nativeElement.querySelectorAll(
			".account-list-item",
		) as NodeListOf<HTMLElement>;
		expect(rows[0].textContent).toContain("Saldo disponible");
		expect(rows[1].textContent).toContain("Saldo pendiente");
		expect(
			fixture.nativeElement.querySelector("#account-list-title"),
		).toBeTruthy();
	});
});
