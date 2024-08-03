export default async function postUnSupermercado(
	nombreSupermercado: string,
	productoBuscado: string,
	signal: AbortSignal
) {
	const endpointScrap = "http://127.0.0.1:3000/scrapSupermercadosRosario";
	const optionsFetch = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			nombreSupermercado: nombreSupermercado,
			productoBuscado: productoBuscado,
		}),
		signal: signal,
	};
	try {
		const res = await fetch(endpointScrap, optionsFetch);
		if (!res.ok) {
			const errorResponse = await res.json();
			throw new Error(errorResponse.errorType);
		}
		const data = await res.json();
		return data.productos;
	} catch (error) {
		throw error;
	}
}
