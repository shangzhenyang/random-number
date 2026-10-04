import styles from "@/components/new-name.module.css";
import { useStore } from "@/store";
import { setNames } from "@/utils";
import { t } from "i18next";
import type { ChangeEvent, JSX, KeyboardEvent } from "react";
import { useCallback, useId, useState } from "react";

interface NewNameProps {
	doneEditing?: () => void;
	index?: number;
}

function NewName({ doneEditing, index }: NewNameProps): JSX.Element {
	const inputId = useId();

	const [newName, setNewName] = useState(() => {
		return index === undefined ? "" : useStore.getState().names[index];
	});

	const saveName = useCallback((): void => {
		if (!newName) {
			return;
		}
		const { names } = useStore.getState();
		if (index === undefined) {
			setNames([...names, newName]);
		} else {
			const newNames = [...names];
			newNames[index] = newName;
			setNames(newNames);
			doneEditing?.();
		}
		setNewName("");
	}, [doneEditing, index, newName]);

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			setNewName(event.currentTarget.value);
		},
		[],
	);

	const handleKeyDown = useCallback(
		(event: KeyboardEvent): void => {
			if (event.key === "Enter") {
				saveName();
			}
		},
		[saveName],
	);

	return (
		<li className={styles["list-input-bar"]}>
			<label htmlFor={inputId}>{t("newName")}</label>
			<input
				className="list-item-main"
				id={inputId}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				placeholder={t("enterHere")}
				type="text"
				value={newName}
			/>
			<button
				disabled={!newName}
				onClick={saveName}
				type="button"
			>
				{t("save")}
			</button>
			{index !== undefined && (
				<button
					disabled={!newName}
					onClick={doneEditing}
					type="button"
				>
					{t("cancel")}
				</button>
			)}
		</li>
	);
}

export default NewName;
