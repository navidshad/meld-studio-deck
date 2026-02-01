import { reactive, ref } from 'vue';



export interface MeldScene {
	id: string;
	name: string;
	current: boolean;
	index: number;
}

export class MeldClient {
	public session = reactive<{ items: Record<string, any> }>({ items: {} });
	public isStreaming = ref(false);
	public isRecording = ref(false);
	public isConnected = ref(false);

	// Pending States for UI Feedback
	public pendingSceneId = ref<string | null>(null);
	public pendingStream = ref(false);
	public pendingRecord = ref(false);

	public meld: any = null;

	private address: string;
	private port: number;
	private socket: WebSocket | null = null;

	constructor(address = '127.0.0.1', port = 13376) {
		this.address = address;
		this.port = port;
	}

	public connect() {
		this.socket = new WebSocket(`ws://${this.address}:${this.port}`);

		this.socket.onopen = () => {
			new window.QWebChannel(this.socket, (channel: any) => {
				this.meld = channel.objects.meld;
				this.isConnected.value = true;

				// Initialize state
				this.updateState();

				// Connect signals
				this.meld.sessionChanged.connect(() => {
					this.updateState();
					// Clear pending scene if active
					const current = this.scenes.find(s => s.current);
					if (current && current.id === this.pendingSceneId.value) {
						this.pendingSceneId.value = null;
					}
				});

				this.meld.isStreamingChanged.connect(() => {
					this.isStreaming.value = this.meld.isStreaming;
					this.pendingStream.value = false;
				});

				this.meld.isRecordingChanged.connect(() => {
					this.isRecording.value = this.meld.isRecording;
					this.pendingRecord.value = false;
				});
			});
		};

		this.socket.onclose = () => {
			this.isConnected.value = false;
			this.meld = null;
			console.log('Meld Studio connection closed. Retrying in 5s...');
			setTimeout(() => this.connect(), 5000);
		};

		this.socket.onerror = (error: any) => {
			console.error('Meld Studio WebSocket error:', error);
		};
	}

	private updateState() {
		if (!this.meld) return;
		this.session.items = this.meld.session.items;
		this.isStreaming.value = this.meld.isStreaming;
		this.isRecording.value = this.meld.isRecording;
	}

	public get scenes(): MeldScene[] {
		return Object.entries(this.session.items)
			.filter(([_, item]) => item.type === 'scene')
			.map(([id, item]) => ({
				id,
				name: item.name,
				current: item.current,
				index: item.index,
			}))
			.sort((a, b) => a.index - b.index);
	}

	public showScene(id: string) {
		if (this.meld) {
			this.pendingSceneId.value = id;
			this.meld.showScene(id);
			// Fallback timeout
			setTimeout(() => {
				if (this.pendingSceneId.value === id) this.pendingSceneId.value = null;
			}, 3000);
		}
	}

	public toggleStream() {
		if (this.meld) {
			this.pendingStream.value = true;
			this.meld.toggleStream();
			setTimeout(() => { this.pendingStream.value = false; }, 3000);
		}
	}

	public toggleRecord() {
		if (this.meld) {
			this.pendingRecord.value = true;
			this.meld.toggleRecord();
			setTimeout(() => { this.pendingRecord.value = false; }, 3000);
		}
	}
}

export const meldClient = new MeldClient();
