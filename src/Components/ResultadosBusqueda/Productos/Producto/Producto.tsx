import styles from "./producto.module.css";
import logoArcoiris from "../../../../assets/img/logosSupermercados/svg/arcoiris.svg";
import logoCarrefour from "../../../../assets/img/logosSupermercados/svg/carrefour.svg";
import logoCoto from "../../../../assets/img/logosSupermercados/svg/coto.svg";
import logoDar from "../../../../assets/img/logosSupermercados/svg/dar.svg";
import logoGallega from "../../../../assets/img/logosSupermercados/svg/laGallega.svg";
import logoReina from "../../../../assets/img/logosSupermercados/svg/laReina.svg";
import logoLibertad from "../../../../assets/img/logosSupermercados/svg/libertad.svg";
import logoJumbo from "../../../../assets/img/logosSupermercados/svg/jumbo.svg";
import { useState } from "react";
type producto_prop_types = {
	precio: string;
	url_imagen_online: string;
	nombre_producto: string;
	nombre_supermercado: string;
	direccion_ubicacion_cercana: string;
	distancia_hasta_ubicacion_cercana: number;
	todas_sus_sucursales: any[];
	url_producto_online: string;
};
export const Producto = ({
	precio,
	url_imagen_online,
	nombre_producto,
	nombre_supermercado,
	direccion_ubicacion_cercana,
	distancia_hasta_ubicacion_cercana,
	todas_sus_sucursales,
	url_producto_online,
}: producto_prop_types) => {
	const [mostrarUbicaciones, setMostrarUbicaciones] = useState(false);
	const handleMostrarUbicaciones = () => {
		setMostrarUbicaciones((prevState) => !prevState);
	};
	const logosURL: {
		[key: string]: string;
	} = {
		"HIPERMERCADO LIBERTAD": logoLibertad,
		CARREFOUR: logoCarrefour,
		DAR: logoDar,
		ARCOIRIS: logoArcoiris,
		"LA GALLEGA": logoGallega,
		"LA REINA": logoReina,
		JUMBO: logoJumbo,
		COTO: logoCoto,
	};
	const urlLogo = logosURL[nombre_supermercado];
	const [imagenCargada, setImagenCargada] = useState(false);
	return (
		<div className={styles.producto}>
			<div className={styles.producto__precioImgContainer}>
				<h4 className={styles.producto__precioImgContainer__precio}>
					{precio}$
				</h4>
				<img
					className={styles.producto__precioImgContainer__img}
					src={url_imagen_online}
					alt={`Imagen del producto ${nombre_producto}`}
					onLoad={() => setImagenCargada(true)}
					style={{ display: imagenCargada ? "block" : "none" }}
				/>
				{!imagenCargada && (
					<div className={styles.skeletonImage}>CARGANDO...</div>
				)}
			</div>
			<div className={styles.producto__datos}>
				<h3 className={styles.producto__datos__nombreProducto}>
					{nombre_producto.charAt(0).toUpperCase() +
						nombre_producto.toLowerCase().slice(1)}
				</h3>

				<h5 className={styles.producto__datos__nombreSupermercado}>
					■ Supermercado :
					<img
						className={styles.producto__datos__nombreSupermercado__logo}
						src={urlLogo}
						alt="Logo"
						loading="lazy"
					/>
				</h5>
				{distancia_hasta_ubicacion_cercana !== 0 && (
					<h5 className={styles.producto__datos__supermercadoCercano}>
						■ Sucursal más cercana : {direccion_ubicacion_cercana}{" "}
						<span
							className={styles.producto__datos__supermercadoCercano__distancia}
						>
							( a {Math.ceil(distancia_hasta_ubicacion_cercana * 10)} cuadras
							aprox.)
						</span>
					</h5>
				)}
				<h5 className={styles.producto__datos__todasSusSucursalesTitulo}>
					<span>■ Todas sus sucursales</span>
					<button
						className={styles.producto__datos__todasSucursalesTitulo__btn}
						onClick={handleMostrarUbicaciones}
					>
						{" "}
						{mostrarUbicaciones ? "OCULTAR" : "MOSTRAR"}
					</button>
				</h5>
				{mostrarUbicaciones && (
					<ul className={styles.producto__datos__todasSusSucursalesContainer}>
						{todas_sus_sucursales.map((ubicacion: any, index: number) => (
							<li key={index}>
								<span>
									{ubicacion.direccion}{" "}
									{ubicacion.distanciaHastaSupermercado !== 0 && (
										<span>
											( a {Math.ceil(ubicacion.distanciaHastaSupermercado * 10)}{" "}
											cuadras aprox.)
										</span>
									)}
								</span>
							</li>
						))}
					</ul>
				)}
				<div className={styles.producto__datos__containerBtn}>
					<a
						className={styles.producto__datos__containerBtn__btnVerProducto}
						referrerPolicy="no-referrer"
						target="_blank"
						href={url_producto_online}
					>
						Ver en su página
					</a>
				</div>
			</div>
		</div>
	);
};
