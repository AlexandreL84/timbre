import {AfterViewInit, Component, Input, OnInit, ViewChild} from "@angular/core";
import {TimbreModel} from "../../../../model/timbre.model";
import {TimbreService} from "../../../../shared/services/timbre/timbre.service";
import {isNotNullOrUndefined} from "../../../../shared/utils/utils";
import {MatDialog} from "@angular/material/dialog";
import {FontAwesomeEnum} from "../../../../shared/enum/font-awesome";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {TimbreModifierComponent} from "../modifier/timbre-modifier.component";
import {BehaviorSubject, first, Observable} from "rxjs";
import {UtilsService} from "../../../../shared/services/utils.service";
import {LibModalComponent} from "../../../../shared/components/lib-modal/lib-modal.component";
import {TimbreAcquisModel} from "../../../../model/timbre-acquis.model";
import {FontAwesomeTypeEnum} from "../../../../shared/enum/font-awesome/font-awesome-type.enum";
import {TimbreUtilsService} from "../../../../shared/services/timbre/timbre-utils.service";
import {BaseEnum} from "../../../../shared/enum/base.enum";
import {AuthService} from "../../../../shared/services/auth.service";
import {DroitEnum} from "../../../../shared/enum/droit.enum";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
	selector: "app-timbre-resultat",
	templateUrl: "./timbre-resultat.component.html",
	styleUrls: ["./timbre-resultat.component.scss"],
})
export class TimbreResultatComponent implements OnInit, AfterViewInit {
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

	constructor(private snackBar: MatSnackBar, public authService: AuthService, public timbreService: TimbreService, public timbreUtilsService: TimbreUtilsService, private dialog: MatDialog, public utilsService: UtilsService) {
		this.dataSource = new MatTableDataSource([]);
	}

	ngOnInit(): void {
		this.annees$ = this.timbreUtilsService.getAnneesAsync(BaseEnum.TIMBRE);
		this.timbre.setTimbreAcquisModel(new TimbreAcquisModel());

		this.displayedColumns = ["image", "id", "annee", "idBloc", "monnaie", "type", "yt", "acquis", "doublon"];
		if (this.modif) {
			this.authService.user$.pipe(first(user => isNotNullOrUndefined(user) && user?.getDroit() == DroitEnum.TOTAL)).subscribe(user=> {
				this.displayedColumns.push("modifier", "supprimer");
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

	droitInsuffisant() {
		this.snackBar.open("Droit insuffisant", null, {
			duration: 6000,
		});
	}

	acquisDoublon(timbreModel: TimbreModel, doublon: boolean) {
		this.authService.user$.pipe(first(user => isNotNullOrUndefined(user))).subscribe(user=> {
			if (user?.getDroit() >= DroitEnum.PARTIEL) {
				this.timbreService.acquis(timbreModel, doublon);
			} else {
				this.droitInsuffisant();
			}
		});
	}

	modifier(timbreModel: TimbreModel) {
		const refDialog = this.dialog.open(TimbreModifierComponent, {
			height: "75vh",
			maxHeight: "750px",
			width: "30%",
			minWidth: "300px",
		});
		refDialog.componentInstance.id = timbreModel.getId();

		refDialog.afterClosed().subscribe(() => {
			refDialog.close();
		});
	}

	supprimer(timbreModel: TimbreModel) {
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
				this.timbreService.supprimer(timbreModel)
			}
		})
	}
}
