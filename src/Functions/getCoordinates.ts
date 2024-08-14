//Esta funcion envía al backend un nombre de dirección, el backend lo consulta a geocode hereapi
//luego devuelve la latitud, longitud y el nombre de la dirección.
//Se conecta mediante tunelees los cuales son inestables por lo que se hace 10 intentos de conexíón a cada uno.
import { delay } from "./delay";
import { getEndpoints } from "./getEndpoints";

export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	const tunnel_endpoints_base_url = await getEndpoints();
	//Agregar el url_ngrok como redundancia luego.
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	const endpoint_localtunnel = `${url_localtunnel}/coordinates`;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "localtunnel", //para localtunnel
			"bypass-tunnel-reminder": "true", //para localtunnel
		},
		body: JSON.stringify({ direccionIngresada: ubicacionText }),
	};

	const maximo_intentos = 10;
	let intentos_localtunnel = 0;
	let res: Response | undefined;

	while (intentos_localtunnel < maximo_intentos) {
		//Revisar esto
		console.log(
			`Intento ${
				intentos_localtunnel + 1
			} de ${maximo_intentos} de conectar a localtunnel`
		);

		try {
			res = await fetch(endpoint_localtunnel, options);
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
				console.log(
					"Error al conectarse al túnel de localtunnel, reintentando..."
				);
				intentos_localtunnel++;
				await delay(2000); // Delay de 2 segundos
			} else {
				console.log("Otro tipo de error en la solicitud");
				intentos_localtunnel = 10;
				throw e; // Propagar otros tipos de errores
			}
		}
	}

	throw new Error(
		"No se pudo conectar con el túnel después de varios intentos."
	);
}
