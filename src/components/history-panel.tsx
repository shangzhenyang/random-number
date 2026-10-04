import Panel from "@/components/panel";
import TitleBar from "@/components/title-bar";
import { useStore } from "@/store";
import { faDeleteLeft, faXmark } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import type { JSX } from "react";
import { useCallback } from "react";

function HistoryPanel(): JSX.Element | null {
	const historyItems = useStore((state) => state.historyItems);
	const isHistoryPanelShown = useStore((state) => state.isHistoryPanelShown);

	const clearHistoryItems = useCallback((): void => {
		useStore.setState({
			historyItems: [],
		});
	}, []);

	const closePanel = useCallback((): void => {
		useStore.setState({
			isHistoryPanelShown: false,
		});
	}, []);

	if (!isHistoryPanelShown) {
		return null;
	}

	const titleIcons = [
		{
			icon: faDeleteLeft,
			isShown: historyItems.length > 0,
			onClick: clearHistoryItems,
			title: t("clear"),
		},
		{
			icon: faXmark,
			isShown: true,
			onClick: closePanel,
			title: t("close"),
		},
	];

	const historyListItems = historyItems.map((item, index) => {
		const handleDeleteClick = (): void => {
			const newHistoryItems = [...historyItems];
			newHistoryItems.splice(index, 1);
			useStore.setState({
				historyItems: newHistoryItems,
			});
		};

		return (
			<li key={index}>
				<div className="list-item-main">{item}</div>
				<button
					onClick={handleDeleteClick}
					type="button"
				>
					{t("delete")}
				</button>
			</li>
		);
	});

	return (
		<Panel side="left">
			<TitleBar
				icons={titleIcons}
				iconSize="xl"
			>
				<h1>{t("history")}</h1>
			</TitleBar>
			<ul>{historyListItems}</ul>
		</Panel>
	);
}

export default HistoryPanel;
