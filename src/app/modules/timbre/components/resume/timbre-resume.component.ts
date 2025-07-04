import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {first} from "rxjs";
import {TimbreResumeService} from "../../../../shared/services/timbre/timbre-resume.service";
import {TimbreResumeModel} from "../../../../model/timbre-resume.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {PreferenceEnum} from "../../../../shared/enum/preference.enum";
import {PreferenceService} from "../../../../shared/services/preference.service";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {AuthService} from "../../../../shared/services/auth.service";

@Component({
	selector: "app-timbre-resume",
	templateUrl: "./timbre-resume.component.html",
	styleUrls: ["./timbre-resume.component.scss"],
})
export class TimbreResumeComponent implements OnInit, AfterViewInit {
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	dataSource: MatTableDataSource<TimbreResumeModel> = new MatTableDataSource<TimbreResumeModel>();
	displayedColumns: string[] = [];
	public timbreResumeModel: TimbreResumeModel = new TimbreResumeModel();

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;

	constructor(
		private authService: AuthService,
		public dialogRef: MatDialogRef<TimbreResumeComponent>,
		public timbreResumeService: TimbreResumeService,
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private timbreUtilsService: TimbreUtilsService,
		private preferenceService: PreferenceService
	) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.initColumns();
		this.timbreUtilsService.reinitResume$.pipe(first()).subscribe(reinit => {
			if (reinit == true) {
				this.timbreResumeService.getResume();
			}
			this.initData();
		});

	}

	initColumns() {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			const displayedColumns: string[] = [];
			displayedColumns.push("annee", "total", "nombre", "acquis");
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push("doublon");
			}
			displayedColumns.push("nombreCarnet", "nombreTimbresCarnet", "acquisTimbresCarnet");
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push("doublonTimbresCarnet");
			}
			displayedColumns.push("nombreBloc", "acquisBloc");
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push("doublonBloc");
			}
			displayedColumns.push("nombreTimbresBloc", "acquisTimbresBloc");
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push("doublonTimbresBloc");
			}
			displayedColumns.push();
			if (user?.getDroit() == DroitEnum.CONSULT_TOTAL || user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push("nombreCollector", "acquisCollector"/*, "doublonCollector", "nombreTimbresCollector", "acquisTimbresCollector", "doublonTimbresCollector"*/);
			}

			this.displayedColumns = displayedColumns;
		});
	}

	initData() {
		this.timbreResumeService.timbresResume$.pipe(first(timbresResume => isNotNullOrUndefined(timbresResume) && timbresResume?.length > 0)).subscribe(timbresResume => {
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
		if (window.location.href.indexOf("bloc") > 0) {
			this.preferenceService.getTimbreCritere(PreferenceEnum.BLOC_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
				timbreCritereModel.initCritereBloc();
				timbreCritereModel.setAnnees([timbreResumeModel.getAnnee()]);
				this.preferenceService.modifier(PreferenceEnum.BLOC_CRITERE, timbreCritereModel)
				this.timbreBlocService.getBlocs(timbreCritereModel, false);
			});
		} else {
			this.preferenceService.getTimbreCritere(PreferenceEnum.TIMBRE_CRITERE).pipe(first()).subscribe(timbreCritereModel => {
				timbreCritereModel.initCritere();
				timbreCritereModel.setAnnees([timbreResumeModel.getAnnee()]);
				this.preferenceService.modifier(PreferenceEnum.TIMBRE_CRITERE, timbreCritereModel)
				this.timbreService.getTimbres(timbreCritereModel, false);
			});
		}
		this.dialogRef.close();
	}
}
