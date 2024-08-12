import { delay } from "./delay";
import { getEndpoints } from "./getEndpoints";

export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	const tunnel_endpoints_base_url = await getEndpoints();
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	const endpoint_localtunnel = `${url_localtunnel}/coordinates`;

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "localtunnel", // Para localtunnel
			"bypass-tunnel-reminder": "true", // Para localtunnel
		},
		body: JSON.stringify({ direccionIngresada: ubicacionText }),
	};

	let res: Response | undefined;
	let contador_conectar_localtunnel = 0;

	try {
		//Se hace un try para intentar conectar con el tunel varias veces ya que son inestables.
		while (contador_conectar_localtunnel < 10) {
			console.log(
				`Intento ${
					contador_conectar_localtunnel + 1
				} de 10 de conectar a localtunnel`
			);
			try {
				res = await fetch(endpoint_localtunnel, options);
				if (!res.ok) {
					contador_conectar_localtunnel = 10;
					break;
				}
				if (res) {
					contador_conectar_localtunnel = 10;
					break;
				} else {
					contador_conectar_localtunnel++;
				}
			} catch (e) {
				contador_conectar_localtunnel = 10;
				break;
			}
			if (contador_conectar_localtunnel < 10) {
				//Un delay de 2 segundos, para ver si esperando funciona
				await delay(2500);
			}
		}
		//Si el contador de local tunnel llego a 10 intentar con la url de ngrok.

		if (!res) {
			contador_conectar_localtunnel = 10;
			throw new Error("No se pudo conectar con el túnel.");
		}
		if (!res.ok) {
			contador_conectar_localtunnel = 10;
			const errorResponse = await res.json();
			throw new Error(errorResponse.errorType);
		}

		const datosUbicacionJson = await res.json();
		const { latitud, longitud, direccion } = datosUbicacionJson;
		return { latitud, longitud, direccion };
	} catch (error: any) {
		console.error("Error al obtener coordenadas:", error);
		throw error;
	}
}
