import {
	supermercadoJson,
	ubicacionCercana,
	supermercadoResultado,
} from "../types";
export default async function buscarSupermercadosCercanos(
	latitudUser: number,
	longitudUser: number,
	radioBusqueda: number,
	todaLaCiudad?: boolean
): Promise<supermercadoResultado[]> {
	const urlUbicacionesSupermercado =
		"/BuscadorPreciosRosario/supermercadosData.json";
	let supermercadosResultado: supermercadoResultado[] = [];
	try {
		const response = await fetch(urlUbicacionesSupermercado);
		const json = await response.json();
		json.supermercados.forEach((supermercado: supermercadoJson) => {
			// Primero, por cada uno de los supermercados se hace un arreglo en donde se guardan sus ubicaciones
			// cercanas calculando la distancia mediante la fórmula de Haversine.
			// Puede ser mejorada luego la distancia entre los supermercados cercanos y la ubicación del usuario
			// utilizando google maps o instalando un servicio local de geocodificación-decodificación-rutas , haversine solo calcula la distancia
			// entre dos puntos sobre una esfera.
			// -> En caso de que se pidan los supermercados de toda la ciudad se debe cambiar en ubicaciones la distanciaHastaSupermercado.
			if (!todaLaCiudad) {
				let ubicacionesCercanas: ubicacionCercana[] = supermercado.ubicaciones
					.map((ubicacion) => {
						// Calculo de la distancia
						const distanciaHastaSupermercado = calcularDistancia(
							latitudUser,
							longitudUser,
							parseFloat(ubicacion.latitud),
							parseFloat(ubicacion.longitud)
						);
						return {
							direccion: ubicacion.direccion,
							latitud: ubicacion.latitud, //Para futuramente calcular mejor la distancia
							longitud: ubicacion.longitud, //Para futuramente calcular mejor la distancia
							//<---> LA DISTANCIA SE DEVUELVE EN KM, RECORDAR : 10 CUADRAS = 1KM. <--->
							distanciaHastaSupermercado: distanciaHastaSupermercado,
						};
					})
					// Se filtran los nulls.
					.filter((ubicacion) => ubicacion !== null)
					// Se ordenan las ubicaciones por distancia de manera ascendente.
					.sort(
						(a, b) =>
							a.distanciaHastaSupermercado - b.distanciaHastaSupermercado
					);

				//Si la ubicación más cercana está dentro del radio de busqueda (es menor o igual al radio de busqueda su distancia).
				// console.log("<----------> Supermercado :", supermercado.nombre);
				// console.log(ubicacionesCercanas);
				if (ubicacionesCercanas[0].distanciaHastaSupermercado < radioBusqueda) {
					supermercadosResultado.push({
						nombre: supermercado.nombre,
						ubicaciones: ubicacionesCercanas,
					});
				}
			} else {
				//Devolver todos los supermercados de la ciudad con el mismo formato que si serían para un lugar y distancia especifica.
				let ubicacionesCercanas: ubicacionCercana[] =
					supermercado.ubicaciones.map((ubicacion) => {
						// Calculo de la distancia
						return {
							direccion: ubicacion.direccion,
							latitud: ubicacion.latitud, //Para futuramente calcular mejor la distancia
							longitud: ubicacion.longitud, //Para futuramente calcular mejor la distancia
							distanciaHastaSupermercado: 0,
						};
					});
				supermercadosResultado.push({
					nombre: supermercado.nombre,
					ubicaciones: ubicacionesCercanas,
				});
			}
		});
	} catch (error) {
		console.error("Error recuperando los supermercados", error);
	}
	return supermercadosResultado;
}

function calcularDistancia(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	const R = 6371; // Radio de la Tierra en km
	const dLat = degToRad(lat2 - lat1); // Diferencia de latitud
	const dLon = degToRad(lon2 - lon1); // Diferencia de longitud
	// Fórmula de Haversine para calcular la distancia en km entre dos puntos.
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(degToRad(lat1)) *
			Math.cos(degToRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	const d: number = R * c; // Distancia en km
	return d;
}

function degToRad(deg: number) {
	//Conversion de grados a radianes
	return deg * (Math.PI / 180);
}
