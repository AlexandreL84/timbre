import {Directive, HostListener} from "@angular/core";
import {NgControl} from "@angular/forms";

@Directive({
    selector: "[trim]",
})
export class TrimDirective {
    readonly KEY_CODE_ARROW_UP: string = "ArrowUp";
    readonly KEY_CODE_ARROW_DOWN: string = "ArrowDown";

    constructor(private control: NgControl) {}

    @HostListener("paste", ["$event"])
    @HostListener("focus", ["$event"])
    @HostListener("blur", ["$event"])
    keyEvent(event: KeyboardEvent) {
        if (this.control.value && event.code != this.KEY_CODE_ARROW_UP && event.code != this.KEY_CODE_ARROW_DOWN) {
            try {
                this.control.control.setValue(this.control.value.trim());
            } catch (event) {}
        }
    }
}
