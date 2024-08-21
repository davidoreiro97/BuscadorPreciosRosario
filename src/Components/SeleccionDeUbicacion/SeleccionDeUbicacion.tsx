import { useState } from "react";
import getGeolocation from "../../Functions/getGeolocation";
import { pathSections } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import { ErrorFlotante } from "../barrel";
import {
	set_coordenadas,
	set_supermercados_cercanos,
} from "../../Redux/actions";
import { useDispatch } from "react-redux";
import { coordenadas } from "../../types";
import checkRosarioLocation from "../../Functions/checkRosarioLocation";
import buscarSupermercadosCercanos from "../../Functions/getSupermercadosCercanos";
import styles from "./seleccionDeUbicacion.module.css";
export const SeleccionDeUbicacion = () => {
	const navigate = useNavigate();
	const [errorUbicacion, setErrorUbicacion] = useState(false);
	const [errorPresicionBaja, setErrorPresicionBaja] = useState(false);
	const [errorFueraRosario, setErrorFueraRosario] = useState(false);
	const dispatch = useDispatch();
	const handleCercanosAMiUbicacion = async () => {
		try {
			const { latitud, longitud, precision } = await getGeolocation();
			const coordenadas: coordenadas = { latitud, longitud };
			if (precision > 100) {
				setErrorPresicionBaja(true);
				return;
			}
			if (checkRosarioLocation(coordenadas)) {
				dispatch(set_coordenadas(coordenadas));
				navigate(pathSections.cercanos_a_mi_ubicacion);
			} else {
				alert("TE ENCUENTRAS FUERA DE LA CIUDAD DE ROSARIO.");
				setErrorFueraRosario(true);
			}
		} catch (error) {
			setErrorUbicacion(true);
		}
	};

	const handleTodaLaCiudad = async () => {
		//Cargar todos los supermercados, latitud -200, longitud -200
		let coordenadas = { latitud: -200, longitud: -200 };
		dispatch(set_coordenadas(coordenadas));
		let supermercados = await buscarSupermercadosCercanos(-200, -200, 0, true);
		dispatch(set_supermercados_cercanos(supermercados));
		navigate(pathSections.busqueda_producto);
	};

	return (
		<article className={styles.seleccionUbicacionContainer}>
			<header className={styles.seleccionUbicacionContainer__header}>
				<h2 className={styles.seleccionUbicacionContainer__header__h2}>
					PASO 1 de 3
				</h2>
			</header>
			<p className={styles.seleccionUbicacionContainer__p}>
				Selecciona <strong>una ubicación</strong> para que busquemos en
				supermercados cercanos.
			</p>
			<div className={styles.seleccionUbicacionContainer__optContainer}>
				<button
					className="optionYellowBtn"
					onClick={() => handleCercanosAMiUbicacion()}
				>
					Mi ubicación actual
				</button>
				<Link
					className="optionYellowBtn"
					to={pathSections.cercanos_a_una_direccion}
				>
					Ingresar una ubicación
				</Link>
				<button
					className="optionYellowBtn"
					onClick={() => handleTodaLaCiudad()}
				>
					Toda la ciudad de Rosario
				</button>
			</div>
			{errorUbicacion && (
				<ErrorFlotante
					setError={setErrorUbicacion}
					tituloError="NO PUDIMOS DETECTAR TU UBICACION"
					posiblesSoluciones={[
						"Activar la ubicación desde tu dispositivo y volver a elegir la opción.",
						"En caso de seguir obteniendo este error prueba con las otras opciones.",
					]}
				/>
			)}
			{errorPresicionBaja && (
				<ErrorFlotante
					setError={setErrorPresicionBaja}
					tituloError="NO SE PUEDE DETERMINAR TU UBICACION EXACTA"
					posiblesSoluciones={[
						"Mejorar tu conexión a internet.",
						"Ingresar directamente la dirección en la segunda opción.",
					]}
				/>
			)}
			{errorFueraRosario && (
				<ErrorFlotante
					setError={setErrorFueraRosario}
					tituloError="TE ENCUENTRAS FUERA DE LA CIUDAD DE ROSARIO"
					posiblesSoluciones={[
						"Ingresando la dirección en la opción 2.",
						"Acercandote más a la ciudad de Rosario.",
					]}
				/>
			)}
		</article>
	);
};
