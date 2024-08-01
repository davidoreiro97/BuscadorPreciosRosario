import styles from "./searchingLocation.module.css";
import mapImageUrl from "../../../assets/img/mapa.png";
export const SearchingLocation = () => {
	return (
		<div className={styles.loaderContainer}>
			<div className={styles.imgTxtContainer}>
				<div className={styles.imgContainer}>
					<div className={styles.marcoLenteLupa}>
						<div className={styles.lenteLupa}>
							<img
								className={styles.mapaVisibleEnLupa}
								src={mapImageUrl}
								alt="mapa"
							/>
						</div>
					</div>
					<img
						className={styles.mapaFueraDeLupa}
						src={mapImageUrl}
						alt="mapa"
					/>
				</div>
				<h2 className={styles.textoSearchingLocation}>BUSCANDO UBICACION</h2>
			</div>
		</div>
	);
};
