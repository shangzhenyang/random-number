import { Wheel } from "@/classes/wheel";
import styles from "@/components/wheel-area.module.css";
import { useStore } from "@/store";
import { addHistoryItem, setSettings } from "@/utils";
import clsx from "clsx";
import { t } from "i18next";
import type { JSX, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

function WheelArea(): JSX.Element {
	const historyItems = useStore((state) => state.historyItems);
	const names = useStore((state) => state.names);
	const settings = useStore((state) => state.settings);

	const [isDrawing, setIsDrawing] = useState(false);
	const [isMoving, setIsMoving] = useState(false);
	const [removedItems, setRemovedItems] = useState<string[]>([]);
	const [winnerIndex, setWinnerIndex] = useState(-1);

	const discRef = useRef<SVGSVGElement>(null);
	const hasBrakedRef = useRef(false);
	const isDrawingRef = useRef(false);
	const pointerRef = useRef<SVGPathElement>(null);
	const wheelRef = useRef(new Wheel());

	const allItems = Wheel.getItems(settings, names);
	const items = settings.repeat
		? allItems
		: allItems.filter((item) => {
				return !(
					removedItems.includes(item) && historyItems.includes(item)
				);
			});
	const hasAvailableItem =
		settings.repeat ||
		allItems.some((item) => {
			return !historyItems.includes(item);
		});
	const hasLabels = items.length <= 60;
	const hasGaps = hasLabels && items.length > 1;

	useEffect(() => {
		if (items.length > 0) {
			wheelRef.current.setSegments(items.length, hasGaps);
		}
		pointerRef.current?.setAttribute(
			"d",
			wheelRef.current.getPointerPath(),
		);
	}, [hasGaps, items.length]);

	useEffect(() => {
		if (!isMoving) {
			return undefined;
		}
		let frameId = 0;
		let previousTime = performance.now();
		const updateWheel = (time: number): void => {
			if (!discRef.current || !pointerRef.current) {
				return;
			}
			const wheel = wheelRef.current;
			wheel.update(Math.min(0.05, (time - previousTime) / 1000));
			previousTime = time;
			if (wheel.hasHitPeg && "vibrate" in navigator) {
				navigator.vibrate(10);
			}
			discRef.current.style.transform = `rotate(${wheel.angle}deg)`;
			pointerRef.current.setAttribute("d", wheel.getPointerPath());
			if (!wheel.checkIfSettled()) {
				frameId = requestAnimationFrame(updateWheel);
				return;
			}
			setIsMoving(false);
			if (!isDrawingRef.current) {
				return;
			}
			const index = wheel.getWinnerIndex();
			isDrawingRef.current = false;
			setIsDrawing(false);
			setWinnerIndex(index);
			addHistoryItem(items[index]);
		};
		frameId = requestAnimationFrame(updateWheel);
		return (): void => {
			cancelAnimationFrame(frameId);
		};
	}, [isMoving, items]);

	const startDrawing = useCallback((): void => {
		isDrawingRef.current = true;
		setIsDrawing(true);
		setWinnerIndex(-1);
	}, []);

	const dragWheel = useCallback(
		(event: PointerEvent<SVGSVGElement>): void => {
			if (!wheelRef.current.isDragging) {
				return;
			}
			wheelRef.current.drag(
				Wheel.getPointerAngle(
					event.clientX,
					event.clientY,
					event.currentTarget.getBoundingClientRect(),
				),
				event.timeStamp,
			);
		},
		[],
	);

	const grabWheel = useCallback(
		(event: PointerEvent<SVGSVGElement>): void => {
			const rect = event.currentTarget.getBoundingClientRect();
			const distance = Math.hypot(
				event.clientX - (rect.left + rect.width / 2),
				event.clientY - (rect.top + rect.height / 2),
			);
			if (
				items.length === 0 ||
				distance > event.currentTarget.clientWidth / 2
			) {
				return;
			}
			event.currentTarget.setPointerCapture(event.pointerId);
			wheelRef.current.grab(
				Wheel.getPointerAngle(event.clientX, event.clientY, rect),
				event.timeStamp,
			);
			if (!settings.repeat && hasAvailableItem) {
				setRemovedItems(historyItems);
				setWinnerIndex(-1);
			}
			isDrawingRef.current = false;
			setIsDrawing(false);
			setIsMoving(true);
		},
		[hasAvailableItem, historyItems, items.length, settings.repeat],
	);

	const handlePointerDown = useCallback((): void => {
		hasBrakedRef.current = isMoving;
		wheelRef.current.isBraking = isMoving;
	}, [isMoving]);

	const releaseBrake = useCallback((): void => {
		wheelRef.current.isBraking = false;
	}, []);

	const releaseWheel = useCallback(
		(event: PointerEvent<SVGSVGElement>): void => {
			const velocity = wheelRef.current.release(event.timeStamp);
			if (Math.abs(velocity) < 360) {
				return;
			}
			if (!hasAvailableItem) {
				setSettings({
					...settings,
					repeat: true,
				});
				return;
			}
			startDrawing();
		},
		[hasAvailableItem, settings, startDrawing],
	);

	const spin = useCallback((): void => {
		if (isMoving) {
			return;
		}
		if (hasBrakedRef.current) {
			hasBrakedRef.current = false;
			return;
		}
		if (!hasAvailableItem) {
			setSettings({
				...settings,
				repeat: true,
			});
			return;
		}
		if (!settings.repeat) {
			setRemovedItems(historyItems);
		}
		const power = Math.max(1, parseInt(settings.speed) || 100) / 100;
		wheelRef.current.spin(power * 1500 * (0.85 + Math.random() * 0.3));
		startDrawing();
		setIsMoving(true);
	}, [hasAvailableItem, historyItems, isMoving, settings, startDrawing]);

	const segments = items.map((item, index) => {
		return (
			<g
				className={clsx(
					styles["segment"],
					!isDrawing && index === winnerIndex && styles["winner"],
				)}
				key={index}
			>
				<path d={Wheel.getSegmentPath(index, items.length)} />
				{hasLabels && (
					<text
						dominantBaseline="central"
						fontSize={Math.min(48, 1400 / items.length)}
						textAnchor="end"
						transform={`rotate(${((index + 0.5) * 360) / items.length - 90})`}
						x={460}
					>
						{item}
					</text>
				)}
			</g>
		);
	});

	return (
		<div className={styles["wheel"]}>
			<svg
				className={clsx(styles["disc"], hasLabels && styles["labeled"])}
				onLostPointerCapture={releaseWheel}
				onPointerDown={grabWheel}
				onPointerMove={dragWheel}
				onPointerUp={releaseWheel}
				ref={discRef}
				viewBox="-500 -500 1000 1000"
			>
				{segments}
			</svg>
			<svg
				className={styles["pointer"]}
				viewBox="0 0 44 24"
			>
				<path ref={pointerRef} />
			</svg>
			<button
				className={clsx(
					styles["spin-button"],
					isDrawing && styles["is-hidden"],
				)}
				disabled={allItems.length === 0}
				onClick={spin}
				onPointerCancel={releaseBrake}
				onPointerDown={handlePointerDown}
				onPointerLeave={releaseBrake}
				onPointerUp={releaseBrake}
				type="button"
			>
				{t("spin")}
			</button>
		</div>
	);
}

export default WheelArea;
