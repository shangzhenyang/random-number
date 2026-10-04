import styles from "@/components/name-list.module.css";
import NewName from "@/components/new-name";
import TitleBar from "@/components/title-bar";
import { useStore } from "@/store";
import { setNames } from "@/utils";
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons";
import { t } from "i18next";
import type { JSX } from "react";
import { useCallback, useState } from "react";

function NameList(): JSX.Element {
	const names = useStore((state) => state.names);

	const [editingIndex, setEditingIndex] = useState(-1);

	const exportNames = useCallback((): void => {
		const newAnchor = document.createElement("a");
		newAnchor.href = URL.createObjectURL(
			new Blob([names.join("\n")], {
				type: "text/plain",
			}),
		);
		newAnchor.download = "names.txt";
		newAnchor.click();
	}, [names]);

	const importNames = useCallback((): void => {
		const newInput = document.createElement("input");
		newInput.type = "file";
		newInput.accept = ".txt";
		newInput.onchange = (): void => {
			const file = newInput.files?.[0];
			if (!file) {
				return;
			}
			const reader = new FileReader();
			reader.onload = (): void => {
				if (typeof reader.result === "string") {
					const newNames = reader.result
						.split("\n")
						.filter((nameItem) => {
							return !!nameItem;
						})
						.map((nameItem) => {
							return nameItem.trim();
						});
					setNames(newNames);
				}
			};
			reader.readAsText(file);
		};
		newInput.click();
	}, []);

	const stopEditing = useCallback((): void => {
		setEditingIndex(-1);
	}, []);

	const titleIcons = [
		{
			icon: faDownload,
			isShown: true,
			onClick: importNames,
			title: t("import"),
		},
		{
			icon: faUpload,
			isShown: true,
			onClick: exportNames,
			title: t("export"),
		},
	];

	const nameListItems = names.map((name, index) => {
		if (editingIndex === index) {
			return (
				<NewName
					doneEditing={stopEditing}
					index={index}
					key={index}
				/>
			);
		}

		const handleDeleteClick = (): void => {
			const newNames = [...names];
			newNames.splice(index, 1);
			setNames(newNames);
		};

		const handleEditClick = (): void => {
			setEditingIndex(index);
		};

		return (
			<li key={index}>
				<div className="list-item-main">{name}</div>
				<button
					onClick={handleEditClick}
					type="button"
				>
					{t("edit")}
				</button>
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
		<section>
			<TitleBar
				className={styles["title-bar"]}
				icons={titleIcons}
				iconSize="lg"
			>
				<h2 className={styles["title"]}>{t("names")}</h2>
			</TitleBar>
			<div className={styles["description"]}>
				{t("importNamesDescription")}
			</div>
			<ul>
				<NewName />
				{nameListItems}
			</ul>
		</section>
	);
}

export default NameList;
