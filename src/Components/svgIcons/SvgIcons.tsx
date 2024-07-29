import styles from "./svgIcons.module.css";
interface IconProps {
	width: number;
	height: number;
	className: string;
}

export const DropDownArrow = ({ width, height, className }: IconProps) => (
	<svg
		className={`${styles[className]}`}
		width={width}
		height={height}
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 256 256"
	>
		<path
			fill="#666"
			className={`${styles[className]}`}
			d="M236.77344,211.97656a23.75471,23.75471,0,0,1-20.79688,12.01563H40.02344a23.9925,23.9925,0,0,1-20.76563-36.02344L107.23437,35.97656h-.00781a24.00413,24.00413,0,0,1,41.54688,0l87.96875,151.99219A23.744,23.744,0,0,1,236.77344,211.97656Z"
		/>
	</svg>
);

export const FlechaSigAtr = ({ width, height, className }: IconProps) => (
	<svg
		className={`${styles[className]}`}
		width={width}
		height={height}
		viewBox="0 0 71 74"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		preserveAspectRatio="none"
	>
		<path
			className={`${styles[className]}`}
			d="M23.4008 18.5V0L70.0749 37L23.4008 74V55.5H0.0638428V37V18.5H23.4008Z"
			fill="white"
		/>
	</svg>
);
