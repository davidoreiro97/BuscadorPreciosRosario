import {
	set_nombre_producto_type_value,
	set_nombre_producto_actionType,
} from "../types/GetSupermercadosCercanosReducer";

export const set_nombre_producto = (
	nombre_producto: string
): set_nombre_producto_actionType => ({
	type: set_nombre_producto_type_value,
	payload: nombre_producto,
});
