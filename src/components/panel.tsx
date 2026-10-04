import styles from "@/components/panel.module.css";
import clsx from "clsx";
import type { JSX, ReactNode } from "react";

interface PanelProps {
	children: ReactNode;
	side: "left" | "right";
}

function Panel({ children, side }: PanelProps): JSX.Element {
	return (
		<div className={clsx(styles["panel"], styles[`panel-${side}`])}>
			{children}
		</div>
	);
}

export default Panel;
