import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {BehaviorSubject} from "rxjs";
import {TimbreResumeService} from "../../../../shared/services/timbre/timbre-resume.service";
import {TimbreResumeModel} from "../../../../model/timbre-resume.model";
import {TimbreCritereModel} from "../../../../model/timbre-critere.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";

@Component({
	selector: "app-timbre-resume",
	templateUrl: "./timbre-resume.component.html",
	styleUrls: ["./timbre-resume.component.scss"],
})
export class TimbreResumeComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	dataSource: MatTableDataSource<TimbreResumeModel> = new MatTableDataSource<TimbreResumeModel>();
	displayedColumns: string[] = ["annee", "total", "nombre", "acquis", "doublon", "nombreCarnet", "nombreTimbresCarnet",  "acquisTimbresCarnet", "doublonTimbresCarnet", "nombreBloc", "acquisBloc", "doublonBloc", "nombreTimbresBloc", "acquisTimbresBloc", "doublonTimbresBloc"];
	public timbreResumeModel: TimbreResumeModel = new TimbreResumeModel();

	constructor(public dialogRef: MatDialogRef<TimbreResumeComponent>, public timbreResumeService: TimbreResumeService, private timbreService: TimbreService, private timbreUtilsService: TimbreUtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.timbreResumeService.getResume();

		this.timbreResumeService.timbresResume$.subscribe(timbresResume => {
			this.dataSource.data = timbresResume;
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

	filtreParAnnee(timbreResumeModel: TimbreResumeModel) {
		this.timbreUtilsService.timbreCritereModel = new TimbreCritereModel();
		this.timbreUtilsService.timbreCritereModel.setAnnees([timbreResumeModel.getAnnee()]);
		this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel);
		this.dialogRef.close();
	}

	protected readonly FontAwesomeEnum = FontAwesomeEnum;
	protected readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
}
