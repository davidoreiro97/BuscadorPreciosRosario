import { delay } from "./delay";
import { getEndpoints } from "./getEndpoints";

export default async function postUnSupermercado(
	nombreSupermercado: string,
	productoBuscado: string,
	signal: AbortSignal
) {
	const tunnel_endpoints_base_url = await getEndpoints();
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	//Agregar el url_ngrok como redundancia luego.
	const endpoint_localtunnel = `${url_localtunnel}/scrapSupermercadosRosario`;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "localtunnel", // Para localtunnel
			"bypass-tunnel-reminder": "true", // Para localtunnel
		},
		body: JSON.stringify({
			nombreSupermercado: nombreSupermercado,
			productoBuscado: productoBuscado,
		}),
		signal: signal,
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
				if (res) {
					contador_conectar_localtunnel = 10;
					break;
				} else {
					contador_conectar_localtunnel++;
					console.log("No se pudo conectar con el tunel, reintentando...");
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
		const data = await res.json();
		return data.productos;
	} catch (error) {
		throw error;
	}
}
