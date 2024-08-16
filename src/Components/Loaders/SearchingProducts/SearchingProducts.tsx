import styles from "./searchingProducts.module.css";
type SearchingProductsPropTypes = {
	supermercadoEnConsulta: string;
	numSupermercadoEnConsulta: string;
	totalSupermercados: string;
	handleCancelar: () => void;
	producto: string;
};
export const SearchingProducts = ({
	supermercadoEnConsulta,
	numSupermercadoEnConsulta,
	totalSupermercados,
	handleCancelar,
	producto,
}: SearchingProductsPropTypes) => {
	return (
		<div className={styles.loaderContainer}>
			<h2 className={styles.loaderContainer__topText}>
				Buscando{" "}
				<span className={styles.loaderContainer__topText__producto}>
					{producto}
				</span>
				<br /> en {supermercadoEnConsulta}
			</h2>
			<div>
				<span className={styles.loaderImg}></span>
			</div>
			<p className={styles.loaderContainer__bottomText}>
				Supermercado {numSupermercadoEnConsulta} de {totalSupermercados}
			</p>
			<button
				className={styles.loaderContainer__cancelBtn}
				onClick={handleCancelar}
			>
				CANCELAR
			</button>
			<div className={styles.infoContainer}>
				<h4 className={styles.infoContainer__titulo}>Información</h4>
				<p className={styles.infoContainer__text}>
					<strong>Importante:</strong> Algunos buscadores de los propios sitios
					web de los supermercados tienen mal programadas sus búsquedas y
					devuelven resultados incoherentes, lo cual no está en mi poder
					controlar en esta versión.
					<br />
					En próximas versiones se planea mejorar mucho la velocidad de la
					búsqueda y la precisión de los resultados.
					<br />
					¡Saludos!
				</p>
			</div>
		</div>
	);
};
