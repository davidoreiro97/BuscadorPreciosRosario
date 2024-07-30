import styles from "./ErrorFlotanteNoContinuar.module.css";
import errorImg from "../../../assets/img/errorImg.png";
import { FlechaSigAtr } from "../../svgIcons/SvgIcons";
import { useNavigate } from "react-router-dom";
import { pathSections } from "../../../types";
export const ErrorFlotanteNoContinuar = ({
	tituloError,
}: {
	tituloError: string;
}) => {
	const navigate = useNavigate();
	const volverInicio = () => {
		navigate(pathSections.seleccion_de_ubicacion);
	};
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
			<button
				onClick={() => {
					volverInicio();
				}}
				className="volverBtn"
			>
				<div className={styles.errorContainer__flechaContainer}>
					<FlechaSigAtr width={42} height={42} className="flecha_sig" />
				</div>
				<span className={styles.errorContainer__volverBtnText}>VOLVER</span>
			</button>
		</div>
	);
};
