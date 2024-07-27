import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { useNavigate } from "react-router-dom";
import postUnSupermercado from "../../Functions/postUnSupermercado";
import styles from "./resultadosBusqueda.module.css";
export const ResultadosBusqueda = () => {
	const [errorSeccion, setErrorSeccion] = useState(false);
	const [supermercadoEnConsulta, setSupermercadoEnConsulta] = useState<
		string | null
	>(null);
	const [numSupermercadoEnConsulta, setNumSupermercadoEnConsulta] =
		useState<string>("0");
	const [loader, setLoader] = useState(false);
	const [productosQuery, setProductosQuery] = useState<any[]>([]);
	//Para toda la ciudad se envía 91,181 en latitud y longitud.
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
			//Si hubo un error buscando algún supermercado informar con un "No pudimos buscar tu producto en : ...";
			setLoader(true);
			const allResults: any[] = [];
			for (const [index, supermercado] of supermercadosResultantes.entries()) {
				setSupermercadoEnConsulta(supermercado.nombre);
				setNumSupermercadoEnConsulta((index + 1).toString());
				console.log(
					`Supermercado ${index + 1} de ${supermercadosResultantes.length}`
				);
				try {
					let productosHallados = await postUnSupermercado(
						supermercado.nombre,
						productoBuscado
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
						console.log("Chunk de productos : ", newResults);
						allResults.push(...newResults);
					}
				} catch (e: any) {
					//Hacer un estado y poner los supermercados con errores así se le informa al cliente.
					if (e.message === "FETCH_ERROR") {
						console.log(
							`No se pudo consultar el supermercado ${supermercado.nombre} debido a un error interno del servidor.`
						);
					} else if (e.message === "INVALID_DATA") {
						console.log("EL SERVIDOR RECIBIO UN TIPO DE DATO NO ESPERADO.");
					} else {
						console.log(
							`No se pudo consultar el supermercado ${supermercado.nombre} debido a un error del cliente.`
						);
					}
					continue;
				}
			}
			setProductosQuery(allResults.sort((a, b) => a.precio - b.precio));
			setLoader(false);
			console.log(allResults);
		};
		enviarTodosLosSupermercados();
	}, [productoBuscado]);
	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(-1);
	};

	return (
		<div>
			{/* Ventana flotante */}
			{errorSeccion && (
				<h1>Ocurrió un error con los datos ingresados. Volver al inicio.</h1>
			)}
			{loader && (
				<div>
					<h2>Buscando tu producto en : {supermercadoEnConsulta}</h2>
					<p>
						supermercado {numSupermercadoEnConsulta} de{" "}
						{supermercadosResultantes?.length}
					</p>
				</div>
			)}
			<button title="VOLVER" onClick={() => handleVolver()}>
				<div>{"<-"}</div>
				<span>VOLVER</span>
			</button>
			<h2>ResultadosProductos</h2>
			{/* Si productosQuery.lenght es 0 mostrar sin resultados. */}
			{productosQuery.map((element, index) => (
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
						{/* Si la distancia hasta el supermercado es "NO" significa que se eligio toda la ciudad.*/}
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
			))}
		</div>
	);
};
