import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {BehaviorSubject, first, Observable} from "rxjs";
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import {UtilsService} from "../../../../shared/services/utils.service";
import {TimbreAcquisModel} from "../../../../model/timbre-acquis.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {DroitEnum} from "../../../../shared/enum/droit.enum";

@Component({
	selector: "app-timbre-resultat-table",
	templateUrl: "./timbre-resultat-table.component.html",
	styleUrls: ["./../../../styles/timbre-resultat-table.scss"],
})
export class TimbreResultatTableComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@Input() timbres$: BehaviorSubject<TimbreModel[]> | Observable<TimbreModel[]>;
	@Input() load$: BehaviorSubject<boolean> | Observable<boolean>;
	@Input() total$: BehaviorSubject<number> | Observable<number>;
	@Input() modif: boolean = true;

	dataSource: MatTableDataSource<TimbreModel> = new MatTableDataSource<TimbreModel>();
	displayedColumns: string[];
	public timbre: TimbreModel = new TimbreModel();
	annees$: Observable<number[]>

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public authService: AuthService, public timbreService: TimbreService, public timbreUtilsService: TimbreUtilsService, public utilsService: UtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
		this.timbre.setTimbreAcquisModel(new TimbreAcquisModel());

		this.displayedColumns = ["image", "id", "annee", "idBloc", "monnaie", "type", "yt", "acquis"];
		if (this.modif) {
			this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user=> {
				if (user?.getDroit() >= DroitEnum.PARTIEL) {
					this.displayedColumns.push("doublon");
				}
				if (user?.getDroit() == DroitEnum.TOTAL) {
					this.displayedColumns.push("modifier", "supprimer");
				}
			});
		}

		this.timbres$.subscribe(timbres => {
			this.dataSource.data = timbres;
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		/*this.sort.active = 'idBloc';
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
