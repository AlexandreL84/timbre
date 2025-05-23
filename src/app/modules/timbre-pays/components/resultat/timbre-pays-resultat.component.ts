import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {TimbrePaysModel} from "../../../../model/timbre-pays.model";
import {TimbrePaysService} from "../../services/timbre-pays.service";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {TimbrePaysModifierComponent} from "../modifier/timbre-pays-modifier.component";
import {BehaviorSubject, Observable} from "rxjs";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {UtilsService} from "../../../../shared/services/utils.service";
import {LibModalComponent} from "../../../../shared/components/lib-modal/lib-modal.component";
import {UploadService} from "../../../../shared/services/upload.service";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbrePaysAjoutTimbreComponent} from "../ajout-timbre/timbre-pays-ajout-timbre.component";

@Component({
	selector: "app-timbre-pays-resultat",
	templateUrl: "./timbre-pays-resultat.component.html",
	styleUrls: ["./timbre-pays-resultat.component.scss"],
})
export class TimbrePaysResultatComponent implements OnInit, AfterViewInit  {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@Input() timbres$: BehaviorSubject<TimbrePaysModel[]> | Observable<TimbrePaysModel[]>;
	@Input() modif: boolean = true;

	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dataSource: MatTableDataSource<TimbrePaysModel> = new MatTableDataSource<TimbrePaysModel>();
	displayedColumns: string[];
	public timbre: TimbrePaysModel = new TimbrePaysModel();

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(public timbrePaysService: TimbrePaysService, private dialog: MatDialog, public utilsService: UtilsService, private uploadService: UploadService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.displayedColumns = ["drapeau", "code", "libelle", "libelleLangue",  "classeur", "page", "total", 'image'];
		if (this.modif) {
			this.displayedColumns.push("ajouter", "modifier", "supprimer");
		}

		this.load$.next(false);
		this.timbres$.subscribe(timbres => {
			//console.log(timbres);
			this.dataSource.data = timbres;
			this.load$.next(true);
		});
		//.pipe(first())
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.sort.active = 'libelle';
		this.sort.direction = 'asc';
		this.dataSource.sort = this.sort;
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

	ajouterTimbre(timbrePaysModel: TimbrePaysModel) {
		const refDialog = this.dialog.open(TimbrePaysAjoutTimbreComponent, {
			height: "200px",
			width: "300px"
		});
		refDialog.componentInstance.id = timbrePaysModel.id;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	modifier(timbrePaysModel: TimbrePaysModel) {
		const refDialog = this.dialog.open(TimbrePaysModifierComponent, {
			height: "75vh",
			maxHeight: "800px",
			width: "30%",
			minWidth: "300px"
		});
		refDialog.componentInstance.id = timbrePaysModel.id;
		//refDialog.componentInstance.code = timbrePaysModel.code;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	supprimer(timbrePaysModel: TimbrePaysModel) {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous supprimer le pays <b>" + timbrePaysModel?.getLibelle() + "</b> ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.timbrePaysService.supprimer(timbrePaysModel)
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
		const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
		saveAs(data, 'export_pays.xlsx');
	}
}
