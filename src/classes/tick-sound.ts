export class TickSound {
	private audioContext: AudioContext | null = null;
	private buffer: AudioBuffer | null = null;

	private static createBuffer(audioContext: AudioContext): AudioBuffer {
		const sampleRate = audioContext.sampleRate;
		const buffer = audioContext.createBuffer(
			1,
			Math.ceil(sampleRate * 0.03),
			sampleRate,
		);
		const samples = buffer.getChannelData(0);
		for (let index = 0; index < samples.length; index++) {
			const time = index / sampleRate;
			const noise = (Math.random() * 2 - 1) * Math.exp(-time / 0.0015);
			const tone =
				Math.sin(2 * Math.PI * 1800 * time) * Math.exp(-time / 0.005);
			samples[index] = 0.15 * (noise + tone);
		}
		return buffer;
	}

	public play(): void {
		if (
			!this.audioContext ||
			!this.buffer ||
			this.audioContext.state !== "running"
		) {
			return;
		}
		const source = this.audioContext.createBufferSource();
		source.buffer = this.buffer;
		source.connect(this.audioContext.destination);
		source.start();
	}

	public unlock(): void {
		if (!this.audioContext) {
			this.audioContext = new AudioContext();
			this.buffer = TickSound.createBuffer(this.audioContext);
		}
		if (this.audioContext.state !== "running") {
			void this.audioContext.resume();
		}
	}
}
