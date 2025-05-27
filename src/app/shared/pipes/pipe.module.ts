import {NgModule} from "@angular/core";
import {ReduireChainePipe} from "./reduire-chaine.pipe";
import {BooleanPipe} from "./boolean.pipe";
import {EnumToArrayPipe} from "./enum.pipe";
import {CapitalizePipe} from "./capitalize.pipe";

@NgModule({
	imports: [],
	declarations: [
		ReduireChainePipe,
		BooleanPipe,
		EnumToArrayPipe,
		CapitalizePipe
	],
	exports: [
		ReduireChainePipe,
		BooleanPipe,
		EnumToArrayPipe,
		CapitalizePipe
	],
	providers: [],
})
export class PipeModule {
}
