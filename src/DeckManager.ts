import { ref, watch } from 'vue';

const STORAGE_KEY = 'meld_deck_pins';

export class DeckManager {
	public pinnedIds = ref<string[]>([]);

	constructor() {
		this.load();

		// Auto-save on change
		watch(this.pinnedIds, () => {
			this.save();
		}, { deep: true });
	}

	private load() {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				this.pinnedIds.value = JSON.parse(stored);
			} catch (e) {
				console.error('Failed to parse deck pins', e);
				this.pinnedIds.value = [];
			}
		} else {
			// Default pins will be handled by the UI or App.vue
			// as it needs access to the current scenes
			this.pinnedIds.value = ['control_stream', 'control_record'];
		}
	}

	private save() {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(this.pinnedIds.value));
	}

	public isPinned(id: string): boolean {
		return this.pinnedIds.value.includes(id);
	}

	public togglePin(id: string) {
		const index = this.pinnedIds.value.indexOf(id);
		if (index === -1) {
			this.pinnedIds.value.push(id);
		} else {
			this.pinnedIds.value.splice(index, 1);
		}
	}

	public setDefaults(sceneIds: string[]) {
		if (localStorage.getItem(STORAGE_KEY)) return;

		// Pin first 4 scenes
		const defaultScenes = sceneIds.slice(0, 4);
		this.pinnedIds.value = [
			...defaultScenes,
			'control_stream',
			'control_record'
		];
	}
}

export const deckManager = new DeckManager();
