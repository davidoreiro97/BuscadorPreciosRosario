import styles from "./productos.module.css";

import { Producto } from "./Producto/Producto";
export const Productos = ({ productosQuery }: { productosQuery: any[] }) => {
	return (
		<div className={styles.productoMainContainer}>
			{productosQuery.length === 0 ? (
				<p className={styles.sinResultadosText}>Sin resultados :{"("}</p>
			) : (
				productosQuery.map((supermercado, index) => (
					<Producto
						key={index}
						precio={supermercado.precio}
						url_imagen_online={supermercado.urlImagen}
						nombre_producto={supermercado.nombre}
						nombre_supermercado={supermercado.supermercado}
						direccion_ubicacion_cercana={
							supermercado.ubicacionCercana.direccion
						}
						distancia_hasta_ubicacion_cercana={
							supermercado.ubicacionCercana.distanciaHastaSupermercado
						}
						todas_sus_sucursales={supermercado.ubicacionesTodas}
						url_producto_online={supermercado.urlProductoOrig}
					/>
				))
			)}
		</div>
	);
};
