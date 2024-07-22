import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../Redux/reducers";
import { useNavigate } from "react-router-dom";
import postUnSupermercado from "../../Functions/postUnSupermercado";

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
							nombre: e.tituloProducto,
							precio: e.precio,
							url: e.urlProducto,
							supermercado: supermercado.nombre,
							ubicacionCercana: supermercado.ubicaciones[0],
							ubicacionesTodas: supermercado.ubicaciones,
						}));
						console.log(newResults);
						allResults.push(...newResults);
					}
				} catch (e) {
					console.log("No se pudo consultar el super kpo.", e);
				}
			}
			setProductosQuery(allResults);
			setLoader(false);
			console.log(allResults);
		};
		enviarTodosLosSupermercados();

		//Los detalles van a ser una ventana flotante
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
		</div>
	);
};
