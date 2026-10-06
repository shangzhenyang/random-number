import { Wheel } from "@/classes/wheel";
import { checkIfDesktop, useStore } from "@/store";
import type { SettingsInfo } from "@/types";

let hasAutoShownHistoryPanel = false;

export function addHistoryItem(newItem: string): void {
	const { historyItems, settings } = useStore.getState();
	useStore.setState({
		historyItems: [...historyItems, newItem],
	});
	if (
		!hasAutoShownHistoryPanel &&
		checkIfDesktop() &&
		settings.quantity === "1"
	) {
		useStore.setState({
			isHistoryPanelShown: true,
		});
		hasAutoShownHistoryPanel = true;
	}
}

export function getRandomInteger(minimum: number, maximum: number): number {
	return Math.floor(Math.random() * (maximum - minimum + 1) + minimum);
}

export function setNames(newValue: string[]): void {
	useStore.setState({
		names: newValue,
	});
	localStorage.setItem("names", JSON.stringify(newValue));
	const newSettings = {
		...useStore.getState().settings,
		maximum: newValue.length === 0 ? "60" : newValue.length.toString(),
		minimum: "1",
	};
	if (newSettings.wheel) {
		newSettings.maximum = Wheel.getDefaultMaximum(newSettings, newValue);
	}
	setSettings(newSettings);
}

export function setSettings(newValue: SettingsInfo): void {
	useStore.setState({
		isSettingsPanelShown: true,
		settings: newValue,
	});
	localStorage.setItem("settings", JSON.stringify(newValue));
	if (newValue.wheel) {
		localStorage.setItem("hasEnteredWheel", "1");
	}
}

export function toggleHistoryPanel(): void {
	const { isHistoryPanelShown } = useStore.getState();
	if (!isHistoryPanelShown && !checkIfDesktop()) {
		useStore.setState({
			isSettingsPanelShown: false,
		});
	}
	useStore.setState({
		isHistoryPanelShown: !isHistoryPanelShown,
	});
}

export function toggleSettingsPanel(): void {
	const { isSettingsPanelShown } = useStore.getState();
	if (!isSettingsPanelShown && !checkIfDesktop()) {
		useStore.setState({
			isHistoryPanelShown: false,
		});
	}
	useStore.setState({
		isSettingsPanelShown: !isSettingsPanelShown,
	});
}

export function updateSetting(
	key: keyof SettingsInfo,
	input: HTMLInputElement,
): void {
	const newSettings = {
		...useStore.getState().settings,
	};
	if (input.type === "checkbox") {
		if (key === "evenOnly") {
			newSettings.oddOnly = false;
		} else if (key === "oddOnly") {
			newSettings.evenOnly = false;
		} else if (
			key === "wheel" &&
			input.checked &&
			!Wheel.checkIfEntered()
		) {
			newSettings.maximum = Wheel.getDefaultMaximum(
				newSettings,
				useStore.getState().names,
			);
		}
		Object.assign(newSettings, {
			[key]: input.checked,
		});
		if (!newSettings.repeat) {
			useStore.setState({
				historyItems: [],
			});
		}
	} else {
		if (
			(key === "quantity" || key === "speed") &&
			parseInt(input.value) > 100
		) {
			return;
		}
		Object.assign(newSettings, {
			[key]: input.value,
		});
	}
	setSettings(newSettings);
}
