import { SVGProps } from "react";

export const CloseButtonSVG = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			{...props}
			viewBox="0 0 16 16"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="m9.459 8.025 2.15 2.227a1.032 1.032 0 1 1 -1.485 1.433l-2.15-2.226-2.226 2.15a1.032 1.032 0 1 1 -1.433-1.485l2.226-2.15-2.15-2.226a1.032 1.032 0 1 1 1.485-1.433l2.15 2.226 2.226-2.15a1.032 1.032 0 1 1 1.433 1.485l-2.226 2.15z"
				fillRule="evenodd"
			/>
		</svg>
	);
}

export default CloseButtonSVG;