import { Component, signal } from "@angular/core";
import { RouterLink, RouterOutlet } from "@angular/router";
import { Sidenav } from "./navigation/sidenav.component";

@Component({
	selector: "app-root",
	imports: [RouterLink, RouterOutlet, Sidenav],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected readonly title = signal("The Green Wallet");
}
