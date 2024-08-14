// Ingresa ubicación, devolver un true o false
import { coordenadas } from "../types";
export default function checkRosarioLocation({
	latitud,
	longitud,
}: coordenadas) {
	const limite_ciudad_longitud_izq = -60.7813; //La longitud no debe ser menor a este punto.
	const limite_ciudad_longitud_der = -60.61135; //La longitud no debe ser mayor a este punto.
	const limite_ciudad_latitud_sup = -32.87057;
	const limite_ciudad_latitud_inf = -33.03451;
	//Comprobar que esté dentro de los límites de Rosario.
	const long_mayor_limite_izq = longitud > limite_ciudad_longitud_izq;
	const long_mayor_limite_der = longitud < limite_ciudad_longitud_der;
	const lat_menor_limite_sup = latitud < limite_ciudad_latitud_sup;
	const lat_mayor_limite_inf = latitud > limite_ciudad_latitud_inf;
	if (
		long_mayor_limite_izq &&
		long_mayor_limite_der &&
		lat_menor_limite_sup &&
		lat_mayor_limite_inf
	) {
		return true;
	}
	{
		return false;
	}
}
