//Esta funcion envía al backend un nombre de dirección, el backend lo consulta a geocode hereapi
//luego devuelve la latitud, longitud y el nombre de la dirección.
//Se conecta mediante tunelees los cuales son inestables por lo que se hace 10 intentos de conexíón a cada uno.
import { delay } from "./delay";
import { getEndpoints } from "./getEndpoints";

export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	const tunnel_endpoints_base_url = await getEndpoints();
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	const url_ngrok = tunnel_endpoints_base_url.url_ngrok;
	const endpoint_localtunnel = `${url_localtunnel}/coordinates`;
	const endpoint_ngrok = `${url_ngrok}/coordinates`;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "localtunnel", //para localtunnel y Ngrok
			"bypass-tunnel-reminder": "true", //para localtunnel
		},
		body: JSON.stringify({ direccionIngresada: ubicacionText }),
	};

	const maximo_intentos = 10;

	async function intentarConectar(endpoint: string) {
		let intentos = 0;
		let res: Response | undefined;

		while (intentos < maximo_intentos) {
			console.log(
				`Intento ${
					intentos + 1
				} de ${maximo_intentos} de conectar a ${endpoint}`
			);

			try {
				res = await fetch(endpoint, options);
				if (res.ok) {
					const datosUbicacionJson = await res.json();
					const { latitud, longitud, direccion } = datosUbicacionJson;
					return { latitud, longitud, direccion };
				} else {
					const errorResponse = await res.json();
					throw new Error(
						errorResponse.errorType || "Error desconocido del servidor"
					);
				}
			} catch (e: any) {
				console.log(e.message);
				if (
					e instanceof TypeError &&
					(e.message.includes("network error") ||
						e.message.includes("Failed to fetch"))
				) {
					console.log("Error al conectarse, reintentando...");
					intentos++;
					await delay(2000); // Delay de 2 segundos
				} else {
					console.log("Otro tipo de error en la solicitud");
					intentos = maximo_intentos; // Salir del bucle si es otro tipo de error
					throw e; // Propagar otros tipos de errores
				}
			}
		}

		throw new Error("No se pudo conectar después de varios intentos.");
	}

	try {
		return await intentarConectar(endpoint_localtunnel);
	} catch (e: any) {
		if (e.message === "No se pudo conectar después de varios intentos.") {
			console.log(
				"Fallo en TODOS los intentos con localtunnel, intentando con ngrok..."
			);
			return await intentarConectar(endpoint_ngrok);
		} else {
			throw e;
		}
	}
}
