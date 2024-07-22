import { useNavigate } from "react-router-dom";
export const ComoYDondeBusqueda = () => {
	const navigate = useNavigate();
	const handleVolver = () => {
		navigate(-1);
	};
	return (
		<aside>
			{" "}
			<button onClick={() => handleVolver()}>
				<div>{"<-"}</div>
				<span>VOLVER</span>
			</button>
			<div>Aca te explico como y donde se busca capo.</div>
		</aside>
	);
};
