import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

export interface IconInfo {
	icon: IconDefinition;
	isShown: boolean;
	onClick: () => void;
	title: string;
}

export interface SettingsInfo {
	evenOnly: boolean;
	maximum: string;
	minimum: string;
	oddOnly: boolean;
	quantity: string;
	repeat: boolean;
	speed: string;
	wheel: boolean;
}
