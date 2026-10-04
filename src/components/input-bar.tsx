import styles from "@/components/input-bar.module.css";
import { useStore } from "@/store";
import type { SettingsInfo } from "@/types";
import { updateSetting } from "@/utils";
import clsx from "clsx";
import { t } from "i18next";
import type { ChangeEvent, JSX } from "react";
import { useCallback } from "react";

interface InputBarProps {
	id: keyof SettingsInfo;
}

function InputBar({ id }: InputBarProps): JSX.Element {
	const value = useStore((state) => state.settings[id]);
	const isCheckbox = typeof value === "boolean";

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>): void => {
			updateSetting(id, event.currentTarget);
		},
		[id],
	);

	return (
		<div
			className={clsx(
				styles["input-bar"],
				isCheckbox && styles["checkbox"],
			)}
		>
			<label htmlFor={id}>{t(id)}</label>
			{isCheckbox ? (
				<>
					<div className={styles["spacer"]}></div>
					<input
						checked={value}
						id={id}
						onChange={handleChange}
						type="checkbox"
					/>
				</>
			) : (
				<input
					id={id}
					onChange={handleChange}
					type="number"
					value={value}
				/>
			)}
		</div>
	);
}

export default InputBar;
