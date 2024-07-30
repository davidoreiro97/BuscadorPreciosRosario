import styles from "./volver.module.css";
import { FlechaSigAtr } from "../../svgIcons/SvgIcons";
export const Volver = ({ functionVolver }: { functionVolver: () => void }) => {
	return (
		<button
			title="VOLVER"
			onClick={() => {
				functionVolver();
			}}
			className="volverBtn absoluteTopLeft"
		>
			<div className={styles.flechaContainerBtn}>
				<FlechaSigAtr width={36} height={36} className="flecha_sig" />
			</div>
			<span className={styles.textoBtn}>VOLVER</span>
		</button>
	);
};
