import { useState, useEffect, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { set_nombre_producto } from "../../Redux/actions";
import { useNavigate } from "react-router-dom";
import { pathSections } from "../../types";
import { ErrorFlotanteNoContinuar } from "../Errores/ErrorFlotanteNoContinuar/ErrorFlotanteNoContinuar";
import { Volver } from "../Botones/Volver/Volver";
import styles from "./busquedaProducto.module.css";
import urlLupa from "../../assets/img/lupa.png";
export const BusquedaProducto = () => {
	const [errorSeccion, setErrorSeccion] = useState(false);

	const [errorInput, setErrorInput] = useState(false);
	const [productoBuscado, setProductoBuscado] = useState("");
	const { latitud, longitud, supermercadosResultantes } = useSelector(
		(state: AppState) => state.GetSupermercadosCercanosReducer
	);

	useEffect(() => {
		if (latitud === null || longitud === null) {
			setErrorSeccion(true);
		}
		if (supermercadosResultantes === null) {
			setErrorSeccion(true);
		}
	}, []);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleVolver = () => {
		navigate(-1);
	};
	const handleChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		setProductoBuscado(event.target.value);
		setErrorInput(false); //Para cuando el usuario escriba.
	};
	const handleBuscar = (e: FormEvent) => {
		e.preventDefault();
		if (!productoBuscado.trim()) {
			setErrorInput(true);
			return;
		}
		if (errorSeccion) {
			return;
		}
		dispatch(set_nombre_producto(productoBuscado));
		navigate(pathSections.resultadosBusqueda);
	};
	return (
		<article className={styles.busquedaProducto}>
			{errorSeccion && (
				<ErrorFlotanteNoContinuar tituloError="OCURRIO UN ERROR CON LA UBICACION-SUPERMERCADOS" />
			)}
			<Volver functionVolver={handleVolver} />
			<header className={styles.busquedaProducto__header}>
				<h2 className={styles.busquedaProducto__header__h2}>PASO 3 de 3</h2>
			</header>
			<form onSubmit={handleBuscar}>
				<label htmlFor="busquedaInput" className={styles.busquedaProducto__p}>
					Ingresa el nombre del producto que quieras buscar
				</label>
				<div className={styles.searchInputContainer}>
					<input
						className={styles.searchInputContainer__input}
						type="text"
						name="busqueda"
						id="busquedaInput"
						placeholder="Escriba su producto..."
						title="Ingrese un producto."
						value={productoBuscado}
						onChange={handleChangeInput}
					/>
					{errorInput && (
						<p className={styles.searchInputContainer__errorMsg}>
							Ingrese un producto
						</p>
					)}
				</div>
				<button
					type="submit"
					className={`${styles.searchButton} optionYellowBtn`}
				>
					<span>BUSCAR</span>
					<img className={styles.lupaIcono} src={urlLupa} alt="LupaIcono" />
				</button>
			</form>
		</article>
	);
};
