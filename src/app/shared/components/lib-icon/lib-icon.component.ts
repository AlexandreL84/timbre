import {AfterViewChecked, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SecurityContext, SimpleChanges} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {TooltipPosition} from "@angular/material/tooltip";
import {isNotNullOrUndefined, Utils} from "../../utils/utils";
import {FontAwesomeAttributEnum, FontAwesomeEnum} from "../../enum/font-awesome";
import {FontAwesomeTypeEnum} from "../../enum/font-awesome/font-awesome-type.enum";

@Component({
    selector: "lib-icon",
    templateUrl: "./lib-icon.component.html",
    styleUrls: ["./lib-icon.component.scss"],
})
export class LibIconComponent implements OnInit, AfterViewChecked, OnChanges {
    @Input() icone: FontAwesomeEnum;
    @Input() type: FontAwesomeTypeEnum;
    @Input() info: string;
    @Input() infoPosition: TooltipPosition;
    @Input() classInfo: string = "tooltiptextDescription tooltiptextBgWhite widthAuto";
    @Input() color: string;
    @Input() classIcone: string;
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
            if (isNotNullOrUndefined(this.type) && this.type.length !== 0 && isNotNullOrUndefined(this.type) && this.type != FontAwesomeTypeEnum.TYPE_SOLID?.toString()) {
                classIcon += " fa-" + this.type;
            } else {
                classIcon += " fa-" + FontAwesomeTypeEnum.TYPE_SOLID;
            }
            if (isNotNullOrUndefined(this.attribs) && this.attribs.length > 0) {
                this.attribs.forEach(attrib => {
                    classIcon += " " + attrib;
                });
            }

            this.selectedIconHtml = this.sanitizer.sanitize(SecurityContext.HTML, this.sanitizer.bypassSecurityTrustHtml(`<i class="${classIcon}"></i>`));
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
