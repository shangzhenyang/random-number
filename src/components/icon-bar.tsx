import styles from "@/components/icon-bar.module.css";
import type { IconInfo } from "@/types";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import type { JSX } from "react";

interface IconBarProps {
	className?: string;
	items: IconInfo[];
	size: SizeProp;
}

function IconBar({ className, items, size }: IconBarProps): JSX.Element {
	const iconElements = items
		.filter((item) => {
			return item.isShown;
		})
		.map((item) => {
			return (
				<button
					className={styles["icon"]}
					key={item.title}
					onClick={item.onClick}
					title={item.title}
					type="button"
				>
					<FontAwesomeIcon
						icon={item.icon}
						size={size}
						widthAuto
					/>
				</button>
			);
		});

	return (
		<div className={clsx(styles["icon-bar"], className)}>
			{iconElements}
		</div>
	);
}

export default IconBar;
