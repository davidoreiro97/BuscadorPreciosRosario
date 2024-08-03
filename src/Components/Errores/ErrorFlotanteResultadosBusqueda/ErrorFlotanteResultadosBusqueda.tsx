import styles from "./errorFlotanteResultadosBusqueda.module.css";
export const ErrorFlotanteResultadosBusqueda = ({
	supermercadosConErrores,
	handleCerrarVentana,
}: {
	supermercadosConErrores: { supermercado: string; error: string }[];
	handleCerrarVentana: (arg: boolean) => void;
}) => {
	return (
		<div className={styles.errorContainer}>
			<h2 className={styles.errorContainer__h2}>ERRORES AL BUSCAR</h2>
			<div className={styles.erroreContainer__erroresContainer}>
				{supermercadosConErrores.map((elemento, index) => (
					<div
						key={index}
						className={styles.erroreContainer__erroresContainer__error}
					>
						<h3
							className={styles.erroreContainer__erroresContainer__error__super}
						>
							■ {elemento.supermercado}
						</h3>
						<h4
							className={styles.erroreContainer__erroresContainer__error__error}
						>
							Error : {elemento.error}
						</h4>
					</div>
				))}
			</div>
			<button
				className={styles.closeBtn}
				onClick={() => handleCerrarVentana(false)}
			>
				CERRAR
			</button>
		</div>
	);
};
