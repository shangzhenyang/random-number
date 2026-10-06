import { Wheel } from "@/classes/wheel";
import type { SettingsInfo } from "@/types";
import { create } from "zustand";

interface StoreStateInfo {
	historyItems: string[];
	isHistoryPanelShown: boolean;
	isSettingsPanelShown: boolean;
	names: string[];
	settings: SettingsInfo;
}

const params = Object.fromEntries(
	new URLSearchParams(window.location.search).entries(),
) as {
	wheel?: string;
};

export const useStore = create<StoreStateInfo>()(() => {
	const names = getStoredNames();
	return {
		historyItems: [],
		isHistoryPanelShown: false,
		isSettingsPanelShown: checkIfDesktop(),
		names: names,
		settings: getInitialSettings(names),
	};
});

export function checkIfDesktop(): boolean {
	return window.innerWidth >= 1200;
}

function getInitialSettings(names: string[]): SettingsInfo {
	const settings = getStoredSettings();
	if (params.wheel === undefined || settings.wheel) {
		return settings;
	}
	return {
		...settings,
		maximum: Wheel.checkIfEntered()
			? settings.maximum
			: Wheel.getDefaultMaximum(settings, names),
		wheel: true,
	};
}

function getStoredNames(): string[] {
	try {
		const storedNames = localStorage.getItem("names");
		return storedNames ? (JSON.parse(storedNames) as string[]) : [];
	} catch {
		return [];
	}
}

function getStoredSettings(): SettingsInfo {
	const defaultValue = {
		evenOnly: false,
		maximum: "60",
		minimum: "1",
		oddOnly: false,
		quantity: "1",
		repeat: true,
		speed: "100",
		wheel: false,
	};
	try {
		const storedSettings = localStorage.getItem("settings");
		if (!storedSettings) {
			return defaultValue;
		}
		const settings = {
			...defaultValue,
			...(JSON.parse(storedSettings) as Partial<SettingsInfo>),
		};
		if (!settings.quantity || parseInt(settings.quantity) < 1) {
			settings.quantity = defaultValue.quantity;
		}
		if (
			!settings.minimum ||
			!settings.maximum ||
			parseInt(settings.minimum) >= parseInt(settings.maximum)
		) {
			settings.minimum = defaultValue.minimum;
			settings.maximum = defaultValue.maximum;
		}
		return settings;
	} catch {
		return defaultValue;
	}
}
