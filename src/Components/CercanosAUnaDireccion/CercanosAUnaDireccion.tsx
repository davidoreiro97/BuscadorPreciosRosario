import { FormEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { pathSections } from "../../types";
import getCoordinates from "../../Functions/getCoordinates";
import checkRosarioLocation from "../../Functions/checkRosarioLocation";
import buscarSupermercadosCercanos from "../../Functions/getSupermercadosCercanos";
import {
	set_coordenadas,
	set_supermercados_cercanos,
} from "../../Redux/actions";

export const CercanosAUnaDireccion = () => {
	const [errorMSG, setErrorMSG] = useState(false); //Esto se envía junto con el mensaje a un componente que será una ventana flotante de error.
	const [radioBusqueda, setRadioBusqueda] = useState(0);
	const [ubicacionInput, setUbicacionInput] = useState("");
	const [errorInput, setErrorInput] = useState(false);
	const [mensajeDireccion, setMensajeDireccion] = useState(false);
	const [direccionText, setDireccionText] = useState("");
	const [latitudLocal, setLatitudLocal] = useState<number | null>(null);
	const [longitudLocal, setLongitudLocal] = useState<number | null>(null);
	const dispatch = useDispatch();
	const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUbicacionInput(event.target.value);
		setErrorInput(false); //Para cuando el usuario escriba.
	};

	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(-1);
	};

	const handleDeterminarUbicacion = async (e: FormEvent) => {
		e.preventDefault();
		if (!ubicacionInput.trim()) {
			setErrorInput(true); //Por si son solo espacios
			return;
		}
		try {
			//Implementar un loader para lo que tarda el getCoordinates que bloquee la pantalla.
			const result = await getCoordinates(ubicacionInput);
			const { latitud, longitud, direccion } = result;
			setMensajeDireccion(true);
			setDireccionText(direccion);
			setLatitudLocal(latitud);
			setLongitudLocal(longitud);
		} catch (error: any) {
			//Llega el errorType de getCoordinates como message a este punto.
			if (error.message === "ADDRESS_NOT_FOUND") {
				//Si la api de geolocalización de geocode no encuentra la dirección ingresada.
				alert("NO SE ENCONTRARON RESULTADOS PARA LA DIRECCION INGRESADA.");
				return;
			}
			if (error.message === "INVALID_DATA") {
				//Si se hace una solicitud post con un tipo dato distinto a string.
				alert("EL SERVIDOR RECIBIO UN TIPO DE DATO NO ESPERADO.");
				return;
			}
			if (error.message === "API_ERROR") {
				//Si no se puede hacer fetch a geocode.
				alert("ERROR REALIZANDO LA PETICION A GEOCODE.");
				return;
			}
			if (error.message === "UNKNOWN_ERROR") {
				//Tipo de error desconocido.
				alert("ERROR DESCONOCIDO.");
				return;
			}
			alert("No se pudo conectar con el endpoint de coordenadas.");
		}
	};

	const confirmarUsuario = async (respuesta: boolean) => {
		//Abre una ventana para que el usuario confirme la dirección que ingresó, en caso que el servicio detecte otra.
		setMensajeDireccion(false);
		if (respuesta) {
			if (latitudLocal !== null && longitudLocal !== null) {
				const coordenadas = { latitud: latitudLocal, longitud: longitudLocal };
				if (checkRosarioLocation(coordenadas)) {
					let supermercados = await buscarSupermercadosCercanos(
						latitudLocal,
						longitudLocal,
						radioBusqueda
					);
					if (supermercados.length === 0) {
						alert(
							"NO SE ENCONTRARON SUPERMERCADOS CERCANOS. PRUEBA : BUSCANDO A MAS CUADRAS DE DISTANCIA."
						);
					} else {
						dispatch(set_coordenadas(coordenadas));
						dispatch(set_supermercados_cercanos(supermercados));
						navigate(pathSections.busqueda_producto);
					}
				} else {
					alert("NO ES UNA DIRECCION DENTRO DE ROSARIO, SANTA FE, ARGENTINA.");
				}
			}
		}
	};

	return (
		<article>
			{mensajeDireccion && direccionText && (
				<div>
					<h3>{`La dirección ingresada es : ${direccionText} ?`}</h3>
					<button onClick={() => confirmarUsuario(true)}>SI</button>
					<button onClick={() => confirmarUsuario(false)}>NO</button>
				</div>
			)}
			<button title="VOLVER" onClick={() => handleVolver()}>
				<div>{"<-"}</div>
				<span>VOLVER</span>
			</button>
			<header>
				<h2>PASO 2 de 3</h2>
			</header>
			<p>
				<strong>Ingresa la ubicación y después elegí la distancia</strong> hasta
				donde querés buscar supermercados a partir de dicha ubicación.
			</p>
			<span>
				<div>IMPORTANTE</div>
				<p>
					Escribir la ubicación solo con calle y altura, por ejemplo: Zeballos
					812
				</p>
			</span>
			<form onSubmit={handleDeterminarUbicacion}>
				<input
					type="text"
					name="ubicacion"
					id="ubicacion"
					placeholder="Escriba la ubicación..."
					value={ubicacionInput}
					onChange={handleChangeInput}
				/>
				{errorInput && <span>Ingrese una ubicación válida</span>}
				<div>
					<button type="submit" onClick={() => setRadioBusqueda(1)}>
						Hasta 10 Cuadras desde la ubicación
					</button>
					<button type="submit" onClick={() => setRadioBusqueda(2)}>
						Hasta 20 Cuadras desde la ubicación
					</button>
					<button type="submit" onClick={() => setRadioBusqueda(3)}>
						Hasta 30 Cuadras desde la ubicación
					</button>
					<button type="submit" onClick={() => setRadioBusqueda(4)}>
						Hasta 40 Cuadras desde la ubicación
					</button>
				</div>
			</form>
			<aside>Nota: 10 cuadras son aprox 1 Km.</aside>
		</article>
	);
};
