import {NgModule} from "@angular/core";
import {ReduireChainePipe} from "./reduire-chaine.pipe";
import {BooleanPipe} from "./boolean.pipe";

@NgModule({
	imports: [],
	declarations: [
		ReduireChainePipe,
		BooleanPipe
	],
	exports: [
		ReduireChainePipe,
		BooleanPipe
	],
	providers: [],
})
export class PipeModule {
}
