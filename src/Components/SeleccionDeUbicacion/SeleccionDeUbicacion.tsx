import { useState } from "react";
import getGeolocation from "../../Functions/getGeolocation";
import { pathSections } from "../../types";
import { Link, useNavigate } from "react-router-dom";
import { ErrorFlotanteUbicacion } from "../barrel";
import {
	set_coordenadas,
	set_supermercados_cercanos,
} from "../../Redux/actions";
import { useDispatch } from "react-redux";
import { coordenadas } from "../../types";
import checkRosarioLocation from "../../Functions/checkRosarioLocation";
import buscarSupermercadosCercanos from "../../Functions/getSupermercadosCercanos";

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
			// VOLVER A HABILITAR AL TERMINAR.
			if (precision > 100) {
				alert(
					"NO SE PUEDE DETERMINAR TU UBICACION EXACTA, INTENTA : -ENCONTRAR MEJOR CONEXION A INTERNET O SEÑAL -INGRESAR LA DIRECCION EN LA SEGUNDA OPCION."
				);
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
		<article>
			<header>
				<h2>PASO 1 de 3</h2>
			</header>
			<p>
				Selecciona <strong>una ubicacion</strong> para que busquemos en
				supermercados cercanos.
			</p>
			<div>
				<button onClick={() => handleCercanosAMiUbicacion()}>
					Mi ubicación actual
				</button>
				<Link to={pathSections.cercanos_a_una_direccion}>
					Ingresar una ubicación
				</Link>
				<button onClick={() => handleTodaLaCiudad()}>
					Toda la ciudad de Rosario
				</button>
			</div>
			<aside>
				NOTA : La opción "Mi ubicación actual" depende de tu conexión a internet
				y de tu dispositivo. Si no se puede determinar, utiliza la segunda
				opción.
			</aside>
			{errorUbicacion && (
				<ErrorFlotanteUbicacion setErrorUbicacion={setErrorUbicacion} />
			)}
		</article>
	);
};
