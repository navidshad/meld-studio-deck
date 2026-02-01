import { ref } from 'vue';
import { type PersistenceAdapter, LocalStorageAdapter } from './persistence/PersistenceAdapter';
import { meldClient } from './MeldClient';

export class HotkeyManager {
	private adapter: PersistenceAdapter;
	public hotkeys = ref<Record<string, string>>({});

	constructor(adapter?: PersistenceAdapter) {
		this.adapter = adapter || new LocalStorageAdapter();
		this.init();
	}

	private async init() {
		this.hotkeys.value = await this.adapter.load();
		this.syncToElectron();

		// Listen for triggers
		if (window.electronAPI) {
			window.electronAPI.onHotkeyTriggered((actionId: string) => {
				this.executeAction(actionId);
			});
		}
	}

	private syncToElectron() {
		if (window.electronAPI) {
			// Clean up empty keys
			const activeHotkeys: Record<string, string> = {};
			for (const [id, key] of Object.entries(this.hotkeys.value)) {
				if (key) activeHotkeys[id] = key;
			}
			window.electronAPI.registerHotkeys(activeHotkeys);
		}
	}

	public async setHotkey(actionId: string, shortcut: string) {
		this.hotkeys.value[actionId] = shortcut;
		await this.adapter.save(this.hotkeys.value);
		this.syncToElectron();
	}

	public async removeHotkey(actionId: string) {
		delete this.hotkeys.value[actionId];
		await this.adapter.save(this.hotkeys.value);
		this.syncToElectron();
	}

	public getHotkey(actionId: string): string | undefined {
		return this.hotkeys.value[actionId];
	}

	private executeAction(actionId: string) {
		console.log('Executing Hotkey Action:', actionId);

		// Check for built-in controls
		if (actionId === 'control_stream') {
			meldClient.toggleStream();
			return;
		}
		if (actionId === 'control_record') {
			meldClient.toggleRecord();
			return;
		}

		// Check for scenes
		// Assuming actionId for scenes is just the scene ID
		const scene = meldClient.scenes.find(s => s.id === actionId);
		if (scene) {
			meldClient.showScene(scene.id);
		}
	}
}

export const hotkeyManager = new HotkeyManager();
