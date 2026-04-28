import {Injectable} from "@angular/core";
import jsPDF from "jspdf";
import {TimbreModel} from "../../../model/timbre.model";
import {isNotNullOrUndefined, isString} from "../../utils/utils";
import {TimbreCritereModel} from "../../../model/timbre-critere.model";
import {combineLatest, first} from "rxjs";
import {TimbreVarService} from "./timbre-var.service";
import {AuthService} from "../auth.service";
import {TimbreUtilsService} from "./timbre-utils.service";

@Injectable({
	providedIn: "root",
})
export class TimbrePdfService {

	// Constantes de mise en page
	private readonly PAGE_WIDTH = 210;   // A4 en mm
	private readonly PAGE_HEIGHT = 297;
	private readonly MARGIN = 6;
	private readonly COLS = 8;
	private readonly IMG_SIZE = 20;      // taille de chaque vignette timbre (carré)
	private readonly CELL_PADDING = 2;
	private readonly YEAR_HEADER_H = 10;
	private readonly FOOTER_H = 6;

	constructor(private timbreVarService: TimbreVarService, private authService: AuthService, private timbreUtilsService: TimbreUtilsService) {
	}


	getTimbres(timbreCritereModel: TimbreCritereModel) {
		const timbreCritereBlocModel: TimbreCritereModel = new TimbreCritereModel();
		timbreCritereBlocModel.setAnnees(timbreCritereModel.getAnnees())
		this.timbreVarService.timbresPdf$.next(null);
		this.timbreVarService.loadPdf$.next(false);
		combineLatest([
			this.authService.userSelect$,
			this.timbreUtilsService.getAllTimbres(timbreCritereModel),
		]).pipe(first()).subscribe(([user, timbres]) => {
			if (isNotNullOrUndefined(timbres) && timbres.length > 0) {
				let timbresRetour: TimbreModel[] = this.timbreUtilsService.constructTimbres(user, timbres, null, timbreCritereModel);
				//console.log("verif constructTimbres timbresRetour", timbresRetour)
				if (timbresRetour?.length > 0) {
					timbresRetour = timbresRetour.sort((a, b) => {
						return a.getIdBloc() - b.getIdBloc();
					}).sort((a, b) => {
						return a?.getTimbreBlocModel()?.getNbTimbres() - b?.getTimbreBlocModel()?.getNbTimbres();
					});
				}
				this.timbreVarService.timbresPdf$.next(timbresRetour);
			}
		});
	}

	/**
	 * Génère et télécharge un PDF des timbres regroupés par année.
	 * @param timbres  Liste complète des timbres à inclure
	 * @param filename Nom du fichier téléchargé (défaut: "collection-timbres.pdf")
	 */
	async generatePdf(timbres: TimbreModel[], filename = "collection-timbres.pdf"): Promise<void> {
		const doc = new jsPDF({orientation: "portrait", unit: "mm", format: "a4"});

		// ── 1. Regroupement par année ──────────────────────────────────────────
		const grouped = this.groupByAnnee(timbres);
		const annees = Object.keys(grouped).map(Number).sort((a, b) => a - b);

		const usableWidth = this.PAGE_WIDTH - 2 * this.MARGIN;
		const cellWidth = usableWidth / this.COLS;
		const cellHeight = this.IMG_SIZE + this.FOOTER_H + this.CELL_PADDING * 2;

		let y = this.MARGIN;
		let isFirstPage = true;

		// ── 2. Page de titre ───────────────────────────────────────────────────
		doc.setFont("helvetica", "bold");
		doc.setFontSize(20);
		doc.setTextColor(40, 40, 40);
		doc.text("Collection de Timbres", this.PAGE_WIDTH / 2, 40, {align: "center"});

		doc.setFontSize(12);
		doc.setFont("helvetica", "normal");
		doc.setTextColor(100, 100, 100);
		doc.text(`${timbres.length} timbre(s) — ${annees.length} année(s)`, this.PAGE_WIDTH / 2, 52, {align: "center"});

		doc.addPage();

		// ── 3. Boucle sur les années ───────────────────────────────────────────
		for (const annee of annees) {
			const timbresDeLAnnee = grouped[annee];

			// En-tête d'année
			if (!isFirstPage) {
				// Vérifier si on a la place pour au moins l'en-tête + une ligne de timbres
				if (y + this.YEAR_HEADER_H + cellHeight > this.PAGE_HEIGHT - this.MARGIN) {
					doc.addPage();
					y = this.MARGIN;
				}
			} else {
				y = this.MARGIN;
				isFirstPage = false;
			}

			this.drawYearHeader(doc, annee, timbresDeLAnnee.length, y);
			y += this.YEAR_HEADER_H + 3;

			// ── 4. Grille de timbres ───────────────────────────────────────────
			let col = 0;

			for (const timbre of timbresDeLAnnee) {
				// Nouvelle ligne : vérifier la place
				if (col === 0 && y + cellHeight > this.PAGE_HEIGHT - this.MARGIN) {
					doc.addPage();
					y = this.MARGIN;
				}

				const x = this.MARGIN + col * cellWidth;
				await this.drawTimbreCell(doc, timbre, x, y, cellWidth, cellHeight);

				col++;
				if (col >= this.COLS) {
					col = 0;
					y += cellHeight;
				}
			}

			// Fin de la dernière ligne incomplète
			if (col !== 0) {
				y += cellHeight;
			}

			y += 4; // espace entre les sections d'années
		}

		// ── 5. Numéros de page ─────────────────────────────────────────────────
		const totalPages = (doc as any).internal.getNumberOfPages();
		for (let i = 2; i <= totalPages; i++) {
			doc.setPage(i);
			doc.setFontSize(8);
			doc.setTextColor(160, 160, 160);
			doc.text(`Page ${i - 1} / ${totalPages - 1}`, this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - 5, {align: "center"});
		}

		this.timbreVarService.loadPdf$.next(true);
		doc.save(filename);
	}

	// ── Helpers ──────────────────────────────────────────────────────────────

	/** Regroupe les timbres par année (en tenant compte des blocs). */
	private groupByAnnee(timbres: TimbreModel[]): Record<number, TimbreModel[]> {
		return timbres.reduce((acc, timbre) => {
			const annee = timbre.getIdBloc()
				? timbre.getTimbreBlocModel()?.getAnnee() ?? timbre.getAnnee()
				: timbre.getAnnee();

			if (!acc[annee]) acc[annee] = [];
			acc[annee].push(timbre);
			return acc;
		}, {} as Record<number, TimbreModel[]>);
	}

	/** Dessine la bannière d'une année. */
	private drawYearHeader(doc: jsPDF, annee: number, count: number, y: number): void {
		const usableWidth = this.PAGE_WIDTH - 2 * this.MARGIN;

		// Fond coloré
		doc.setFillColor(52, 73, 110);
		doc.roundedRect(this.MARGIN, y, usableWidth, this.YEAR_HEADER_H, 2, 2, "F");

		// Texte
		doc.setFont("helvetica", "bold");
		doc.setFontSize(11);
		doc.setTextColor(255, 255, 255);
		doc.text(`${annee}`, this.MARGIN + 4, y + 6.8);

		doc.setFont("helvetica", "normal");
		doc.setFontSize(8);
		doc.setTextColor(200, 210, 230);
		doc.text(`${count} timbre${count > 1 ? "s" : ""}`, this.PAGE_WIDTH - this.MARGIN - 2, y + 6.8, {align: "right"});
	}

	/** Dessine la cellule d'un timbre (image + libellé). */
	private async drawTimbreCell(
		doc: jsPDF,
		timbre: TimbreModel,
		x: number,
		y: number,
		cellWidth: number,
		cellHeight: number,
	): Promise<void> {
		// Zone réservée au libellé en bas de cellule
		const labelZoneH = this.FOOTER_H;
		// Zone disponible pour l'image
		const imgZoneW = cellWidth - this.CELL_PADDING * 2;
		const imgZoneH = cellHeight - this.CELL_PADDING * 2 - labelZoneH;

		// Image du timbre
		const imageUrl = timbre.getImage();
		let drawnW = imgZoneW;
		let drawnH = imgZoneH;

		if (isString(imageUrl)) {
			try {
				const {dataUrl, format, naturalWidth, naturalHeight} = await this.fetchImageAsDataUrl(imageUrl.toString());

				// Fit proportionnel dans imgZoneW × imgZoneH
				if (naturalWidth > 0 && naturalHeight > 0) {
					const scale = Math.min(imgZoneW / naturalWidth, imgZoneH / naturalHeight);
					drawnW = naturalWidth  * scale;
					drawnH = naturalHeight * scale;
				}

				// Centrage horizontal et vertical dans la zone image
				const imgX = x + (cellWidth - drawnW) / 2;
				const imgY = y + this.CELL_PADDING + (imgZoneH - drawnH) / 2;

				doc.addImage(dataUrl, format, imgX, imgY, drawnW, drawnH, undefined, "FAST");
			} catch {
				// Image non chargeable : cellule laissée vide
			}
		}

		// Libellé ancré en bas de cellule
		const label = this.getTimbreLabel(timbre);
		if (label) {
			doc.setFontSize(6);
			doc.setTextColor(80, 80, 80);
			doc.setFont("helvetica", "normal");
			const textY = y + cellHeight - labelZoneH + 3;
			doc.text(label, x + cellWidth / 2, textY, {align: "center", maxWidth: cellWidth - 2});
		}
	}

	/** Retourne un libellé court pour un timbre. */
	private getTimbreLabel(timbre: TimbreModel): string {
		// Adapter selon les getters réels de TimbreModel
		const parts: string[] = [];

		if (typeof (timbre as any).getLibelle === "function") {
			const lib = (timbre as any).getLibelle();
			if (lib) parts.push(lib);
		} else if (typeof (timbre as any).getNom === "function") {
			const nom = (timbre as any).getNom();
			if (nom) parts.push(nom);
		}

		if (typeof (timbre as any).getNumero === "function") {
			const num = (timbre as any).getNumero();
			if (num) parts.push(`n°${num}`);
		}

		return parts.join(" — ");
	}

	/**
	 * Charge une image distante et la convertit en dataURL base64.
	 * Retourne également les dimensions naturelles pour préserver le ratio.
	 * Compatible navigateur (fetch) et SSR (à adapter si besoin).
	 */
	private fetchImageAsDataUrl(url: string): Promise<{ dataUrl: string; format: string; naturalWidth: number; naturalHeight: number }> {
		if (url.startsWith("data:")) {
			const format = url.split(";")[0].split("/")[1].toUpperCase();
			// Pour un data-URL on ne connaît pas les dimensions sans créer une Image
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve({dataUrl: url, format, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight});
				img.onerror = () => reject(new Error("Impossible de charger le data-URL"));
				img.src = url;
			});
		}

		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = "anonymous";  // nécessaire pour le canvas
			img.onload = () => {
				const canvas = document.createElement("canvas");
				canvas.width = img.naturalWidth;
				canvas.height = img.naturalHeight;
				const ctx = canvas.getContext("2d")!;
				ctx.drawImage(img, 0, 0);
				const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
				resolve({dataUrl, format: "JPEG", naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight});
			};
			img.onerror = () => reject(new Error("Impossible de charger l'image"));
			img.src = url;
		});
	}
}
