import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { set_supermercados_cercanos } from "../../Redux/actions";
import { pathSections } from "../../types";
import { useNavigate } from "react-router-dom";
import buscarSupermercadosCercanos from "../../Functions/getSupermercadosCercanos";
import styles from "./cercanosAMiUbicacion.module.css";
import { ErrorFlotante } from "../barrel";
import { ErrorFlotanteNoContinuar } from "../Errores/ErrorFlotanteNoContinuar/ErrorFlotanteNoContinuar";
import { Volver } from "../Botones/Volver/Volver";

export const CercanosAMiUbicacion = () => {
	const [errorUbicacion, setErrorUbicacion] = useState(false);
	const [errorSupermercadosCercanos, setErrorSupermercadosCercanos] =
		useState(false);

	const dispatch = useDispatch();
	//Recuperar la latitud y longitud por si el usuario accede directamente a esta ruta.
	const { latitud, longitud } = useSelector(
		(state: AppState) => state.GetSupermercadosCercanosReducer
	);
	useEffect(() => {
		if (latitud === null || longitud === null) {
			setErrorUbicacion(true);
		}
	}, []);

	const navigate = useNavigate();
	const handleSelectRadius = async (radioBusqueda: number) => {
		//Comprobar si existen supermercados cercanos, caso contrario no pasar a la busqueda.
		if (errorUbicacion) {
			return;
		}
		if (latitud && longitud && radioBusqueda > 0) {
			let supermercados = await buscarSupermercadosCercanos(
				latitud,
				longitud,
				radioBusqueda
			);
			if (supermercados.length === 0) {
				setErrorSupermercadosCercanos(true);
				return;
			}
			dispatch(set_supermercados_cercanos(supermercados));
			navigate(pathSections.busqueda_producto);
		}
	};
	const handleVolver = () => {
		navigate(pathSections.seleccion_de_ubicacion);
	};
	return (
		<article className={styles.cercanosAMiUbicacionContainer}>
			<Volver functionVolver={handleVolver} />
			<header className={styles.cercanosAMiUbicacionContainer__header}>
				<h2 className={styles.cercanosAMiUbicacionContainer__header__h2}>
					PASO 2 de 3
				</h2>
			</header>
			<p className={styles.cercanosAMiUbicacionContainer__p}>
				Selecciona la <strong>distancia hasta donde queres buscar</strong>{" "}
				supermercados.
			</p>
			<div className={styles.cercanosAMiUbicacionContainer__optContainer}>
				<button
					className="optionYellowBtn"
					onClick={() => handleSelectRadius(1)}
				>
					Hasta 10 Cuadras desde donde estoy
				</button>
				<button
					className="optionYellowBtn"
					onClick={() => handleSelectRadius(2)}
				>
					Hasta 20 Cuadras desde donde estoy
				</button>
				<button
					className="optionYellowBtn"
					onClick={() => handleSelectRadius(3)}
				>
					Hasta 30 Cuadras desde donde estoy
				</button>
				<button
					className="optionYellowBtn"
					onClick={() => handleSelectRadius(4)}
				>
					Hasta 40 Cuadras desde donde estoy
				</button>
			</div>
			<aside className="asideNota"> Nota : 10 cuadras son aprox 1 Km.</aside>
			{errorUbicacion && (
				<ErrorFlotanteNoContinuar tituloError="ERROR RECUPERANDO LA UBICACION" />
			)}
			{errorSupermercadosCercanos && (
				<ErrorFlotante
					setError={setErrorSupermercadosCercanos}
					tituloError="NO HAY SUPERMERCADOS CERCANOS A TU UBICACION"
					posiblesSoluciones={[
						"Aumentar la distancia de busqueda.",
						"Elegir otra ubicación.",
					]}
				/>
			)}
		</article>
	);
};
