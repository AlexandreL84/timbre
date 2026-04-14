import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {first} from "rxjs";
import {TimbreResumeService} from "../../../../shared/services/timbre/timbre-resume.service";
import {TimbreResumeModel} from "../../../../model/timbre-resume.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreBlocService} from "../../../../shared/services/timbre/timbre-bloc.service";
import {PreferenceEnum} from "../../../../shared/enum/preference.enum";
import {PreferenceService} from "../../../../shared/services/preference.service";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {TypeTimbreEnum} from "../../../../shared/enum/type-timbre.enum";
import {TimbreResumeAcquisModel} from "../../../../model/timbre-resume-acquis.model";
import {UserModel} from "../../../../model/user.model";

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
	footerColumns: string[] = []; // même liste que displayedColumns
	currentUser: UserModel;

	readonly FontAwesomeEnum = FontAwesomeEnum;
	readonly FontAwesomeTypeEnum = FontAwesomeTypeEnum;
	readonly TypeTimbreEnum = TypeTimbreEnum;

	constructor(
		private authService: AuthService,
		public dialogRef: MatDialogRef<TimbreResumeComponent>,
		public timbreResumeService: TimbreResumeService,
		private timbreService: TimbreService,
		private timbreBlocService: TimbreBlocService,
		private preferenceService: PreferenceService,
	) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.initColumns();
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			this.currentUser = user
		});

		this.getResumeByUser();
		//this.refresh();
	}

	refresh() {
		this.timbreResumeService.refreshResume();
		this.timbreResumeService.loadGeneration$.pipe(first(load => load === true)).subscribe(() => {
			this.initData();
		});
	}

	getResumeByUser() {
		this.timbreResumeService.getResumeByUser(false);
		this.timbreResumeService.load$.pipe(first(load => load === true)).subscribe(() => {
			this.initData();
		});
	}

	initColumns() {
		this.authService.userSelect$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user => {
			const displayedColumns: string[] = ['annee', 'total'];

			// Timbre simple
			displayedColumns.push('nombre', 'acquis');
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push('doublon');
			}

			// Carnet
			displayedColumns.push('nombreCarnet', 'nombreTimbresCarnet', 'acquisTimbresCarnet');
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push('doublonTimbresCarnet');
			}

			// Bloc
			displayedColumns.push('nombreBloc', 'acquisBloc');
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push('doublonBloc');
			}
			displayedColumns.push('nombreTimbresBloc', 'acquisTimbresBloc');
			if (user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push('doublonTimbresBloc');
			}

			// Collector
			if (user?.getDroit() == DroitEnum.CONSULT_TOTAL || user?.getDroit() == DroitEnum.TOTAL) {
				displayedColumns.push('nombreCollector', 'acquisCollector');
			}

			this.displayedColumns = displayedColumns;
			this.footerColumns = displayedColumns;
		});
	}

	initData() {
		this.timbreResumeService.timbresResume$.pipe(first(timbresResume => isNotNullOrUndefined(timbresResume) && timbresResume?.length > 0)).subscribe(timbresResume => {
			this.dataSource.data = timbresResume;
			this.sortDefaut();
		});
	}

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
		this.sortDefaut();
	}

	sortDefaut() {
		this.dataSource.sort = this.sort;
		this.sort.active = 'annee';
		this.sort.direction = 'desc';
		this.sort.sortChange.emit({ active: 'annee', direction: 'desc' });
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
				this.timbreBlocService.getBlocs(timbreCritereModel, false, false);
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

	getAcquisByType(row: TimbreResumeModel, type: TypeTimbreEnum): TimbreResumeAcquisModel | undefined {
		return row.getTimbresResumeTypeModel()
			?.find(t => t.getType() === type)
			?.getTimbreResumeAcquis()
			?.find(a => a.getIdUser() === this.currentUser?.getId());
	}

	getNombreByType(row: TimbreResumeModel, type: TypeTimbreEnum): number {
		return row.getTimbresResumeTypeModel()
			?.find(t => t.getType() === type)
			?.getNombre() ?? 0;
	}

	getNombreTimbreByType(row: TimbreResumeModel, type: TypeTimbreEnum): number {
		return row.getTimbresResumeTypeModel()
			?.find(t => t.getType() === type)
			?.getNombreTimbre() ?? 0;
	}

	getTotalFooter(field: 'total'): number {
		return this.dataSource.data.reduce((sum, row) => sum + (row.getTotal() ?? 0), 0);
	}

	getTotalFooterByType(type: TypeTimbreEnum, field: 'nombre' | 'nombreTimbre' | 'nbAcquis' | 'nbDoublon' | 'nbTimbresAcquis' | 'nbTimbresDoublon'): number {
		return this.dataSource.data.reduce((sum, row) => {
			const typeModel = row.getTimbresResumeTypeModel()?.find(t => t.getType() === type);
			if (!typeModel) return sum;

			switch (field) {
				case 'nombre':
					return sum + (typeModel.getNombre() ?? 0);
				case 'nombreTimbre':
					return sum + (typeModel.getNombreTimbre() ?? 0);
				case 'nbAcquis':
					return sum + (typeModel.getTimbreResumeAcquis()?.find(a => a.getIdUser() === this.currentUser?.getId())?.getNbAcquis() ?? 0);
				case 'nbDoublon':
					return sum + (typeModel.getTimbreResumeAcquis()?.find(a => a.getIdUser() === this.currentUser?.getId())?.getNbDoublon() ?? 0);
				case 'nbTimbresAcquis':
					return sum + (typeModel.getTimbreResumeAcquis()?.find(a => a.getIdUser() === this.currentUser?.getId())?.getNbTimbresAcquis() ?? 0);
				case 'nbTimbresDoublon':
					return sum + (typeModel.getTimbreResumeAcquis()?.find(a => a.getIdUser() === this.currentUser?.getId())?.getNbTimbresDoublon() ?? 0);
				default:
					return sum;
			}
		}, 0);
	}
}
