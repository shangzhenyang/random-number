import IconBar from "@/components/icon-bar";
import styles from "@/components/title-bar.module.css";
import type { IconInfo } from "@/types";
import type { SizeProp } from "@fortawesome/fontawesome-svg-core";
import clsx from "clsx";
import type { JSX, ReactNode } from "react";

interface TitleBarProps {
	children: ReactNode;
	className?: string;
	icons: IconInfo[];
	iconSize: SizeProp;
}

function TitleBar({
	children,
	className,
	icons,
	iconSize,
}: TitleBarProps): JSX.Element {
	return (
		<div className={clsx(styles["title-bar"], className)}>
			{children}
			<IconBar
				items={icons}
				size={iconSize}
			/>
		</div>
	);
}

export default TitleBar;
