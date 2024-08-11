import { getEndpoints } from "./getEndpoints";

export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	const tunnel_endpoints_base_url = await getEndpoints();
	const url_localtunnel = tunnel_endpoints_base_url.url_localtunnel;
	//Agregar el url_ngrok como redundancia luego.
	const endpoint = `${url_localtunnel}/coordinates`;
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"User-Agent": "localtunnel", // Para localtunnel
			"bypass-tunnel-reminder": "true", // Para localtunnel
		},
		body: JSON.stringify({ direccionIngresada: ubicacionText }),
	};

	try {
		const res = await fetch(endpoint, options);
		if (!res.ok) {
			const errorResponse = await res.json();
			throw new Error(errorResponse.errorType);
		}
		const datosUbicacionJson = await res.json();
		const { latitud, longitud, direccion } = datosUbicacionJson;
		return { latitud, longitud, direccion };
	} catch (error: any) {
		throw error;
	}
}
