import {Directive, HostListener} from "@angular/core";
import {NgControl} from "@angular/forms";

@Directive({
    standalone: false,
    selector: "[trim]",
})
export class TrimDirective {
    readonly KEY_CODE_ARROW_UP: string = "ArrowUp";
    readonly KEY_CODE_ARROW_DOWN: string = "ArrowDown";

    constructor(private control: NgControl) {}

    @HostListener("paste", ["$event"])
    @HostListener("focus", ["$event"])
    @HostListener("blur", ["$event"])
    keyEvent(event: Event) {
        if (this.control.value && !this.isFlecheHautBas(event)) {
            try {
                this.control.control.setValue(this.control.value.trim());
            } catch (event) {}
        }
    }

    // Seuls les événements clavier ont un code de touche : paste, focus et blur ne sont jamais des flèches.
    private isFlecheHautBas(event: Event): boolean {
        return event instanceof KeyboardEvent && (event.code == this.KEY_CODE_ARROW_UP || event.code == this.KEY_CODE_ARROW_DOWN);
    }
}
