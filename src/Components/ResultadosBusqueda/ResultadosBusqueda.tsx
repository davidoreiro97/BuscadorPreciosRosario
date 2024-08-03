import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { useNavigate } from "react-router-dom";
import postUnSupermercado from "../../Functions/postUnSupermercado";
import styles from "./resultadosBusqueda.module.css";
import { Volver } from "../Botones/Volver/Volver";
import { ErrorFlotanteNoContinuar } from "../Errores/ErrorFlotanteNoContinuar/ErrorFlotanteNoContinuar";
import { SearchingProducts } from "../Loaders/SearchingProducts/SearchingProducts";
import { ErrorFlotanteResultadosBusqueda } from "../Errores/ErrorFlotanteResultadosBusqueda/ErrorFlotanteResultadosBusqueda";

export const ResultadosBusqueda = () => {
	const [errorSeccion, setErrorSeccion] = useState(false);
	const [supermercadosConErrores, setSupermercadosConErrores] = useState<
		{ supermercado: string; error: string }[]
	>([]);
	const [
		ventanaFlotanteErroresSupermercados,
		setVentanaFlotanteErroresSupermercados,
	] = useState(false);
	const [cancelarPeticionEntera, setCancelarPeticionEntera] = useState(false);
	const [supermercadoEnConsulta, setSupermercadoEnConsulta] = useState<
		string | null
	>(null);
	const [numSupermercadoEnConsulta, setNumSupermercadoEnConsulta] =
		useState<string>("0");
	const [loader, setLoader] = useState(false);
	const [productosQuery, setProductosQuery] = useState<any[]>([]);
	const [fetchController, setFetchController] = useState<AbortController>(
		new AbortController()
	);

	const { latitud, longitud, supermercadosResultantes, productoBuscado } =
		useSelector((state: AppState) => state.GetSupermercadosCercanosReducer);

	useEffect(() => {
		setProductosQuery([]);
		if (
			latitud === null ||
			longitud === null ||
			supermercadosResultantes === null ||
			productoBuscado === null
		) {
			setErrorSeccion(true);
			return;
		}

		const enviarTodosLosSupermercados = async () => {
			setLoader(true);
			const allResults: any[] = [];
			for (const [index, supermercado] of supermercadosResultantes.entries()) {
				if (cancelarPeticionEntera) {
					fetchController.abort();
					break;
				}
				setSupermercadoEnConsulta(supermercado.nombre);
				setNumSupermercadoEnConsulta((index + 1).toString());
				try {
					let productosHallados = await postUnSupermercado(
						supermercado.nombre,
						productoBuscado,
						fetchController.signal
					);
					if (productosHallados) {
						const newResults = productosHallados.map((e: any) => ({
							nombre: e.titulo,
							precio: e.precio,
							urlImagen: e.urlImagen || "",
							urlProductoOrig: e.linkAProducto,
							supermercado: supermercado.nombre,
							ubicacionCercana: supermercado.ubicaciones[0],
							ubicacionesTodas: supermercado.ubicaciones,
						}));
						allResults.push(...newResults);
					}
				} catch (e: any) {
					setVentanaFlotanteErroresSupermercados(true);
					const errores: any = {
						"Failed to fetch": "Error al conectar con el servidor.",
						FETCH_ERROR: "El servidor no pudo realizar la búsqueda.",
						"signal is aborted without reason": "Abortado.",
						IP_BLOCKED: "IP BLOQUEADA POR EL SUPERMERCADO.",
					};
					const error = errores[e.message] || e.message;
					const supermercadoYError = {
						supermercado: supermercado.nombre,
						error: error,
					};
					setSupermercadosConErrores((prevState) => [
						...prevState,
						supermercadoYError,
					]);
				}
			}
			setProductosQuery(allResults.sort((a, b) => a.precio - b.precio));
			setLoader(false);
		};
		enviarTodosLosSupermercados();
		return () => {
			setCancelarPeticionEntera(true);
			fetchController.abort();
		};
	}, [
		productoBuscado,
		latitud,
		longitud,
		supermercadosResultantes,
		cancelarPeticionEntera,
	]);

	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(-1);
	};
	const handleCancelar = () => {
		setCancelarPeticionEntera(true);
		fetchController.abort();
	};

	return (
		<div>
			<Volver functionVolver={handleVolver} />
			{errorSeccion && (
				<ErrorFlotanteNoContinuar tituloError="Ocurrió un error con la ubicación o el producto." />
			)}
			{loader && (
				<SearchingProducts
					supermercadoEnConsulta={supermercadoEnConsulta ?? ""}
					numSupermercadoEnConsulta={numSupermercadoEnConsulta}
					totalSupermercados={supermercadosResultantes?.length.toString() ?? ""}
					handleCancelar={handleCancelar}
					producto={productoBuscado ?? ""}
				/>
			)}

			{supermercadosConErrores.length > 0 &&
				ventanaFlotanteErroresSupermercados && (
					<ErrorFlotanteResultadosBusqueda
						supermercadosConErrores={supermercadosConErrores}
						handleCerrarVentana={setVentanaFlotanteErroresSupermercados}
					/>
				)}

			<h2>ResultadosProductos</h2>
			{/* Luego irá en otro componente */}
			{productosQuery.length === 0 ? (
				<p>Sin resultados</p>
			) : (
				productosQuery.map((element, index) => (
					<div className={styles.producto} key={index}>
						<div className={styles.precioImg}>
							<h4>Precio : {element.precio}$</h4>
							<img
								className={styles.precioImg__img}
								src={element.urlImagen}
								alt={`Imagen del producto ${element.nombre}`}
							/>
						</div>
						<div className={styles.productData}>
							<h3>Producto : {element.nombre}</h3>
							<h5>Supermercado : {element.supermercado}</h5>
							{element.ubicacionCercana.distanciaHastaSupermercado !== "NO" && (
								<h5>
									Ubicacion más cercana : {element.ubicacionCercana.direccion}(
									{element.ubicacionCercana.distanciaHastaSupermercado})
								</h5>
							)}
							<div>
								<h5>
									Todas sus ubicaciones:{" "}
									{element.ubicacionesTodas.map(
										(ubicacion: any, index: number) => (
											<span key={index}>
												{ubicacion.direccion}{" "}
												{ubicacion.distanciaHastaSupermercado !== "NO" && (
													<span>({ubicacion.distanciaHastaSupermercado})</span>
												)}
												{",  "}
											</span>
										)
									)}
								</h5>
								<a target="_blank" href={element.urlProductoOrig}>
									Ver producto
								</a>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};
