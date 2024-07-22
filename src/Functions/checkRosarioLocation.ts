// Ingresa ubicación, devolver un true o false
import { coordenadas } from "../types";
export default function checkRosarioLocation({
	latitud,
	longitud,
}: coordenadas) {
	const limite_latitud_norte = -32.86157703503613; //noroeste
	const limite_longitud_oeste = -60.92472000370793; //noroeste
	const limite_latitud_sur = -33.04157703503613; //sureste
	const limite_longitud_este = -60.58472095167686; //sureste
	//Comprobar que esté dentro de los límites de Rosario.
	const cond_1 = latitud < limite_latitud_norte;
	const cond_2 = limite_latitud_sur < latitud;
	const cond_3 = longitud < limite_longitud_oeste;
	const cond_4 = limite_longitud_este < longitud;
	if (!cond_1 && !cond_2 && !cond_3 && !cond_4) {
		return false;
	}
	{
		return true;
	}
}
