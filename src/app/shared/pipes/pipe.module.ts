import {NgModule} from "@angular/core";
import {ReduireChainePipe} from "./reduire-chaine.pipe";
import {BooleanPipe} from "./boolean.pipe";
import {EnumToArrayPipe} from "./enum.pipe";

@NgModule({
	imports: [],
	declarations: [
		ReduireChainePipe,
		BooleanPipe,
		EnumToArrayPipe
	],
	exports: [
		ReduireChainePipe,
		BooleanPipe,
		EnumToArrayPipe
	],
	providers: [],
})
export class PipeModule {
}
