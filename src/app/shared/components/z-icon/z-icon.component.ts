import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SecurityContext, SimpleChanges} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {MatBadgeSize} from "@angular/material/badge";
import {TooltipPosition} from "@angular/material/tooltip";
import {isNotNullOrUndefined, Utils} from "../../utils/utils";
import {FontAwesomeAttributEnum, FontAwesomeEnum} from "../enum/font-awesome";

@Component({
    selector: "z-icon",
    templateUrl: "./z-icon.component.html",
    styleUrls: ["./z-icon.component.scss"],
})
export class ZIconComponent implements OnInit, AfterViewChecked, OnChanges {
    @Input() icone: string;
    @Input() type: string;
    @Input() info: string;
    @Input() infoPosition: TooltipPosition;
    @Input() size: "sm" | "lg" | "2x" | "3x" | "5x" | "6x" | "7x" | "10x";
    @Input() classInfo: string = "tooltiptextDescription";
    @Input() matBadgeHidden: boolean;
    @Input() matBadgeColor;
    @Input() matBadgeClass: string = null;
    @Input() matBadgeSize: MatBadgeSize = "medium";
    @Input() badge: string;
    @Input() rotation: number = 0;
    @Input() svg: boolean = false;
    @Input() color: string;
    @Input() classIcone: string;
    @Input() lienExterne: boolean = false;
    @Input() attribs: FontAwesomeAttributEnum[];

    classToolTip: string;
    selectedIconHtml: string = null;

    constructor(private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
        this.classToolTip = Utils.getRandom(10000).toString();
    }

    ngOnInit() {
        this.initIcone();
    }

    ngAfterViewChecked() {
        if (isNotNullOrUndefined(this.info) && isNotNullOrUndefined(document.getElementsByClassName(this.classToolTip)) && document.getElementsByClassName(this.classToolTip).length > 0) {
            document.getElementsByClassName(this.classToolTip)[0].innerHTML = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(this.info));
        }
    }

    initIcone() {
        if (isNotNullOrUndefined(this.icone) && this.icone.startsWith("fa-")) {
            let classIcon = "fa " + this.icone;
            if (isNotNullOrUndefined(this.classIcone)) {
                classIcon += " " + this.classIcone;
            }
            if (isNotNullOrUndefined(this.info)) {
                classIcon += " click";
            }
            if (isNotNullOrUndefined(this.type) && this.type.length !== 0 && this.type != "" && this.type != FontAwesomeEnum.TYPE_SOLID?.toString()) {
                classIcon += " fa-" + this.type;
            } else {
                classIcon += " fa-" + FontAwesomeEnum.TYPE_SOLID;
            }
            if (isNotNullOrUndefined(this.size)) {
                classIcon += " fa-" + this.size;
            }
            if (isNotNullOrUndefined(this.attribs) && this.attribs.length > 0) {
                this.attribs.forEach(attrib => {
                    classIcon += " " + attrib;
                });
            }

            this.selectedIconHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(`<i class="${classIcon}"></i>`));
        }

        if (this.lienExterne) {
            this.info = "Ouvrir dans un nouvel onglet";
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
		if (changes["icone"] && isNotNullOrUndefined(this.icone)) {
			this.initIcone();
		}
		if (changes["type"] && isNotNullOrUndefined(this.type)) {
			this.initIcone();
		}
    }
}
