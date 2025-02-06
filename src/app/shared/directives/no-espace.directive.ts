import {Directive, ElementRef, HostListener, Input} from "@angular/core";

@Directive({
    selector: "[noEspace]",
    exportAs: "noEspace",
})
export class NoEspaceDirective {
    @Input() set noEspace(value: boolean | string) {
        if (value.toString() == "false") {
            this._noEspace = false;
        } else {
            this._noEspace = true;
        }
    }

    private _noEspace: boolean = true;

    constructor(private _el: ElementRef) {}

    @HostListener("input", ["$event"])
    @HostListener("paste", ["$event"])
    keyEvent(event: KeyboardEvent) {
        if (this._noEspace) {
            const initialValue = this._el.nativeElement.value;
            this._el.nativeElement.value = initialValue.replace(/ /g, "");
            if (initialValue !== this._el.nativeElement.value) {
                event.stopPropagation();
            }
        }
    }
}
