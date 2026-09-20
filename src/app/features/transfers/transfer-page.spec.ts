import { type ComponentFixture, TestBed } from "@angular/core/testing";
import { describe, expect, it } from "vitest";
import { AccountStore } from "../../core/accounts/account-store";
import { TransferPage } from "./transfer-page";

describe("TransferPage", () => {
	function createFixture(): ComponentFixture<TransferPage> {
		TestBed.configureTestingModule({
			imports: [TransferPage],
			providers: [AccountStore],
		});

		const fixture = TestBed.createComponent(TransferPage);
		fixture.detectChanges();
		return fixture;
	}

	it("renders the Spanish transfer workspace and empty state", () => {
		const fixture = createFixture();
		const text = fixture.nativeElement.textContent as string;

		expect(text).toContain("Mueve tu dinero sin perder el hilo");
		expect(text).toContain("Crea al menos dos cuentas");
		expect(text).toContain("Aún no hay transferencias");
		expect(text).toContain("Moneda del traslado");
		expect(text).not.toContain("Transfer money");
	});

	it("excludes credit cards and the selected source from endpoints", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);
		const source = store.createAccount({
			name: "Ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Efectivo",
			type: "cash",
			currency: "COP",
		});
		store.createAccount({
			name: "Tarjeta",
			type: "credit-card",
			currency: "COP",
		});
		expect(source.success).toBe(true);
		if (!source.success) {
			return;
		}

		const component = fixture.componentInstance as unknown as {
			formModel: {
				set(value: {
					sourceAccountId: string;
					destinationAccountId: string;
					amount: string;
					currency: string;
					occurredAt: string;
					description: string;
				}): void;
			};
		};
		component.formModel.set({
			sourceAccountId: source.account.id,
			destinationAccountId: "",
			amount: "",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "",
		});
		fixture.detectChanges();

		const destinationOptions = fixture.nativeElement.querySelectorAll(
			"#transfer-destination option",
		) as NodeListOf<HTMLOptionElement>;
		const optionText = Array.from(destinationOptions)
			.map((option) => option.textContent)
			.join(" ");

		expect(optionText).toContain("Efectivo");
		expect(optionText).not.toContain("Ahorros");
		expect(optionText).not.toContain("Tarjeta");
	});

	it("renders both endpoints and the exact paired transfer history", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);
		const source = store.createAccount({
			name: "Ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		const destination = store.createAccount({
			name: "Efectivo",
			type: "cash",
			currency: "COP",
			openingBalance: "10000",
		});

		expect(source.success).toBe(true);
		expect(destination.success).toBe(true);
		if (!source.success || !destination.success) {
			return;
		}

		store.postTransfer({
			sourceAccountId: source.account.id,
			destinationAccountId: destination.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "Organizar efectivo",
		});
		fixture.detectChanges();

		const text = fixture.nativeElement.textContent as string;
		expect(text).toContain("Organizar efectivo");
		expect(text).toContain("Ahorros");
		expect(text).toContain("Efectivo");
		expect(text).toContain("COP 25,000");
		expect(text).toContain("Traslado #1");
		expect(
			fixture.nativeElement.querySelectorAll(".transfer-list-item"),
		).toHaveLength(1);
	});

	it("does not render a rejected transfer in history", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);
		const source = store.createAccount({
			name: "Ahorros",
			type: "savings",
			currency: "COP",
			openingBalance: "100000",
		});
		const destination = store.createAccount({
			name: "Efectivo",
			type: "cash",
			currency: "COP",
		});

		expect(source.success).toBe(true);
		expect(destination.success).toBe(true);
		if (!source.success || !destination.success) {
			return;
		}

		const result = store.postTransfer({
			sourceAccountId: source.account.id,
			destinationAccountId: source.account.id,
			amount: "25000",
			currency: "COP",
			occurredAt: "2026-09-19T08:00",
			description: "No debe aparecer",
		});
		fixture.detectChanges();

		expect(result).toMatchObject({ success: false });
		expect(
			fixture.nativeElement.querySelectorAll(".transfer-list-item"),
		).toHaveLength(0);
		expect(fixture.nativeElement.textContent).toContain(
			"Aún no hay transferencias",
		);
	});
});
