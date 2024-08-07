export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	//Hacer un fetch a un json y obtener la url del endpoint en Ngrok luego ya que esta puede variar.
	//Se actualizará dicho json con un script que comprobará si la url de ngrok es igual a la url del json publicado.
	// const endpoint = "http://127.0.0.1:3000/coordinates";
	const endpoint = "http://192.168.0.4:3000/coordinates";
	const options = {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ direccionIngresada: ubicacionText }),
	};
	try {
		const res = await fetch(endpoint, options);
		if (!res.ok) {
			const errorResponse = await res.json();
			//Lanzo el errorType
			throw new Error(errorResponse.errorType);
		}
		const datosUbicacionJson = await res.json();
		const { latitud, longitud, direccion } = datosUbicacionJson;
		return { latitud, longitud, direccion };
	} catch (error: any) {
		//Capturo y reenvio el errorType al try de afuera.
		throw error;
	}
}
