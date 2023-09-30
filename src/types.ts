export interface IconInfo {
	icon: string[];
	show: boolean;
	title: string;
	onClick: () => void;
}

export interface SettingsInfo {
	maximum: string;
	minimum: string;
	quantity: string;
	speed: string;
	repeat: boolean;
	oddOnly: boolean;
	evenOnly: boolean;
}
