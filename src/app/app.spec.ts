import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { App } from "./app";
import { routes } from "./app.routes";

describe("App", () => {
	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [App],
			providers: [provideRouter([])],
		}).compileComponents();
	});

	it("should create the app", () => {
		const fixture = TestBed.createComponent(App);
		const app = fixture.componentInstance;
		expect(app).toBeTruthy();
	});

	it("should render the application shell", async () => {
		const fixture = TestBed.createComponent(App);
		await fixture.whenStable();
		const compiled = fixture.nativeElement as HTMLElement;
		expect(compiled.querySelector(".brand-mark")?.textContent).toContain(
			"The Green Wallet",
		);
		expect(compiled.querySelector("app-sidenav")).toBeTruthy();
		expect(compiled.textContent).toContain("Datos locales");
		expect(compiled.textContent).toContain("Solo durante esta sesión");
		expect(compiled.textContent).not.toContain("Local-first");
	});

	it("keeps the transaction workspace lazy and reachable", () => {
		const transactionRoute = routes.find(
			(route) => route.path === "transactions",
		);

		expect(transactionRoute?.loadComponent).toBeTypeOf("function");
	});
});
