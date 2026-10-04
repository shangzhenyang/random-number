import InputBar from "@/components/input-bar";
import NameList from "@/components/name-list";
import Panel from "@/components/panel";
import TitleBar from "@/components/title-bar";
import { useStore } from "@/store";
import type { SettingsInfo } from "@/types";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import type { JSX } from "react";
import { useCallback } from "react";

const SETTINGS_ITEMS: (keyof SettingsInfo)[] = [
	"quantity",
	"minimum",
	"maximum",
	"speed",
	"repeat",
	"oddOnly",
	"evenOnly",
	"wheel",
];

function SettingsPanel(): JSX.Element | null {
	const isSettingsPanelShown = useStore(
		(state) => state.isSettingsPanelShown,
	);

	const closePanel = useCallback((): void => {
		useStore.setState({
			isSettingsPanelShown: false,
		});
	}, []);

	if (!isSettingsPanelShown) {
		return null;
	}

	const titleIcons = [
		{
			icon: faXmark,
			isShown: true,
			onClick: closePanel,
			title: t("close"),
		},
	];

	const inputBars = SETTINGS_ITEMS.map((item) => {
		return (
			<InputBar
				id={item}
				key={item}
			/>
		);
	});

	return (
		<Panel side="right">
			<TitleBar
				icons={titleIcons}
				iconSize="xl"
			>
				<h1>{t("settings")}</h1>
			</TitleBar>
			{inputBars}
			<NameList />
		</Panel>
	);
}

export default SettingsPanel;
