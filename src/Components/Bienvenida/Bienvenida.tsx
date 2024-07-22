import { Link } from "react-router-dom";
import { pathSections } from "../../types";
import postSupermercados from "../../Functions/postUnSupermercado";

export const Bienvenida = () => {
	return (
		<article>
			<header>
				<h1>
					<span>Encontra los productos con el mejor precio</span> en
					supermercados de Rosario, Santa Fe, Argentina
				</h1>
			</header>
			<p>
				En solo 3 pasos podrás encontrar los productos más baratos cercanos al
				lugar que desees.
			</p>
			<Link to={pathSections.seleccion_de_ubicacion}>COMENZAR</Link>
		</article>
	);
};
