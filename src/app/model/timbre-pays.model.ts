import {Label} from "./utils/utils-model";
import {ProprieteModel} from "./utils/propriete-model";

export class TimbrePaysModel extends ProprieteModel {
	@Label("Identifiant")
	id: number;

	@Label("Code")
	code: string;

	@Label("Libellé")
	libelle: string;

	@Label("Libellé langue")
	libelleLangue: string;

	@Label("Image langue")
	imageLangue: File | string;

	@Label("Image langue")
	imageLangueZoom: string;

	@Label("Zone")
	zone: string;

	@Label("Classeur")
	classeur: number;

	@Label("Page")
	page: number;

	@Label("Total")
	total: number;

	@Label("Map")
	map: File | string;

	@Label("Map")
	mapZoom: string;

	@Label("Drapeau")
	drapeau: File | string;

	@Label("Drapeau")
	drapeauZoom: string;

	@Label("Visible")
	visible: boolean;

	constructor(id?: number, code?: string, libelle?: string, libelleLangue?: string, imageLangueZoom?: string, imageLangue?: File | string, zone?: string, classeur?: number, page?: number, total?: number, map?: File | string,  mapZoom?: string, drapeau?: File | string,  drapeauZoom?: string, visible?: boolean) {
		super();
		this.id = id ? id : null;
		this.code = code ? code : null;
		this.libelle = libelle ? libelle : null;
		this.libelleLangue = libelleLangue ? libelleLangue : null;
		this.imageLangue = imageLangue ? imageLangue : null;
		this.imageLangueZoom = imageLangueZoom ? imageLangueZoom : null;
		this.zone = zone ? zone : null;
		this.classeur = classeur ? classeur : null;
		this.page = page ? page : null;
		this.total = total ? total : null;
		this.map = map ? map : null;
		this.mapZoom = mapZoom ? mapZoom : null;
		this.drapeau = drapeau ? drapeau : null;
		this.drapeauZoom = drapeauZoom ? drapeauZoom : null;
		this.visible = visible ? visible : false;
	}

	getId(): number {
		return this.id;
	}

	setId(value: number) {
		this.id = value;
	}

	getCode(): string {
		return this.code;
	}

	setCode(value: string) {
		this.code = value;
	}

	getLibelle(): string {
		return this.libelle;
	}

	setLibelle(value: string) {
		this.libelle = value;
	}

	getLibelleLangue(): string {
		return this.libelleLangue;
	}

	setLibelleLangue(value: string) {
		this.libelleLangue = value;
	}

	getImageLangue(): File | string {
		return this.imageLangue;
	}

	setImageLangue(value: File | string) {
		this.imageLangue = value;
	}

	getImageLangueZoom(): string {
		return this.imageLangueZoom;
	}

	setImageLangueZoom(value: string) {
		this.imageLangueZoom = value;
	}

	getZone(): string {
		return this.zone;
	}

	setZone(value: string) {
		this.zone = value;
	}

	getClasseur(): number {
		return this.classeur;
	}

	setClasseur(value: number) {
		this.classeur = value;
	}

	getPage(): number {
		return this.page;
	}

	setPage(value: number) {
		this.page = value;
	}

	getTotal(): number {
		return this.total;
	}

	setTotal(value: number) {
		this.total = value;
	}

	getMap(): File | string {
		return this.map;
	}

	setMap(value: File | string) {
		this.map = value;
	}

	getMapZoom(): string {
		return this.mapZoom;
	}

	setMapZoom(value: string) {
		this.mapZoom = value;
	}

	getDrapeau(): File | string {
		return this.drapeau;
	}

	setDrapeau(value: File | string) {
		this.drapeau = value;
	}

	getDrapeauZoom(): string {
		return this.drapeauZoom;
	}

	setDrapeauZoom(value: string) {
		this.drapeauZoom = value;
	}

	getVisible(): boolean {
		return this.visible;
	}

	setVisible(value: boolean) {
		this.visible = value;
	}
}
