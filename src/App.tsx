import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
//Recordar em cada secion comprobar que se tenga lo necesario :
// (ubicacion, que existan supermercados cercanos, que haya resultados, etc), en caso que no se tenga esto devolver
// al inicio.
import { pathSections } from "./types";
import {
	Bienvenida,
	SeleccionDeUbicacion,
	CercanosAMiUbicacion,
	CercanosAUnaDireccion,
	BusquedaProducto,
	Footer,
	ResultadosBusqueda,
} from "./Components/barrel";
// import styles from "./app.module.css";

function App() {
	return (
		<HashRouter>
			<Routes>
				<Route path={pathSections.bienvenida} element={<Bienvenida />} />
				<Route
					path={pathSections.seleccion_de_ubicacion}
					element={<SeleccionDeUbicacion />}
				/>
				<Route
					path={pathSections.cercanos_a_mi_ubicacion}
					element={<CercanosAMiUbicacion />}
				/>
				<Route
					path={pathSections.cercanos_a_una_direccion}
					element={<CercanosAUnaDireccion />}
				/>
				<Route
					path={pathSections.busqueda_producto}
					element={<BusquedaProducto />}
				/>
				<Route
					path={pathSections.resultadosBusqueda}
					element={<ResultadosBusqueda />}
				/>
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
			<Footer />
		</HashRouter>
	);
}

export default App;
