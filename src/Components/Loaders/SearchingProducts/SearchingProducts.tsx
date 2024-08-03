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
					La búsqueda puede demorar u obtener errores dependiendo de varios
					factores, como por ejemplo : <br />
					- La conexión del servidor a internet la cual es hogareña y no tan
					buena. <br />- El tiempo de respuesta de cada sitio web (Las búsquedas
					se realizan en tiempo real en cada web de cada supermercado).
					<br />
					- La dirección IP del servidor puede ser bloqueada por los
					supermercados, evitando así que se pueda realizar la búsqueda de tu
					producto en ese supermercado y obteniendo errores como "El servidor no
					pudo realizar la consulta".
					<br />
					<strong>Nota</strong> : Algúnos buscadores en las propias páginas web
					devuelven productos no relacionados con la búsqueda lo cual en esta
					versión no está en mi poder controlar.
					<br />
					En próximas versiones se planea refactorizar el backend para
					solucionar todos estos problemas y ofrecer una mejor experiencia.
				</p>
			</div>
		</div>
	);
};
