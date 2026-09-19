import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { describe, expect, it } from "vitest";
import { Sidenav } from "./sidenav.component";

describe("Sidenav", () => {
	function createFixture() {
		TestBed.configureTestingModule({
			imports: [Sidenav],
			providers: [provideRouter([])],
		});

		const fixture = TestBed.createComponent(Sidenav);
		fixture.detectChanges();
		return fixture;
	}

	it("keeps the mobile navigation closed and exposes the menu control", () => {
		const fixture = createFixture();
		const trigger = fixture.nativeElement.querySelector(
			".menu-trigger",
		) as HTMLButtonElement;

		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		expect(
			fixture.nativeElement.querySelector("#mobile-navigation"),
		).toBeNull();
		expect(trigger.textContent).toContain("Menú");
		expect(
			fixture.nativeElement
				.querySelector(".persistent-navigation")
				.getAttribute("aria-label"),
		).toBe("Navegación principal");
	});

	it("opens, focuses, and closes the transient mobile navigation", async () => {
		const fixture = createFixture();
		const trigger = fixture.nativeElement.querySelector(
			".menu-trigger",
		) as HTMLButtonElement;

		trigger.click();
		fixture.detectChanges();
		await fixture.whenStable();

		const navigation = fixture.nativeElement.querySelector(
			"#mobile-navigation",
		) as HTMLElement;
		expect(trigger.getAttribute("aria-expanded")).toBe("true");
		expect(navigation).toBeTruthy();
		expect(document.activeElement).toBe(navigation);

		navigation.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
		fixture.detectChanges();
		await fixture.whenStable();

		expect(
			fixture.nativeElement.querySelector("#mobile-navigation"),
		).toBeNull();
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		expect(document.activeElement).toBe(trigger);
	});

	it("exposes Spanish navigation labels and accessible controls", () => {
		const fixture = createFixture();
		const navigation = fixture.nativeElement.querySelector(
			".persistent-navigation",
		) as HTMLElement;

		expect(navigation.textContent).toContain("Cuentas");
		expect(navigation.textContent).toContain("Crea y revisa tus cuentas");
		expect(navigation.textContent).not.toContain("Accounts");
	});
});
