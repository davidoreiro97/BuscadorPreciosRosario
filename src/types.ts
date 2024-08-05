//Globales
export type AllowSections =
	| "/"
	| "/seleccion-de-ubicacion"
	| "/cercanos-a-mi-ubicacion"
	| "/cercanos-a-una-direccion"
	| "/busqueda-producto"
	| "/como-y-donde-busqueda"
	| "/resultados-busqueda";

export const pathSections: { [key: string]: AllowSections } = {
	bienvenida: "/",
	seleccion_de_ubicacion: "/seleccion-de-ubicacion",
	cercanos_a_mi_ubicacion: "/cercanos-a-mi-ubicacion",
	cercanos_a_una_direccion: "/cercanos-a-una-direccion",
	busqueda_producto: "/busqueda-producto",
	como_y_donde_busqueda: "/como-y-donde-busqueda",
	resultadosBusqueda: "/resultados-busqueda",
};

export type coordenadas = {
	latitud: number;
	longitud: number;
};

export type geolocationReturn = {
	latitud: number;
	longitud: number;
	precision: number;
};

//Para los supermercados y el resultado de la busqueda :
export type ubicacionesSupermercadoJson = {
	id: number;
	direccion: string;
	latitud: string;
	longitud: string;
}[];
export type supermercadoJson = {
	id: number;
	nombre: string;
	ubicaciones: ubicacionesSupermercadoJson;
};
export type ubicacionCercana = {
	direccion: string;
	latitud: string;
	longitud: string;
	distanciaHastaSupermercado: number;
};
export type supermercadoResultado = {
	nombre: string;
	ubicaciones: ubicacionCercana[];
};
