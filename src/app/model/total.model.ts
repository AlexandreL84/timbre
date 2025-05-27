import { Label } from './utils/utils-model';
import { ProprieteModel } from './utils/propriete-model';
import {TypeTimbreEnum} from "../shared/enum/type-timbre.enum";

export class TotalModel extends ProprieteModel {
	@Label('Type')
	type: TypeTimbreEnum | string;

	@Label('Total')
	total: number;

	constructor(type?: TypeTimbreEnum | string, total?: number) {
		super();
		this.type = type ? type : null;
		this.total = total ? total : null;
	}

	getType(): TypeTimbreEnum | string {
		return this.type;
	}

	setType(value: TypeTimbreEnum | string) {
		this.type = value;
	}

	getTotal(): number {
		return this.total;
	}

	setTotal(value: number) {
		this.total = value;
	}
}
