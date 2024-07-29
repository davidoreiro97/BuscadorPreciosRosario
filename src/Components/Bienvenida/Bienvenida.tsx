import { Link } from "react-router-dom";
import { pathSections } from "../../types";
import styles from "./bienvenida.module.css";
import { FlechaSigAtr } from "../svgIcons/SvgIcons";
export const Bienvenida = () => {
	return (
		<article className={styles.welcomeContainer}>
			<header className={styles.welcomeContainer__header}>
				<h1 className={styles.welcomeContainer__header__h1}>
					Encontrá los productos al mejor precio en la ciudad de Rosario, Santa
					Fe, Argentina.
				</h1>
			</header>
			<h2 className={styles.welcomeContainer__h2}>
				En 3 sencilos pasos podrás encontrar productos de todos los
				supermercados cercanos a cualquier ubicación dentro de la ciudad de
				Rosario.
			</h2>

			<Link
				className={styles.welcomeContainer__comenzarBtn}
				to={pathSections.seleccion_de_ubicacion}
			>
				<span>COMENZAR</span>
				<div className={styles.welcomeContainer__comenzarBtn__flechaContainer}>
					<FlechaSigAtr width={42} height={42} className="flecha_sig" />
				</div>
			</Link>
		</article>
	);
};
