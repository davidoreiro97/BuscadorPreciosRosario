import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { set_supermercados_cercanos } from "../../Redux/actions";
import { pathSections } from "../../types";
import { useNavigate } from "react-router-dom";
import buscarSupermercadosCercanos from "../../Functions/getSupermercadosCercanos";

export const CercanosAMiUbicacion = () => {
	const [error, setError] = useState(false);
	const dispatch = useDispatch();
	//Recuperar la latitud y longitud por si el usuario accede directamente a esta ruta.
	const { latitud, longitud } = useSelector(
		(state: AppState) => state.GetSupermercadosCercanosReducer
	);
	useEffect(() => {
		if (latitud === null || longitud === null) {
			setError(true);
		}
	}, []);

	const navigate = useNavigate();
	const handleSelectRadius = async (radioBusqueda: number) => {
		//Comprobar si existen supermercados cercanos, caso contrario no pasar a la busqueda.
		if (error) {
			return;
		}
		if (latitud && longitud && radioBusqueda > 0) {
			let supermercados = await buscarSupermercadosCercanos(
				latitud,
				longitud,
				radioBusqueda
			);
			if (supermercados.length === 0) {
				alert(
					"NO SE ENCONTRARON SUPERMERCADOS CERCANOS. PRUEBA : BUSCANDO A MAS CUADRAS DE DISTANCIA."
				);
				return;
			}
			dispatch(set_supermercados_cercanos(supermercados));
			navigate(pathSections.busqueda_producto);
		}
	};
	const handleVolver = () => {
		navigate(-1);
	};
	return (
		<article>
			<h1>
				{error && "ERROR RECUPERANDO LA UBICACION, VOLVER AL PASO ANTERIOR"}
			</h1>
			<button title="VOLVER" onClick={() => handleVolver()}>
				<div>{"<-"}</div>
				<span>VOLVER</span>
			</button>
			<header>
				<h2>PASO 2 de 3</h2>
			</header>
			<p>
				Selecciona la <strong>distancia hasta donde queres buscar</strong>{" "}
				supermercados.
			</p>
			<div>
				<button onClick={() => handleSelectRadius(1)}>
					Hasta 10 Cuadras desde donde estoy
				</button>
				<button onClick={() => handleSelectRadius(2)}>
					Hasta 20 Cuadras desde donde estoy
				</button>
				<button onClick={() => handleSelectRadius(3)}>
					Hasta 30 Cuadras desde donde estoy
				</button>
				<button onClick={() => handleSelectRadius(4)}>
					Hasta 40 Cuadras desde donde estoy
				</button>
			</div>
			<aside>Nota : 10 cuadras son aprox 1 Km.</aside>
		</article>
	);
};
