import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {TimbreBlocModel} from "../../../../model/timbre-bloc.model";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {first, Observable} from "rxjs";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreBlocAcquisModel} from "../../../../model/timbre-bloc-acquis.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
	selector: "app-timbre-bloc-resultat-table",
	templateUrl: "./timbre-bloc-resultat-table.component.html",
	styleUrls: ["./../../../styles/timbre-resultat-table.scss"],
})
export class TimbreBlocResultatTableComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	dataSource: MatTableDataSource<TimbreBlocModel> = new MatTableDataSource<TimbreBlocModel>();
	displayedColumns: string[];
	public timbreBlocModel: TimbreBlocModel = new TimbreBlocModel();
	annees$: Observable<number[]>;
	modif: boolean = true;

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(private authService: AuthService, public timbreBlocService: TimbreBlocService, public timbreUtilsService: TimbreUtilsService, public utilsService: UtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE_BLOC);
		this.timbreBlocModel.setTimbreBlocAcquisModel(new TimbreBlocAcquisModel());

		this.displayedColumns = ["image", "id", "annee", "type", "monnaie", "yt", "nbTimbres" ,"acquis"];
		if (this.modif) {
			this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
				if (user?.getDroit() >= DroitEnum.PARTIEL) {
					this.displayedColumns.push("doublon");
				}
				if (user?.getDroit() == DroitEnum.TOTAL) {
					this.displayedColumns.push("modifier", "supprimer");
				}
			});
		}

		this.timbreBlocService.timbresBlocModel$.subscribe(timbres => {
			this.dataSource.data = timbres;
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		/*this.sort.active = 'id';
		this.sort.direction = 'asc';
		this.dataSource.sort = this.sort;*/
	}

	sortData(sort: Sort) {
		if (isNotNullOrUndefined(sort)) {
			this.dataSource.sort = this.sort;
		}
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
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
