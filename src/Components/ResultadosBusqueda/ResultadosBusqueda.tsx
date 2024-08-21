import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { useNavigate } from "react-router-dom";
import postUnSupermercado from "../../Functions/postUnSupermercado";
import styles from "./resultadosBusqueda.module.css";
import { Volver } from "../Botones/Volver/Volver";
import { ErrorFlotanteNoContinuar } from "../Errores/ErrorFlotanteNoContinuar/ErrorFlotanteNoContinuar";
import { SearchingProducts } from "../Loaders/SearchingProducts/SearchingProducts";
import { ErrorFlotanteResultadosBusqueda } from "../Errores/ErrorFlotanteResultadosBusqueda/ErrorFlotanteResultadosBusqueda";
import { Productos } from "./Productos/Productos";

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
	// const [fetchController, setFetchController] = useState<AbortController>(
	// 	new AbortController()
	// );
	const fetchController = new AbortController();
	const { latitud, longitud, supermercadosResultantes, productoBuscado } =
		useSelector((state: AppState) => state.GetSupermercadosCercanosReducer);
	const [orderByOptionSelected, setOrderByOptionSelected] = useState("price");
	const [menuOrderByOpen, setMenuOrderByOpen] = useState(false);
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
	useEffect(() => {
		//Para cerrar el menú flotante de las opciones de ordenado
		const handleClickOutside = (event: MouseEvent) => {
			if (
				orderByRef.current &&
				!orderByRef.current.contains(event.target as Node)
			) {
				setMenuOrderByOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);
	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(-1);
	};
	const handleCancelar = () => {
		setCancelarPeticionEntera(true);
		fetchController.abort();
	};
	const orderByPrice = () => {
		let productos = [...productosQuery];
		if (productos) {
			productos.sort((a, b) => a.precio - b.precio);
			setProductosQuery(productos);
			setMenuOrderByOpen(false);
			setOrderByOptionSelected("price");
		}
	};
	const orderByClosest = () => {
		let productos = [...productosQuery];
		if (productos) {
			productos.sort(
				(a, b) =>
					a.ubicacionCercana.distanciaHastaSupermercado -
					b.ubicacionCercana.distanciaHastaSupermercado
			);
			setMenuOrderByOpen(false);
			setOrderByOptionSelected("closest");
			setProductosQuery(productos);
		}
	};
	const orderByAlphabet = () => {
		let productos = [...productosQuery];
		if (productos) {
			productos.sort(
				(a, b) =>
					a.ubicacionCercana.distanciaHastaSupermercado -
					b.ubicacionCercana.distanciaHastaSupermercado
			);
			productos.sort((a, b) =>
				a.nombre.localeCompare(b.nombre, undefined, { sensitivity: "base" })
			);
			setMenuOrderByOpen(false);
			setOrderByOptionSelected("alphabet");
			setProductosQuery(productos);
		}
	};
	const orderByMarket = () => {
		let productos = [...productosQuery];
		if (productos) {
			productos.sort(
				(a, b) =>
					a.ubicacionCercana.distanciaHastaSupermercado -
					b.ubicacionCercana.distanciaHastaSupermercado
			);
			productos.sort((a, b) =>
				a.supermercado.localeCompare(b.supermercado, undefined, {
					sensitivity: "base",
				})
			);
			setMenuOrderByOpen(false);
			setOrderByOptionSelected("market");
			setProductosQuery(productos);
		}
	};
	const handleAbrirOrderBy = () => {
		setMenuOrderByOpen((prevState) => !prevState);
	};
	const orderByRef = useRef<HTMLDivElement>(null);
	return (
		<div className={styles.resultadoBusquedaProducto}>
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
			<div className={styles.sectionContainer}>
				<h2 className={styles.resultadosPara}>
					Resultados para{" "}
					<span className={styles.productoBuscadoText}>{productoBuscado}</span>
				</h2>

				<div className={styles.orderByBtnContainer}>
					<div className={styles.containerParaUseref} ref={orderByRef}>
						<button
							onClick={handleAbrirOrderBy}
							className={styles.orderByBtnContainer__btn}
						>
							ORDENAR PRODUCTOS
						</button>
						{menuOrderByOpen && (
							<div className={styles.orderByBtnContainer__optionsContainer}>
								<button
									title="Ordenar de menor a mayor precio"
									onClick={orderByPrice}
									className={`${
										styles.orderByBtnContainer__optionsContainer__option
									} ${
										orderByOptionSelected === "price" ? styles.disabled : ""
									}`}
								>
									MENOR A MAYOR PRECIO
								</button>
								<button
									className={`${
										styles.orderByBtnContainer__optionsContainer__option
									} ${
										orderByOptionSelected === "closest" || latitud === -200
											? styles.disabled
											: ""
									}`}
									title="Ordenar de mas cercano a mas lejano"
									onClick={orderByClosest}
								>
									{/* La latitud es -200 cuando no se eligió ubicación*/}
									SUPERMERCADO MÁS CERCANO
								</button>
								<button
									title="Ordenar productos alfabeticamente"
									onClick={orderByAlphabet}
									className={`${
										styles.orderByBtnContainer__optionsContainer__option
									} ${
										orderByOptionSelected === "alphabet" ? styles.disabled : ""
									}`}
								>
									NOMBRE DE PRODUCTO (A {"->"} Z)
								</button>
								<button
									title="Ordenar supermercados alfabeticamente"
									onClick={orderByMarket}
									className={`${
										styles.orderByBtnContainer__optionsContainer__option
									} ${
										orderByOptionSelected === "market" ? styles.disabled : ""
									}`}
								>
									NOMBRE DE SUPERMERCADO (A {"->"} Z)
								</button>
							</div>
						)}
					</div>
				</div>
			</div>
			<Productos productosQuery={productosQuery} />
		</div>
	);
};
