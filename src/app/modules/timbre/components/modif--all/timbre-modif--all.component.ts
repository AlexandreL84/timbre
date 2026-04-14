import {Component, OnInit} from '@angular/core';
import {TimbreModifAllService} from "../../../../shared/services/timbre/timbre-modif-all.service";

@Component({
	selector: 'app-timbre-modif--all',
	templateUrl: './timbre-modif--all.component.html',
	providers: [TimbreModifAllService]
})
export class TimbreModifAllComponent implements OnInit {

	constructor(
		private timbreModifAllService: TimbreModifAllService) {
	}

	ngOnInit() {
		//this.timbreModifAllService.ajoutAll();
		//this.timbreModifAllService.addAllAcquis();

		//this.timbreModifAllService.ajoutAllBloc();
		//this.timbreModifAllService.addAllBlocAcquis();
		//this.timbreModifAllService.verifNbTimbres();
	}

}
