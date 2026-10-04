import type { SettingsInfo } from "@/types";

export class Wheel {
	public angle = 0;
	private contactAngle = 1;
	private dragAngle = 0;
	private dragSamples: { angle: number; time: number }[] = [];
	private hasGaps = false;
	public hasHitPeg = false;
	public isBraking = false;
	public isDragging = false;
	private isTouching = false;
	private segmentAngle = 360;
	private segmentCount = 1;
	private slot = 0;
	private tipOffset = 0;
	private velocity = 0;

	private static checkIfEntered(): boolean {
		try {
			return localStorage.getItem("hasEnteredWheel") === "1";
		} catch {
			return false;
		}
	}

	public checkIfSettled(): boolean {
		return (
			!this.isDragging &&
			this.velocity === 0 &&
			!this.isTouching &&
			Math.abs(this.tipOffset) <= this.contactAngle / 120 &&
			Math.abs(this.getClearanceShift()) <= this.contactAngle / 120
		);
	}

	public drag(pointerAngle: number, time: number): void {
		const lastSample = this.dragSamples[this.dragSamples.length - 1];
		const delta =
			((((pointerAngle - lastSample.angle) % 360) + 540) % 360) - 180;
		this.dragAngle += delta;
		this.dragSamples.push({
			angle: lastSample.angle + delta,
			time: time,
		});
		while (
			this.dragSamples.length > 2 &&
			time - this.dragSamples[0].time > 100
		) {
			this.dragSamples.shift();
		}
	}

	private getBend(): number {
		return (this.tipOffset / this.contactAngle) * 12;
	}

	private getClearanceShift(): number {
		if (!this.hasGaps) {
			return 0;
		}
		const clearance = this.contactAngle / 2;
		const lowerGapOffset = this.angle - 90 - this.slot * this.segmentAngle;
		const upperGapOffset = lowerGapOffset - this.segmentAngle;
		if (lowerGapOffset < clearance) {
			return clearance - lowerGapOffset;
		}
		if (upperGapOffset > -clearance) {
			return -clearance - upperGapOffset;
		}
		return 0;
	}

	public static getItems(settings: SettingsInfo, names: string[]): string[] {
		const items: string[] = [];
		for (
			let number = parseInt(settings.minimum);
			number <= parseInt(settings.maximum) && items.length < 1000;
			number++
		) {
			if (
				(settings.oddOnly && number % 2 === 0) ||
				(settings.evenOnly && number % 2 !== 0)
			) {
				continue;
			}
			items.push(names[number - 1] || number.toString());
		}
		return items;
	}

	public static getMaximum(settings: SettingsInfo, names: string[]): string {
		return !Wheel.checkIfEntered() &&
			settings.minimum === "1" &&
			settings.maximum === "60" &&
			names.length === 0
			? "10"
			: settings.maximum;
	}

	private static getPoint(angle: number): string {
		const radian = (angle * Math.PI) / 180;
		return `${500 * Math.sin(radian)} ${-500 * Math.cos(radian)}`;
	}

	public static getPointerAngle(
		clientX: number,
		clientY: number,
		rect: DOMRect,
	): number {
		return (
			(Math.atan2(
				clientY - (rect.top + rect.height / 2),
				clientX - (rect.left + rect.width / 2),
			) *
				180) /
			Math.PI
		);
	}

	public getPointerPath(): string {
		const tipY = 4 + this.getBend();
		return `M40 2.5 Q20 2.5 1.5 ${tipY - 0.7} A0.7 0.7 0 0 0 1.5 ${tipY + 0.7} Q20 5.5 40 5.5 A1.5 1.5 0 0 0 40 2.5 Z`;
	}

	public static getSegmentPath(index: number, total: number): string {
		if (total === 1) {
			return "M0 -500 A500 500 0 1 1 0 500 A500 500 0 1 1 0 -500 Z";
		}
		const angle = 360 / total;
		const start = Wheel.getPoint(index * angle);
		const end = Wheel.getPoint((index + 1) * angle);
		return `M0 0 L${start} A500 500 0 0 1 ${end} Z`;
	}

	public getWinnerIndex(): number {
		return (
			(((-this.slot - 1) % this.segmentCount) + this.segmentCount) %
			this.segmentCount
		);
	}

	public grab(pointerAngle: number, time: number): void {
		this.dragAngle = this.angle;
		this.dragSamples = [
			{
				angle: pointerAngle,
				time: time,
			},
		];
		this.isBraking = false;
		this.isDragging = true;
		this.velocity = 0;
	}

	public release(time: number): number {
		if (!this.isDragging) {
			return 0;
		}
		const firstSample = this.dragSamples[0];
		const lastSample = this.dragSamples[this.dragSamples.length - 1];
		const duration = (lastSample.time - firstSample.time) / 1000;
		const hasHandStopped = time - lastSample.time > 50;
		this.isDragging = false;
		this.velocity =
			hasHandStopped || duration === 0
				? 0
				: (lastSample.angle - firstSample.angle) / duration;
		return this.velocity;
	}

	public setSegments(segmentCount: number, hasGaps: boolean): void {
		this.segmentCount = segmentCount;
		this.segmentAngle = 360 / segmentCount;
		this.contactAngle = Math.min(1, this.segmentAngle * 0.1);
		this.hasGaps = hasGaps;
		if (!hasGaps) {
			this.tipOffset = 0;
		}
		this.slot = Math.floor(
			(this.angle - 90 - this.tipOffset) / this.segmentAngle,
		);
	}

	public spin(velocity: number): void {
		this.isBraking = false;
		this.velocity = velocity;
	}

	public update(frameTime: number): void {
		const travel = this.isDragging
			? this.dragAngle - this.angle
			: this.velocity * frameTime;
		const stepCount = Math.min(
			2000,
			Math.max(1, Math.ceil((Math.abs(travel) * 5) / this.contactAngle)),
		);
		const stepTime = frameTime / stepCount;
		const friction = this.isBraking ? 1540 : 40;
		this.hasHitPeg = false;
		for (let step = 0; step < stepCount; step++) {
			if (this.isDragging) {
				this.angle += travel / stepCount;
				this.updateTip(stepTime);
				continue;
			}
			const slowdown =
				(friction + 0.5 * Math.abs(this.velocity)) * stepTime;
			this.velocity =
				Math.abs(this.velocity) <= slowdown
					? 0
					: this.velocity - Math.sign(this.velocity) * slowdown;
			this.updateTip(stepTime);
			if (this.isTouching) {
				this.velocity -= 150 * this.getBend() * stepTime;
			}
			this.angle += this.velocity * stepTime;
			if (this.velocity === 0 && !this.isTouching) {
				this.angle +=
					this.getClearanceShift() * Math.min(1, stepTime / 0.05);
			}
		}
	}

	private updateTip(stepTime: number): void {
		if (!this.hasGaps) {
			this.slot = Math.floor((this.angle - 90) / this.segmentAngle);
			this.isTouching = false;
			return;
		}
		const lowerGapOffset = this.angle - 90 - this.slot * this.segmentAngle;
		const upperGapOffset = lowerGapOffset - this.segmentAngle;
		const relaxedOffset = this.tipOffset * Math.exp(-stepTime / 0.05);
		if (relaxedOffset < upperGapOffset) {
			this.tipOffset = Math.min(upperGapOffset, this.contactAngle);
			if (upperGapOffset > this.contactAngle) {
				this.slot++;
			}
		} else if (relaxedOffset > lowerGapOffset) {
			this.tipOffset = Math.max(lowerGapOffset, -this.contactAngle);
			if (lowerGapOffset < -this.contactAngle) {
				this.slot--;
			}
		} else {
			this.tipOffset = relaxedOffset;
		}
		const isTouching =
			this.tipOffset !== relaxedOffset &&
			Math.abs(this.tipOffset) > this.contactAngle / 120;
		if (isTouching && !this.isTouching) {
			this.hasHitPeg = true;
		}
		this.isTouching = isTouching;
	}
}
