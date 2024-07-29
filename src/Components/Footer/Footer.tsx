import styles from "./footer.module.css";
export const Footer = () => {
	return (
		<footer className={styles.footerContainer}>
			<nav className={styles.footerContainer__nav}>
				<span className={styles.footerContainer__nav__span}>
					desarrollado por :{" "}
					<a
						href="https://davidoreiro97.github.io/portfolio/"
						target="_blank"
						referrerPolicy="no-referrer"
					>
						<span className={styles.miNombre}>David Oreiro</span>
					</a>
				</span>
			</nav>
		</footer>
	);
};
