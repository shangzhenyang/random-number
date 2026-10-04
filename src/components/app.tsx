import Analytics from "@/components/analytics";
import styles from "@/components/app.module.css";
import Footer from "@/components/footer";
import HistoryPanel from "@/components/history-panel";
import IconBar from "@/components/icon-bar";
import NumberArea from "@/components/number-area";
import SettingsPanel from "@/components/settings-panel";
import WheelArea from "@/components/wheel-area";
import { useStore } from "@/store";
import { toggleHistoryPanel, toggleSettingsPanel } from "@/utils";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faClockRotateLeft, faGear } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import type { JSX } from "react";
import { useCallback } from "react";

function App(): JSX.Element {
	const isHistoryPanelShown = useStore((state) => state.isHistoryPanelShown);
	const isSettingsPanelShown = useStore(
		(state) => state.isSettingsPanelShown,
	);
	const isWheelMode = useStore((state) => state.settings.wheel);
	const quantity = useStore((state) => state.settings.quantity);

	const openGitHub = useCallback((): void => {
		window.open("https://github.com/shangzhenyang/random-number");
	}, []);

	const cornerIcons = [
		{
			icon: faGear,
			isShown: !isSettingsPanelShown,
			onClick: toggleSettingsPanel,
			title: t("settings"),
		},
		{
			icon: faClockRotateLeft,
			isShown: !isHistoryPanelShown,
			onClick: toggleHistoryPanel,
			title: t("history"),
		},
		{
			icon: faGithub,
			isShown: true,
			onClick: openGitHub,
			title: "GitHub",
		},
	];

	const numberAreas = Array.from(
		{
			length: parseInt(quantity) || 0,
		},
		(_, index) => {
			return isWheelMode ? (
				<WheelArea key={index} />
			) : (
				<NumberArea key={index} />
			);
		},
	);

	return (
		<div className={styles["app"]}>
			<HistoryPanel />
			<main className={styles["main"]}>
				<div className={styles["number-areas"]}>{numberAreas}</div>
			</main>
			<SettingsPanel />
			<Footer />
			<IconBar
				className={styles["corner-icons"]}
				items={cornerIcons}
				size="xl"
			/>
			<Analytics />
		</div>
	);
}

export default App;
