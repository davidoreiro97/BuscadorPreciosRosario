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
	//Agregar el url_ngrok como redundancia luego.
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
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

	const maximo_intentos = 10;
	let intentos_localtunnel = 0;
	let res: Response | undefined;

	try {
		//Se hace un try para intentar conectar con el tunel varias veces ya que son inestables.
		//Se tiene en cuenta el signal ya que si no se haría los diez intentos aunque se cancele.
		while (intentos_localtunnel < maximo_intentos && !signal.aborted) {
			console.log(
				`Intento ${
					intentos_localtunnel + 1
				} de ${maximo_intentos} de conectar a localtunnel`
			);
			try {
				res = await fetch(endpoint_localtunnel, options);
				if (res.ok) {
					intentos_localtunnel = 10;
					const data = await res.json();
					return data.productos;
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
		//Si el contador de local tunnel llego a 10 intentar con la url de ngrok.
	} catch (error) {
		throw error;
	}
}
