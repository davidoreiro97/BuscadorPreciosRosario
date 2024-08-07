import { geolocationReturn } from "../types";
export default async function getGeolocation(): Promise<geolocationReturn> {
	return new Promise((resolve, reject) => {
		const options = {
			enableHighAccuracy: true, //Habilitar alta presición en la ubicación.
			timeout: 10000, //Tiempo de espera en ms para obtener respuesta.
			maximunAge: 0, //Limpia cache de la localización.
		};

		const successGetLocation = (position: GeolocationPosition) => {
			//Funcion si tenemos exito en obtener la localización del usuario.
			resolve({
				latitud: position.coords.latitude,
				longitud: position.coords.longitude,
				precision: position.coords.accuracy,
			});
		};
		const errorGetLocation = (error: GeolocationPositionError) => {
			//Funcion si NO tenemos exito en obtener la localización del usuario.
			reject(error);
		};

		navigator.geolocation.getCurrentPosition(
			successGetLocation,
			errorGetLocation,
			options
		);
	});
}
