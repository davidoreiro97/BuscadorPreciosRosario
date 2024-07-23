//Enviar los supermercados en los cuales buscaremos productos.y el producto a buscar.
export default async function postUnSupermercado(
	nombreSupermercado: string,
	productoBuscado: string
) {
	//Armar un archivo con el endpoint, subirlo a un host y hacer fetch al endpoint por si cambia solo actualizarlo de ahí.
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
	};
	try {
		const res = await fetch(endpointScrap, optionsFetch);
		if (!res.ok) {
			const errorResponse = await res.json();
			//Lanzo el errorType
			throw new Error(errorResponse.errorType);
		}
		const data = await res.json();
		return data.productos;
	} catch (error) {
		throw error;
	}
}
