import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {BehaviorSubject, Observable} from "rxjs";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {UtilsService} from "../../../../shared/services/utils.service";
import {LibModalComponent} from "../../../../shared/components/lib-modal/lib-modal.component";
import {TimbreBlocAcquisModel} from "../../../../model/timbre-bloc-acquis.model";
import {TimbreCritereModel} from "../../../../model/timbre-critere.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {TimbreModifierBlocComponent} from "../modifier-bloc/timbre-modifier-bloc.component";
import {BaseEnum} from "../../../../shared/enum/base.enum";

@Component({
	selector: "app-timbre-bloc-resultat",
	templateUrl: "./timbre-bloc-resultat.component.html",
	styleUrls: ["./timbre-bloc-resultat.component.scss"],
})
export class TimbreBlocResultatComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;


	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dataSource: MatTableDataSource<TimbreBlocModel> = new MatTableDataSource<TimbreBlocModel>();
	displayedColumns: string[];
	public timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
	public timbre: TimbreBlocModel = new TimbreBlocModel();
	annees$: Observable<number[]>;
	modif: boolean = true;

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public timbreBlocService: TimbreBlocService, private timbreUtilsService: TimbreUtilsService, private dialog: MatDialog, public utilsService: UtilsService) {
		//this.timbreBlocService.getBlocsAsync();
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
		this.timbre.setTimbreBlocAcquisModel(new TimbreBlocAcquisModel());

		this.displayedColumns = ["image", "id", "annee", "monnaie", "acquis", "doublon"];
		if (this.modif) {
			this.displayedColumns.push("modifier", "supprimer");
		}

		this.load$.next(false);
		this.timbreBlocService.timbresBlocModel$.subscribe(timbres => {
			this.dataSource.data = timbres;
			this.load$.next(true);
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.sort.active = 'id';
		this.sort.direction = 'asc';
		this.dataSource.sort = this.sort;
	}

	sortData(sort: Sort) {
		if (isNotNullOrUndefined(sort)) {
			this.dataSource.sort = this.sort;
		}
	}

	filtreByCritere() {
		if (this.timbreCritereModel.getAcquis() == "NON") {
			this.timbreCritereModel.setDoublon("TOUS");
		}
		//this.timbreService.getTimbres(this.timbreCritereModel);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	acquis(timbreBlocModel: TimbreBlocModel) {
		//this.timbreBlocService.acquis(timbreBlocModel, false);
	}

	doublon(timbreBlocModel: TimbreBlocModel) {
		//this.timbreBlocService.acquis(timbreBlocModel, true);
	}

	modifier(TimbreBlocModel: TimbreBlocModel) {
		const refDialog = this.dialog.open(TimbreModifierBlocComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
		});
		refDialog.componentInstance.id = TimbreBlocModel.getId();

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	supprimer(timbreBlocModel: TimbreBlocModel) {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous supprimer le timbre <b>n° " + timbreBlocModel?.getId() + "</b> ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.timbreBlocService.supprimer(timbreBlocModel)
			}
		})
	}

	exportTable(): void {
		// Créer une feuille de calcul à partir des données
		const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);

		// Créer un classeur (workbook)
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Données');

		// Générer le fichier Excel et déclencher le téléchargement
		const excelBuffer: any = XLSX.write(wb, {bookType: 'xlsx', type: 'array'});
		const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
		saveAs(data, 'export_timbres.xlsx');
	}
}
