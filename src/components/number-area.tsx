import styles from "@/components/number-area.module.css";
import { useStore } from "@/store";
import { addHistoryItem, getRandomInteger, setSettings } from "@/utils";
import clsx from "clsx";
import { t } from "i18next";
import type { JSX } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function NumberArea(): JSX.Element {
	const hasNames = useStore((state) => state.names.length > 0);

	const [isScrolling, setIsScrolling] = useState(false);
	const [number, setNumber] = useState("0");

	const isScrollingRef = useRef(false);
	const timeoutIdRef = useRef<number | undefined>(undefined);

	const stopScrolling = useCallback((): void => {
		clearTimeout(timeoutIdRef.current);
		isScrollingRef.current = false;
		setIsScrolling(false);
	}, []);

	const getRandomValue = useCallback((): string => {
		const { historyItems, names, settings } = useStore.getState();
		const minimum = parseInt(settings.minimum);
		const maximum = parseInt(settings.maximum);
		if (isNaN(minimum) || isNaN(maximum)) {
			// Easter egg
			// returns a random Chinese character
			return String.fromCharCode(getRandomInteger(19968, 40868));
		}
		const randomInteger = getRandomInteger(minimum, maximum);
		if (
			(settings.oddOnly && randomInteger % 2 === 0) ||
			(settings.evenOnly && randomInteger % 2 !== 0)
		) {
			return getRandomValue();
		}
		const result = names[randomInteger - 1] || randomInteger.toString();
		if (!settings.repeat) {
			let total = maximum - minimum + 1;
			if (settings.oddOnly) {
				total = Math.floor(total / 2);
			} else if (settings.evenOnly) {
				total = Math.ceil(total / 2);
			}
			if (total - historyItems.length <= 1) {
				setSettings({
					...settings,
					repeat: true,
				});
				stopScrolling();
				return "0";
			}
			if (historyItems.includes(result)) {
				return getRandomValue();
			}
		}
		return result;
	}, [stopScrolling]);

	const startScrolling = useCallback((): void => {
		// uses setTimeout instead of setInterval to dynamically change the speed
		timeoutIdRef.current = window.setTimeout(
			() => {
				try {
					setNumber(getRandomValue());
					if (isScrollingRef.current) {
						startScrolling();
					}
				} catch (error) {
					console.error(error);
					localStorage.clear();
					window.location.reload();
				}
			},
			1000 / parseInt(useStore.getState().settings.speed),
		);
	}, [getRandomValue]);

	const toggleScrolling = useCallback((): void => {
		if (isScrollingRef.current) {
			stopScrolling();
			const randomValue = getRandomValue();
			setNumber(randomValue);
			addHistoryItem(randomValue);
		} else {
			isScrollingRef.current = true;
			setIsScrolling(true);
			startScrolling();
		}
	}, [getRandomValue, startScrolling, stopScrolling]);

	useEffect(() => {
		return stopScrolling;
	}, [stopScrolling]);

	return (
		<div className={styles["number-area"]}>
			<div
				className={clsx(
					styles["number-box"],
					hasNames && styles["name"],
				)}
			>
				{number}
			</div>
			<button
				className={styles["main-button"]}
				onClick={toggleScrolling}
				type="button"
			>
				{isScrolling ? t("stop") : t("start")}
			</button>
		</div>
	);
}

export default NumberArea;
