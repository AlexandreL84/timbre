import {Directive, EventEmitter, HostListener, Output} from "@angular/core";

@Directive({
    selector: "[DragAndDrop]",
})
export class DragAndDropDirective {
    @Output() private fileEmiter: EventEmitter<File[]> = new EventEmitter();
    @Output() private InvalidEmiter: EventEmitter<File[]> = new EventEmitter();

    @HostListener("dragover", ["$event"]) onDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener("dragleave", ["$event"])
    public onDragLeave(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    @HostListener("drop", ["$event"])
    public onDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        const files = event.dataTransfer.files;
        if (files.length > 0) {
            this.fileEmiter.emit(files);
        }
    }
}
