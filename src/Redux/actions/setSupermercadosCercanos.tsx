import {
	set_supermercados_cercanos_type_value,
	set_supermercados_cercanos_actionType,
} from "../types/GetSupermercadosCercanosReducer";
import { supermercadoResultado } from "../../types";

export const set_supermercados_cercanos = (
	supermercados: supermercadoResultado[]
): set_supermercados_cercanos_actionType => ({
	type: set_supermercados_cercanos_type_value,
	payload: supermercados,
});
