import {
	set_coordenadas_type_value,
	set_coordenadas_actionType,
} from "../types/GetSupermercadosCercanosReducer";
import { coordenadas } from "../../types";

export const set_coordenadas = ({
	latitud,
	longitud,
}: coordenadas): set_coordenadas_actionType => ({
	type: set_coordenadas_type_value,
	payload: { latitud, longitud },
});
