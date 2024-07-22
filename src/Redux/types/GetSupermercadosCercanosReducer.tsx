// GetSupermercadosCercanosReducer
/// Para las coordenadas.
import { coordenadas } from "../../types";
import { supermercadoResultado } from "../../types";
export const set_coordenadas_type_value: string = "set_coordenadas";
export type set_coordenadas_actionType = {
	type: typeof set_coordenadas_type_value;
	payload: coordenadas;
};

/// Para el resultado de los supermercados cercanos.
export const set_supermercados_cercanos_type_value: string =
	"set_supermercados_cercanos";
export type set_supermercados_cercanos_actionType = {
	type: typeof set_supermercados_cercanos_type_value;
	payload: supermercadoResultado[];
};

/// Para el nombre del producto buscado.
export const set_nombre_producto_type_value: string = "set_nombre_producto";
export type set_nombre_producto_actionType = {
	type: typeof set_nombre_producto_type_value;
	payload: string;
};
//// Para el estado del reducer en general.
export type getSupermercadosCercanosReducer_stateType = {
	latitud: number | null;
	longitud: number | null;
	supermercadosResultantes: supermercadoResultado[] | null;
	productoBuscado: string | null;
};

//// Uniendo todos los tipos de Actions
export type Action =
	| set_coordenadas_actionType
	| set_supermercados_cercanos_actionType
	| set_nombre_producto_actionType;
