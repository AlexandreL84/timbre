import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../services/timbre.service";
import {isNotNullOrUndefined, Utils} from "../../../../shared/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {TimbreModifierComponent} from "../modifier/timbre-modifier.component";
import {BehaviorSubject, Observable} from "rxjs";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {UtilsService} from "../../../../shared/services/utils.service";
import {LibModalComponent} from "../../../../shared/components/lib-modal/lib-modal.component";
import {TimbreAcquisModel} from "../../../../model/timbre-acquis.model";
import {TimbreCritereModel} from "../../../../model/timbre-critere.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";

@Component({
	selector: "app-timbre-resultat",
	templateUrl: "./timbre-resultat.component.html",
	styleUrls: ["./timbre-resultat.component.scss"],
})
export class TimbreResultatComponent implements OnInit, AfterViewInit  {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	@Input() timbres$: BehaviorSubject<TimbreModel[]> | Observable<TimbreModel[]>;
	@Input() modif: boolean = true;

	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dataSource: MatTableDataSource<TimbreModel> = new MatTableDataSource<TimbreModel>();
	displayedColumns: string[];
	public timbreCritereModel: TimbreCritereModel = new TimbreCritereModel();
	public timbre: TimbreModel = new TimbreModel();
	annees$: Observable<number[]>

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly Utils = Utils;
	anneeMin: number = 2000;
	anneeMax: number = new Date().getFullYear();

	constructor(public timbreService: TimbreService, private dialog: MatDialog, public utilsService: UtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.annees$ = this.timbreService.getAnneesAsync();
		this.timbre.setTimbreAcquisModel(new TimbreAcquisModel());

		this.displayedColumns = ["image", "id", "annee", "idBloc", "monnaie", "type",  "yt",  "acquis", "doublon"];
		if (this.modif) {
			this.displayedColumns.push("modifier", "supprimer");
		}

		this.load$.next(false);
		this.timbres$.subscribe(timbres => {
			this.dataSource.data = timbres;
			this.load$.next(true);
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.sort.active = 'idBloc';
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
		this.timbreService.getTimbres(this.timbreCritereModel);
	}

	applyFilter(event: Event) {
		const filterValue = (event.target as HTMLInputElement).value;
		this.dataSource.filter = filterValue.trim().toLowerCase();
	}

	acquis(timbreModel: TimbreModel) {
		this.timbreService.acquis(timbreModel, false);
	}

	doublon(timbreModel: TimbreModel) {
		this.timbreService.acquis(timbreModel, true);
	}

	modifierTimbre(timbreModel: TimbreModel) {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
		});
		refDialog.componentInstance.id = timbreModel.getId();

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	deleteTimbre(timbreModel: TimbreModel) {
		const dialogModal = this.dialog.open(LibModalComponent, {
			maxHeight: "95vh",
			data: {
				titre: "Confirmation",
				message: "Souhaitez-vous supprimer le timbre <b>n° " + timbreModel?.getId() + "</b> ?",
				btnDroite: "Oui",
				btnGauche: "Non",
			},
		});

		dialogModal.afterClosed().subscribe(() => {
			if (dialogModal.componentInstance.data.resultat === "valider") {
				this.timbreService.deleteTimbre(timbreModel)
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
		saveAs(data, 'export_timbres.xlsx');
	}

	generatePDFByImage() {
		const imageUrl = 'https://firebasestorage.googleapis.com/v0/b/book-f941b.appspot.com/o/AF.png?alt=media&token=a1039f78-3cff-41ab-8569-ea1b2cefe2c1';
		this.generatePDF(null);
		//this.uploadService.getImageBase642(imageUrl);

		/*this.uploadService.getImageBase64(imageUrl).subscribe(
			(base64) => {
				this.generatePDF(base64);
			},
			(error) => {
				console.error(error);
			}
		);*/
	}

	generatePDF(base64) {

		/*const doc = new jsPDF({
			orientation: 'portrait',
			unit: 'pt',
			format: 'a4'
		});
		const xOffset = doc.internal.pageSize.width / 2;
		doc.setFontSize(16);
		doc.setTextColor("#0e526e");
		doc.text('Titre', xOffset, 30,{align: 'center'});

		if (base64) {
			doc.addImage('data:image/jpeg;base64,' + base64, 'jpg', 100, 10, 20, 20)// use the method doc.autoTable.previous.finalY + lineHeight * 1.5 + offsetY to be able to position the image of the signature below the table at a safe distance from it
		}

		// Exemple de contenu du tableau
		const tableColumn = ["Code", "Libellé", "Classeur", "Page", "Total"];
		const tableRows = [];
		this.dataSource.data.forEach(data => {
			console.log(data);
			tableRows.push([data.getCode(), data?.getLibelle(), data?.getClasseur(), data?.getPage(), data?.getTotal()]);
		})

		autoTable(doc, {
			head: [tableColumn],
			body: tableRows,
			margin: {top: 60},
			headStyles: {fillColor: "#0e526e"},
			//alternateRowStyles: {fillColor : "#b7cbd4"}
		});

		doc.save('document.pdf');*/
	}
}
