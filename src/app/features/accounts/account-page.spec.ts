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

		expect(text).toContain("No accounts yet");
		expect(text).toContain("COP available");
		expect(text).toContain("USD available");
		expect(text).toContain("Session only");
	});

	it("renders accounts created through the shared store with their meaning", () => {
		const fixture = createFixture();
		const store = TestBed.inject(AccountStore);

		store.createAccount({
			name: "Main checking",
			type: "checking",
			currency: "COP",
			openingBalance: "100000",
		});
		store.createAccount({
			name: "Travel card",
			type: "credit-card",
			currency: "USD",
			openingBalance: "25.50",
		});
		fixture.detectChanges();

		const text = fixture.nativeElement.textContent as string;
		expect(text).toContain("Main checking");
		expect(text).toContain("Available balance");
		expect(text).toContain("Travel card");
		expect(text).toContain("Outstanding liability");
		expect(text).toContain("USD 25.50");
	});
});
