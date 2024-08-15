//Esta funcion envía el nombre del supermercado, signal y el producto buscado al backend esperando
//recibir un chunk con los productos encontrados en ese supermercado, se reintenta unas 10 veces conectar
//con el tunel del backend ya que es muy inestable, luego se intentan 10 veces más con ngrok que está como
//tunel de backup
import { delay } from "./delay";
import { getEndpoints } from "./getEndpoints";

export default async function postUnSupermercado(
	nombreSupermercado: string,
	productoBuscado: string,
	signal: AbortSignal
) {
	const tunnel_endpoints_base_url = await getEndpoints();
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	const url_ngrok = tunnel_endpoints_base_url.url_ngrok;
	const endpoint_localtunnel = `${url_localtunnel}/scrapSupermercadosRosario`;
	const endpoint_ngrok = `${url_ngrok}/scrapSupermercadosRosario`; // Corregir si el endpoint es diferente

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

	const maximo_intentos = 10;

	async function intentarConectar(endpoint: string) {
		let intentos = 0;
		let res: Response | undefined;
		while (intentos < maximo_intentos && !signal.aborted) {
			console.log(
				`Intento ${
					intentos + 1
				} de ${maximo_intentos} de conectar a ${endpoint}`
			);
			try {
				res = await fetch(endpoint, options);
				if (res.ok) {
					const data = await res.json();
					return data.productos;
				} else {
					const errorResponse = await res.json();
					throw new Error(
						errorResponse.errorType || "Error desconocido del servidor"
					);
				}
			} catch (e: any) {
				if (
					e instanceof TypeError &&
					(e.message.includes("network error") ||
						e.message.includes("Failed to fetch"))
				) {
					console.log("Error al conectarse, reintentando...");
					intentos++;
					await delay(2000); // Delay de 2 segundos
				} else {
					if (signal.aborted) {
						console.log("Se aborto la solicitud.");
					} else {
						console.log("Otro tipo de error en la solicitud.");
					}
					intentos = maximo_intentos; // Salir del bucle si es otro tipo de error
					throw e; // Propagar otros tipos de errores
				}
			}
		}
		if (!signal.aborted && intentos === maximo_intentos) {
			throw new Error("No se pudo conectar después de varios intentos.");
		}
		if (signal.aborted) {
			throw new Error("signal is aborted without reason");
		}
	}

	try {
		// Intento primero con localtunnel
		return await intentarConectar(endpoint_localtunnel);
	} catch (e: any) {
		if (e.message === "No se pudo conectar después de varios intentos.") {
			// Intento con ngrok si localtunnel falla
			console.log(
				"Fallo en los intentos con localtunnel, intentando con ngrok..."
			);
			return await intentarConectar(endpoint_ngrok);
		} else {
			throw e;
		}
	}
}
