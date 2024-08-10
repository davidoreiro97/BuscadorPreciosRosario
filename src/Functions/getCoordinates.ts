export default async function getCoordinates(
	ubicacionText: string
): Promise<{ latitud: number; longitud: number; direccion: string }> {
	//Crear un json en github para obtener los endpoints.
	//Actualizar los endpoints con algún script el cual vaya leyendo el tunel generado para el puerto.
	// const endpoint = "http://127.0.0.1:3000/coordinates";
	const endpoint = "https://b160-190-2-103-70.ngrok-free.app/coordinates";
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
