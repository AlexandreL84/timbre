import {ComponentRef, Directive, Input, OnDestroy, OnInit, ViewContainerRef} from "@angular/core";
import {AbstractControl, NgControl} from "@angular/forms";
import {fromEvent, Observable, Subject} from "rxjs";
import {ErrorControlComponent} from "../../../modules/error";

@Directive({
    selector: "[zControl]",
})
export class ControlErrorsDirective implements OnInit, OnDestroy {
    public autoErrorComponentRef: ComponentRef<ErrorControlComponent>;

    public touchObservableEvent: Observable<Event>;
    public destroySubject: Subject<void> = new Subject();

    @Input("zControl") attribut: string;

    public constructor(private viewContainerRef: ViewContainerRef, private directiveControl: NgControl) {}

    public ngOnInit() {
        this.setupEvents();
        this.createErrorComponent();
    }

    public ngOnDestroy() {
        this.destroySubject.complete();
    }

    private setupEvents(): void {
        this.touchObservableEvent = fromEvent(this.viewContainerRef.element.nativeElement, "blur");
    }

    private createErrorComponent(): void {
        this.autoErrorComponentRef = this.viewContainerRef.createComponent(ErrorControlComponent);
        this.autoErrorComponentRef.instance.control = this.control;
        this.autoErrorComponentRef.instance.attribut = this.attribut;
    }

    private get control(): AbstractControl {
        return this.directiveControl.control;
    }
}
