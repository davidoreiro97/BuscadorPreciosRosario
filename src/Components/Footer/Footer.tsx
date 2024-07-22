import { pathSections } from "../../types";
import styles from "./footer.module.css";
import { Link } from "react-router-dom";
export const Footer = () => {
	return (
		<footer className={styles.footerContainer}>
			<nav className={styles.footerContainer__nav}>
				<Link
					to={pathSections.como_y_donde_busqueda}
					className={styles.footerContainer__nav__p}
				>
					¿Como y donde se realiza la búsqueda?
				</Link>
				<span className={styles.footerContainer__nav__span}>
					Desarrollado por{" "}
					<a
						href="https://davidoreiro97.github.io/portfolio/"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						David Oreiro
					</a>
				</span>
			</nav>
		</footer>
	);
};
