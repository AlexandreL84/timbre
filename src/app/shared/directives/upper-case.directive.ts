import {Directive, HostListener, Input} from "@angular/core";
import {NgControl} from "@angular/forms";

@Directive({
    standalone: false,
    selector: "[upperCase]",
    exportAs: "upperCase",
})
export class UpperCaseDirective {
    readonly KEY_CODE_ARROW_UP: string = "ArrowUp";
    readonly KEY_CODE_ARROW_DOWN: string = "ArrowDown";

    @Input() set upperCase(value: boolean | string) {
        if (value.toString() == "false") {
            this._upperCase = false;
        } else {
            this._upperCase = true;
        }
    }

    private _upperCase: boolean = true;

    constructor(private control: NgControl) {}

    @HostListener("paste", ["$event"])
    @HostListener("focus", ["$event"])
    @HostListener("blur", ["$event"])
    @HostListener("keyup", ["$event"])
    //@HostListener("input", ["$event"])
    keyEvent(event: Event) {
        if (this._upperCase) {
            if (this.control.value && !this.isFlecheHautBas(event)) {
                try {
                    this.control.control.setValue(this.control.value.toUpperCase());
                } catch (event) {}
            }
        }
    }

    // Seuls les événements clavier ont un code de touche : paste, focus et blur ne sont jamais des flèches.
    private isFlecheHautBas(event: Event): boolean {
        return event instanceof KeyboardEvent && (event.code == this.KEY_CODE_ARROW_UP || event.code == this.KEY_CODE_ARROW_DOWN);
    }
}
