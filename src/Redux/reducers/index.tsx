import { combineReducers } from "redux";
import GetSupermercadosCercanosReducer from "./GetSupermercadosCercanosReducer";
//Exportamos todos los reducers, como en un barrel.
const rootReducer = combineReducers({
	GetSupermercadosCercanosReducer: GetSupermercadosCercanosReducer,
});
export type AppState = ReturnType<typeof rootReducer>;
export default rootReducer;
