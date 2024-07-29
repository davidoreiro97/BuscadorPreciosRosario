import styles from "./errorFlotante.module.css";
import errorImg from "../../../assets/img/errorImg.png";
import { FlechaSigAtr } from "../../svgIcons/SvgIcons";
export const ErrorFlotante = ({
	setError,
	tituloError,
	posiblesSoluciones,
}: {
	setError: (estado: boolean) => void;
	tituloError: string;
	posiblesSoluciones: string[];
}) => {
	return (
		<div className={styles.errorContainer}>
			<div className={styles.errorContainer__imgh2Ctn}>
				<img
					className={styles.errorContainer__img}
					src={errorImg}
					alt="Icono de error"
				/>
				<h2 className={styles.errorContainer__h2}>ERROR</h2>
			</div>

			<h3 className={styles.errorContainer__tituloError}>{tituloError}</h3>
			<div className={styles.errorContainer__pYulContainer}>
				<p className={styles.errorContainer__p}>Prueba</p>
				<ul className={styles.errorContainer__ul}>
					{posiblesSoluciones.map((solucion, index) => (
						<li key={index} className={styles.errorContainer__li}>
							# {solucion}
						</li>
					))}
				</ul>
			</div>
			<button
				onClick={() => {
					setError(false);
				}}
				className="volverBtn"
			>
				<div className={styles.errorContainer__flechaContainer}>
					<FlechaSigAtr width={42} height={42} className="flecha_sig" />
				</div>
				<span>VOLVER</span>
			</button>
		</div>
	);
};
