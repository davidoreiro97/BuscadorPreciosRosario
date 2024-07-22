import { useState, useEffect, FormEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { set_nombre_producto } from "../../Redux/actions";
import { useNavigate } from "react-router-dom";
import { pathSections } from "../../types";

export const BusquedaProducto = () => {
	const [errorUbicacion, setErrorUbicacion] = useState(false);
	const [errorSupermercados, seterrorSupermercados] = useState(false);
	const [errorInput, setErrorInput] = useState(false);
	const [productoBuscado, setProductoBuscado] = useState("");
	const { latitud, longitud, supermercadosResultantes } = useSelector(
		(state: AppState) => state.GetSupermercadosCercanosReducer
	);
	useEffect(() => {
		if (latitud === null || longitud === null) {
			setErrorUbicacion(true);
		}
		if (supermercadosResultantes === null) {
			seterrorSupermercados(true);
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
		//Comprobar que el usuario escribio un producto. OK.
		if (!productoBuscado.trim()) {
			setErrorInput(true); //Por si son solo espacios
			return;
		}
		//Comprobar que haya ubicación.
		//Comprobar que hay supermercados cercanos a la ubicacion.
		if (errorUbicacion || errorSupermercados) {
			return;
		}
		dispatch(set_nombre_producto(productoBuscado));
		navigate(pathSections.resultadosBusqueda);
	};
	return (
		<article>
			{errorUbicacion && (
				<h1>OCURRIO UN ERROR CON LA UBICACION.VOLVER AL PASO 1.</h1>
			)}
			{errorSupermercados && (
				<h1>NO SE ENCONTRARON SUPERMERCADOS. VOLVER AL PASO 1.</h1>
			)}
			<button onClick={() => handleVolver()} title="VOLVER">
				<div>{"<-"}</div>
				<span>VOLVER</span>
			</button>
			<header>
				<h2>PASO 3 de 3</h2>
			</header>
			<form onSubmit={handleBuscar}>
				<label htmlFor="busquedaInput">
					Ingresa el nombre del producto que quieras buscar
				</label>
				<div>
					<input
						type="text"
						name="busqueda"
						id="busquedaInput"
						placeholder="Escriba su producto..."
						title="Ingrese un producto."
						value={productoBuscado}
						onChange={handleChangeInput}
					/>
					{errorInput && <p>Ingrese un producto</p>}
				</div>
				<button type="submit">
					<span>BUSCAR</span>
					<div>LUPA</div>
				</button>
			</form>
		</article>
	);
};
