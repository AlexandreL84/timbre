import {Component, OnInit} from "@angular/core";
import {TimbrePaysService} from "../services/timbre-pays.service";
import {Observable} from "rxjs";
import {TimbrePaysModel} from "../../../model/timbre-pays.model";
import {Utils} from "../../../utils/utils";
import {deleteDoc} from "@angular/fire/firestore";

@Component({
	selector: "app-protocole-partenariat-layout",
	templateUrl: "./timbre-pays-layout.component.html",
	styleUrls: ["./timbre-pays-layout.component.scss"],
})
export class TimbrePaysLayoutComponent implements OnInit {
	public timbres$: Observable<TimbrePaysModel[]>;
	readonly Utils: Utils;

	constructor(public timbrePaysService: TimbrePaysService) {

	}

	ngOnInit(): void {
		/*this.timbrePaysService.getTimbres().subscribe(timbres => {
			console.log(timbres)
		})*/
		this.timbres$ = this.timbrePaysService.getTimbres();
		//console.log(this.timbres$);

		//firebase.auth().signInWithEmailAndPassword("alexandrelefaix@hotmail.com", "151984")
		//this.timbrePaysService.deleteTimbrebyCode("FR")

	}

	addTimbre(timbrePaysModel: TimbrePaysModel) {
		this.timbrePaysService.addTimbre(timbrePaysModel)
	}

	addTimbreBouchon() {
		this.timbrePaysService.addTimbre(this.getBouchon())
	}

	getBouchon(): TimbrePaysModel {
		let timbre: TimbrePaysModel = new TimbrePaysModel();
		let id: number = Utils.getRandom(10000)
		//timbre.setId(id);
		timbre.setCode("FR");
		timbre.setLibelle("France " + id);
		timbre.setLibelle2("France " + id);
		timbre.setDrapeau("FR");
		timbre.setZone("FR");
		timbre.setMap("FR");
		timbre.setClasseur(1);
		timbre.setPage(1);
		timbre.setVisible(true);
		return timbre;
	}

	async modifier(id: any, data: any) {
		this.timbrePaysService.modifierTimbre(this.getBouchon())
	}
}
