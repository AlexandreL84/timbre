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
import {TimbrePaysAjouterComponent} from "../ajouter/timbre-pays-ajouter.component";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import {UploadService} from "../../../../shared/services/upload.service";

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

	ajouter(timbrePaysModel: TimbrePaysModel) {
		const refDialog = this.dialog.open(TimbrePaysAjouterComponent, {
			height: "75vh",
			maxHeight: "350px",
			width: "20%",
		});
		refDialog.componentInstance.id = timbrePaysModel.id;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	modifierTimbre(timbrePaysModel: TimbrePaysModel) {
		const refDialog = this.dialog.open(TimbrePaysModifierComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
		});
		refDialog.componentInstance.id = timbrePaysModel.id;
		//refDialog.componentInstance.code = timbrePaysModel.code;

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	deleteTimbre(timbrePaysModel: TimbrePaysModel) {
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
				this.timbrePaysService.deleteTimbre(timbrePaysModel)
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

		const doc = new jsPDF({
			orientation: 'portrait',
			unit: 'pt',
			format: 'a4'
		});
		const xOffset = doc.internal.pageSize.width / 2;
		doc.setFontSize(16);
		doc.setTextColor("#0e526e");
		doc.text('Titre par Pays', xOffset, 30,{align: 'center'});

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

		doc.save('document.pdf');

	}

	generatePDF2() {
		const element = document.getElementById('pdf-content'); // Sélectionne l'élément HTML à capturer

		if (element) {
			const doc = new jsPDF();

			// Générer le PDF à partir de l'élément HTML
			doc.html(element, {
				callback: function (doc) {
					doc.save('generated.pdf');
				},
				margin: [10, 10, 10, 10],
				autoPaging: true
			});
		}
	}
}
