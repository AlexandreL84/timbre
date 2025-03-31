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

@Component({
	selector: "app-timbre-resume",
	templateUrl: "./timbre-resume.component.html",
	styleUrls: ["./timbre-resume.component.scss"],
})
export class TimbreResumeComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	load$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	dataSource: MatTableDataSource<TimbreResumeModel> = new MatTableDataSource<TimbreResumeModel>();
	displayedColumns: string[] = ["annee", "nombre", "acquis", "doublon", "nombreBloc", "acquisBloc", "doublonBloc"];
	public timbreResumeModel: TimbreResumeModel = new TimbreResumeModel();

	constructor(public timbreResumeService: TimbreResumeService, private timbreService: TimbreService, private timbreUtilsService: TimbreUtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.timbreResumeService.getResume();

		this.load$.next(false);
		this.timbreResumeService.timbresResume$.subscribe(timbresResume => {
			this.dataSource.data = timbresResume;
			this.load$.next(true);
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
			console.log(sort)
			this.dataSource.sort = this.sort;
		}
	}

	filtreParAnnee(timbreResumeModel: TimbreResumeModel) {
		this.timbreUtilsService.timbreCritereModel = new TimbreCritereModel();
		this.timbreUtilsService.timbreCritereModel.setAnnees([timbreResumeModel.getAnnee()]);
		this.timbreService.getTimbres(this.timbreUtilsService.timbreCritereModel);

	}
}
