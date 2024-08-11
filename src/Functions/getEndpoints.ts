export const getEndpoints = async () => {
	//Se obtiene un JSON el cual contiene las url a los tuneles abiertos en el servidor,
	//estas url van cambiando cada ciertas horas y se van actualizando debido a que el plan es
	//gratuito y dejan de funcionar, por lo que las renuevo para poder seguirlas usando.
	const gitHubJSON =
		"https://raw.githubusercontent.com/davidoreiro97/endpointsAppsTesting/master/endpoints.json";
	try {
		const response = await fetch(gitHubJSON);
		if (!response.ok) {
			throw new Error(`Error obteniendo las url estado: ${response.status}`);
		}
		const tunnel_urls = await response.json();
		return tunnel_urls;
	} catch (e) {
		console.error("Error : ", e);
		return null;
	}
};
