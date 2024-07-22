// src/Components/NotFound.tsx
import { useNavigate } from "react-router-dom";
export const NotFound = () => {
	const navigate = useNavigate();
	const handleGoHome = () => {
		navigate("/");
	};
	return (
		<div>
			<h1>404 - Página no encontrada</h1>
			<p>Lo sentimos, la página que estás buscando no existe.</p>
			<button onClick={handleGoHome}>Ir al inicio</button>
		</div>
	);
};
