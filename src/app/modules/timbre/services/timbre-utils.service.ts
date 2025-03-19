import {Injectable} from '@angular/core';


@Injectable()
export class TimbreUtilsService {
	private basePath: string = '/timbres';
	private basePathAcquis: string = '/timbres_acquis';
	private basePathBloc: string = '/timbres_bloc';

	dossierImage: string = "timbres/";
}
