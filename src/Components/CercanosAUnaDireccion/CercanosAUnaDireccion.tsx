import { FormEvent, useState, useRef } from "react";
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
import styles from "./cercanosAUnaDireccion.module.css";
import { Volver } from "../Botones/Volver/Volver";
import { ErrorFlotante } from "../barrel";
import { SearchingLocation } from "../Loaders/SearchingLocation/SearchingLocation";

export const CercanosAUnaDireccion = () => {
	const [errorMSG, setErrorMSG] = useState("");
	const [errorSoluciones, setErrorSoluciones] = useState<string[]>([""]);
	const [errorSeccion, setErrorSeccion] = useState(false);
	const [errorEnter, setErrorEnter] = useState(false);
	const [loader, setLoader] = useState(false);
	const [radioBusqueda, setRadioBusqueda] = useState(0);
	const [ubicacionInput, setUbicacionInput] = useState("");
	const [errorInput, setErrorInput] = useState(false);
	const [mensajeDireccion, setMensajeDireccion] = useState(false);
	const [direccionText, setDireccionText] = useState("");
	const [latitudLocal, setLatitudLocal] = useState<number | null>(null);
	const [longitudLocal, setLongitudLocal] = useState<number | null>(null);
	const dispatch = useDispatch();
	const horarioUltimoFetch = useRef<number>(0);
	const tiempo_espera_fetch = 6200; //En ms

	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(pathSections.seleccion_de_ubicacion);
	};

	const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setUbicacionInput(event.target.value);
		setErrorInput(false);
	};

	const handleRadioBusqueda = (radio: number) => {
		setRadioBusqueda(radio);
	};

	const handleDeterminarUbicacion = async (e: FormEvent) => {
		e.preventDefault();
		if (!ubicacionInput.trim()) {
			setErrorInput(true);
			return;
		}
		if (radioBusqueda === 0) {
			setErrorEnter(true);
			return;
		}
		const horaActual = Date.now();
		if (horaActual - horarioUltimoFetch.current < tiempo_espera_fetch) {
			//Para evitar que se hagan solicitudes continuas en el front, en el backend tiene
			setErrorMSG("Muchas solicitudes seguidas.");
			setErrorSoluciones(["Espere 10 segundos y vuelva a intentar."]);
			setErrorSeccion(true);
			return;
		}
		horarioUltimoFetch.current = horaActual;

		try {
			setLoader(true);
			const result = await getCoordinates(ubicacionInput);
			const { latitud, longitud, direccion } = result;
			setLoader(false);
			setMensajeDireccion(true);
			setDireccionText(direccion);
			setLatitudLocal(latitud);
			setLongitudLocal(longitud);
		} catch (error: any) {
			setLoader(false);
			if (error.message === "ADDRESS_NOT_FOUND") {
				setErrorMSG(
					"NO SE ENCONTRARON RESULTADOS PARA LA DIRECCION INGRESADA."
				);
				setErrorSoluciones(["Ingresar otra ubicación."]);
				setErrorSeccion(true);
			} else if (error.message === "INVALID_DATA") {
				setErrorMSG("EL SERVIDOR RECIBIO UN TIPO DE DATO NO ESPERADO.");
				setErrorSoluciones(["Reingresar la ubicación."]);
				setErrorSeccion(true);
			} else if (error.message === "API_ERROR") {
				setErrorMSG("ERROR REALIZANDO LA PETICION A GEOCODE.");
				setErrorSoluciones([
					"Reintentar por si el servidor tuvo un fallo momentaneo.",
					"Elegir la opción de toda la ciudad.",
				]);
				setErrorSeccion(true);
			} else if (error.message === "RATE_LIMIT") {
				setErrorMSG("Muchas solicitudes seguidas.");
				setErrorSoluciones(["Espere 10 segundos y vuelva a intentar."]);
				setErrorSeccion(true);
			} else if (error.message === "UNKNOWN_ERROR") {
				setErrorMSG("ERROR DESCONOCIDO.");
				setErrorSoluciones(["Ingresar a otra opción."]);
				setErrorSeccion(true);
			} else {
				setErrorMSG("NO SE PUDO CONECTAR CON EL SERVIDOR.");
				setErrorSoluciones([
					"Revise su conexión a internet.",
					"En caso que el error sea el servidor intentar de nuevo.",
				]);
				setErrorSeccion(true);
			}
		} finally {
			setLoader(false);
		}
	};

	const confirmarUsuario = async (respuesta: boolean) => {
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
						setErrorMSG("SIN SUPERMERCADOS CERCANOS.");
						setErrorSoluciones([
							"Buscar a más cuadras de distancia.",
							"Ingresar otra dirección",
						]);
						setErrorSeccion(true);
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
		<article className={styles.cercanosAUnaDireccionContainer}>
			{mensajeDireccion && direccionText && (
				<div className={styles.confirmacionContainer}>
					<h3 className={styles.confirmacionContainer__h3}>
						La direccion ingresada fue : <br />{" "}
						<span className={styles.confirmacionContainer__h3_direccion}>
							{direccionText}
						</span>
						?
					</h3>
					<div className={styles.confirmacionContainer__btnsContainer}>
						<button
							className={`${styles.confirmacionContainer__btnsContainer__btn} ${styles.confirmacionContainer__btnsContainer__btn__cancel}`}
							onClick={() => confirmarUsuario(false)}
						>
							NO
						</button>
						<button
							className={styles.confirmacionContainer__btnsContainer__btn}
							onClick={() => confirmarUsuario(true)}
						>
							SI
						</button>
					</div>
				</div>
			)}
			{errorMSG && errorSeccion && (
				<ErrorFlotante
					setError={setErrorSeccion}
					tituloError={errorMSG}
					posiblesSoluciones={errorSoluciones}
				/>
			)}
			{loader && <SearchingLocation />}
			<Volver functionVolver={handleVolver} />
			<header className={styles.cercanosAUnaDireccionContainer__header}>
				<h2 className={styles.cercanosAUnaDireccionContainer__header__h2}>
					PASO 2 de 3
				</h2>
			</header>
			<p className={styles.cercanosAUnaDireccionContainer__p}>
				<strong>
					Ingresa la ubicación (<u>solo calle y altura</u>) y después elegí la
					distancia
				</strong>{" "}
				hasta donde querés buscar supermercados a partir de dicha ubicación.
			</p>

			<form onSubmit={handleDeterminarUbicacion}>
				<div className={styles.searchInputContainer}>
					<input
						className={styles.searchInputContainer__input}
						type="text"
						name="ubicacion"
						id="ubicacion"
						placeholder="Escriba la ubicación..."
						value={ubicacionInput}
						onChange={handleChangeInput}
					/>
					{errorInput && (
						<span className={styles.searchInputContainer__errorMsg}>
							Ingrese una ubicación válida
						</span>
					)}
					{errorEnter && (
						<span className={styles.searchInputContainer__errorMsg}>
							Seleccione un radio de búsqueda.
						</span>
					)}
				</div>
				<div className={styles.cercanosAUnaDireccionContainer__optContainer}>
					<button
						type="submit"
						className="optionYellowBtn"
						onClick={() => handleRadioBusqueda(1)}
					>
						Hasta 10 Cuadras desde la ubicación
					</button>
					<button
						type="submit"
						className="optionYellowBtn"
						onClick={() => handleRadioBusqueda(2)}
					>
						Hasta 20 Cuadras desde la ubicación
					</button>
					<button
						type="submit"
						className="optionYellowBtn"
						onClick={() => handleRadioBusqueda(3)}
					>
						Hasta 30 Cuadras desde la ubicación
					</button>
					<button
						type="submit"
						className="optionYellowBtn"
						onClick={() => handleRadioBusqueda(4)}
					>
						Hasta 40 Cuadras desde la ubicación
					</button>
				</div>
			</form>
			<aside className="asideNota">Nota: 10 cuadras son aprox 1 Km.</aside>
		</article>
	);
};
