// Se setea latitud, longitud, los supermercados cercanos con su ubicación, el producto buscado y
// todo lo necesario para hacer el fetch al backend y que este haga el webscrapping.
import {
	set_coordenadas_type_value,
	Action,
	getSupermercadosCercanosReducer_stateType,
	set_supermercados_cercanos_type_value,
	set_nombre_producto_type_value,
} from "../types";

const initialState: getSupermercadosCercanosReducer_stateType = {
	latitud: null,
	longitud: null,
	supermercadosResultantes: null,
	productoBuscado: null,
};

export default function GetSupermercadosCercanosReducer(
	state = initialState,
	action: Action
) {
	switch (action.type) {
		case set_coordenadas_type_value: {
			// Verificar si action.payload es de tipo coordenadas
			if (
				typeof action.payload === "object" &&
				"latitud" in action.payload &&
				"longitud" in action.payload
			) {
				return {
					...state,
					latitud: action.payload.latitud,
					longitud: action.payload.longitud,
				};
			}
			// Si no es de tipo coordenadas, mantener el estado actual
			return state;
		}

		case set_supermercados_cercanos_type_value: {
			if (Array.isArray(action.payload)) {
				return {
					...state,
					supermercadosResultantes: action.payload,
				};
			}
			return state;
		}

		case set_nombre_producto_type_value: {
			if (typeof action.payload === "string") {
				return {
					...state,
					productoBuscado: action.payload,
				};
			}
			return state;
		}
		default: {
			return state;
		}
	}
}
