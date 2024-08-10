export default async function postUnSupermercado(
	nombreSupermercado: string,
	productoBuscado: string,
	signal: AbortSignal
) {
	//Crear un json en github para obtener los endpoints.
	//Actualizar los endpoints con algún script el cual vaya leyendo el tunel generado para el puerto.
	// const endpointScrap = "http://127.0.0.1:3000/scrapSupermercadosRosario";
	const endpointScrap =
		"https://b160-190-2-103-70.ngrok-free.app/scrapSupermercadosRosario";
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
