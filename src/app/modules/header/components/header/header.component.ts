import {Component, Input, OnInit} from '@angular/core';
import {StyleManagerService} from "../../../../shared/services/style-manager.service";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	@Input() titre: string

	constructor(public styleManagerService: StyleManagerService) {
	}

	ngOnInit() {
	}

	toggleDarkTheme() {
		console.log(this.styleManagerService.isDark)
		console.log(this.styleManagerService.isDark)
		this.styleManagerService.toggleDarkTheme();
		this.styleManagerService.isDark = !this.styleManagerService.isDark;
	}
}
