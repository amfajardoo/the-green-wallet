import { Component, type ElementRef, signal, viewChild } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { NAVIGATION_DESTINATIONS } from "./navigation.config";

const NO_FOCUS_RESTORE = false;

@Component({
	selector: "app-sidenav",
	imports: [RouterLink, RouterLinkActive],
	templateUrl: "./sidenav.component.html",
	styleUrl: "./sidenav.component.css",
})
export class Sidenav {
	protected readonly destinations = NAVIGATION_DESTINATIONS;
	protected readonly mobileOpen = signal(false);
	private readonly menuButton =
		viewChild<ElementRef<HTMLButtonElement>>("menuButton");
	private readonly mobileNavigation =
		viewChild<ElementRef<HTMLElement>>("mobileNavigation");

	protected openMenu(): void {
		this.mobileOpen.set(true);
		queueMicrotask(() => this.mobileNavigation()?.nativeElement.focus());
	}

	protected closeMenu(restoreFocus = true): void {
		this.mobileOpen.set(false);

		if (restoreFocus) {
			queueMicrotask(() => this.menuButton()?.nativeElement.focus());
		}
	}

	protected closeAfterNavigation(): void {
		this.closeMenu(NO_FOCUS_RESTORE);
	}
}
