export const ErrorFlotanteUbicacion = ({
	setErrorUbicacion,
}: {
	setErrorUbicacion: (estado: boolean) => void;
}) => {
	return (
		<div>
			<h2>ERROR</h2>
			<h3>NO PUDIMOS OBTENER TU UBICACION</h3>
			<p>Prueba con :</p>
			<ul>
				<li>
					Activar la ubicación desde tu dispositivo y volver a elegir la opción.
				</li>
				<li>
					En caso de seguir obteniendo este error prueba con las otras opciones.
				</li>
			</ul>
			<button
				onClick={() => {
					setErrorUbicacion(false);
				}}
			>
				CERRAR
			</button>
		</div>
	);
};
